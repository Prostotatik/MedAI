import 'dart:io';
import 'package:flutter/material.dart';
import '../models/chat_message_model.dart';
import '../models/appointment_model.dart';
import '../models/slot_model.dart';
import '../services/ai_service.dart';
import '../services/firestore_service.dart';
import '../services/storage_service.dart';

enum ChatState {
  idle,
  collectingSymptoms,
  generatingVerdict,
  bookingPrompt,
  collectingBookingPrefs,
  fetchingSlots,
  showingSlots,
  booked,
  declined,
}

class ChatProvider extends ChangeNotifier {
  final AIService _aiService;
  final FirestoreService _firestoreService;
  final StorageService _storageService;
  final String userId;

  final List<ChatMessageModel> _messages = [];
  ChatState _state = ChatState.idle;
  bool _isTyping = false;
  String? _error;

  final List<Map<String, dynamic>> _symptomHistory = [];
  final List<Map<String, dynamic>> _bookingHistory = [];

  Map<String, dynamic>? _symptomData;
  String? _recommendedSpecialty;

  ChatProvider({
    required AIService aiService,
    required FirestoreService firestoreService,
    required StorageService storageService,
    required this.userId,
  })  : _aiService = aiService,
        _firestoreService = firestoreService,
        _storageService = storageService;

  List<ChatMessageModel> get messages => List.unmodifiable(_messages);
  ChatState get state => _state;
  bool get isTyping => _isTyping;
  String? get error => _error;

  // ── Public API ─────────────────────────────────────────────────────────────

  void startConversation() {
    if (_state != ChatState.idle) return;

    _addAI(
      "Hello! I'm your MedAI health assistant. 👋\n\n"
      "I'm here to help you find the right specialist and book an appointment. "
      "Could you describe your main symptoms or health concern today?",
    );
    _state = ChatState.collectingSymptoms;
    notifyListeners();
  }

  void resetChat() {
    _messages.clear();
    _state = ChatState.idle;
    _isTyping = false;
    _error = null;
    _symptomHistory.clear();
    _bookingHistory.clear();
    _symptomData = null;
    _recommendedSpecialty = null;
    notifyListeners();
    startConversation();
  }

  Future<void> sendMessage(String text) async {
    if (text.trim().isEmpty) return;
    if (_isTyping) return;

    _addUser(text);

    switch (_state) {
      case ChatState.collectingSymptoms:
        await _handleSymptomMessage(text);
        break;
      case ChatState.collectingBookingPrefs:
        await _handleBookingMessage(text);
        break;
      default:
        break;
    }
  }

  Future<void> sendDocument(File file, String name, {bool isImage = false}) async {
    if (_isTyping) return;

    _setTyping(true);
    try {
      final url = await _storageService.uploadDocument(userId, file, name);
      _setTyping(false);

      _messages.add(isImage
          ? ChatMessageModel.image(url)
          : ChatMessageModel.document(url, name));
      notifyListeners();

      if (_state == ChatState.idle) {
        _state = ChatState.collectingSymptoms;
      }

      if (_state == ChatState.collectingSymptoms ||
          _state == ChatState.collectingBookingPrefs) {
        final contextText = isImage
            ? 'I have shared a medical image or photo of my condition/test result for your review.'
            : 'I have uploaded a medical document: $name. Please take it into account.';
        _symptomHistory.add({'role': 'user', 'content': contextText});
        _setTyping(true);
        final result =
            await _aiService.continueSymptomCollection(_symptomHistory);
        _setTyping(false);
        _addAI(result.aiText);
        _symptomHistory.add({'role': 'assistant', 'content': result.aiText});

        if (result.isComplete) {
          _symptomData = result.symptomData;
          _state = ChatState.generatingVerdict;
          notifyListeners();
          await _generateVerdict();
        }
      }
    } catch (e) {
      _setTyping(false);
      _error = 'Failed to upload file. Please try again.';
    }
    notifyListeners();
  }

  Future<void> acceptBooking() async {
    _addUser('Yes, book now');
    _state = ChatState.collectingBookingPrefs;

    _addAI(
      'Great! To find the best options for you, I need a few quick details.\n\n'
      'What\'s your budget range for this appointment?',
    );
    notifyListeners();
  }

  Future<void> declineBooking() async {
    _addUser('Maybe later');
    _state = ChatState.declined;

    _addAI(
      'No problem! You can book an appointment anytime from the Appointments tab. '
      'Is there anything else I can help you with?',
    );

    await _saveChat(appointmentCreated: false);
    notifyListeners();
  }

  Future<void> selectSlot(SlotModel slot) async {
    if (_state != ChatState.showingSlots) return;

    _addUser(
        'I\'d like ${slot.formattedDate} at ${slot.formattedTime} with ${slot.specialistName}');

    _setTyping(true);

    try {
      await _firestoreService.createAppointment(
        AppointmentModel(
          id: '',
          userId: userId,
          hospitalId: slot.hospitalId,
          hospitalName: slot.hospitalName,
          specialistId: slot.specialistId,
          specialistName: slot.specialistName,
          specialty: slot.specialty,
          externalSlotId: slot.id,
          externalAppointmentId: 'mock_${DateTime.now().millisecondsSinceEpoch}',
          dateTime: slot.dateTime,
          status: AppointmentStatus.confirmed,
          statusSource: StatusSource.medai,
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
          createdViaAI: true,
        ),
      );

      _setTyping(false);

      _addAI(
        '✅ Your appointment has been confirmed!\n\n'
        '📅 ${slot.formattedDate} at ${slot.formattedTime}\n'
        '👨‍⚕️ ${slot.specialistName} — ${slot.specialty}\n'
        '🏥 ${slot.hospitalName}\n'
        '📍 ${slot.hospitalAddress}\n\n'
        'You can view or manage it in the Appointments tab.',
      );

      _messages.add(ChatMessageModel.confirmation(slot));
      _state = ChatState.booked;

      await _saveChat(appointmentCreated: true);
    } catch (e) {
      _setTyping(false);
      _error = 'Failed to book appointment. Please try again.';
    }
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  Future<void> _handleSymptomMessage(String text) async {
    _symptomHistory.add({'role': 'user', 'content': text});
    _setTyping(true);

    try {
      final result =
          await _aiService.continueSymptomCollection(_symptomHistory);

      _setTyping(false);
      _addAI(result.aiText);
      _symptomHistory.add({'role': 'assistant', 'content': result.aiText});

      if (result.isComplete) {
        _symptomData = result.symptomData;
        _state = ChatState.generatingVerdict;
        notifyListeners();
        await _generateVerdict();
      }
    } catch (e) {
      _setTyping(false);
      _error = 'Could not reach AI service. Check your connection.';
    }
    notifyListeners();
  }

  Future<void> _generateVerdict() async {
    _setTyping(true);

    try {
      final verdict = await _aiService.generateVerdict(_symptomData ?? {});

      _recommendedSpecialty = verdict.specialty;

      _setTyping(false);

      _addAI(
        'Based on your symptoms, I recommend seeing a **${verdict.specialty}** '
        '${verdict.urgencyLabel}.\n\n'
        '${verdict.explanation}\n\n'
        '⚠️ *This is not a medical diagnosis. Please consult a healthcare professional.*',
      );

      await Future.delayed(const Duration(milliseconds: 400));
      _messages.add(ChatMessageModel.bookingPrompt());
      _state = ChatState.bookingPrompt;
    } catch (e) {
      _setTyping(false);
      _recommendedSpecialty = 'General Practice';
      _addAI(
        'Based on your symptoms, I recommend seeing a **General Practice** doctor '
        'for an initial evaluation.\n\n'
        '⚠️ *Please consult a healthcare professional for proper diagnosis.*',
      );
      _messages.add(ChatMessageModel.bookingPrompt());
      _state = ChatState.bookingPrompt;
    }
    notifyListeners();
  }

  Future<void> _handleBookingMessage(String text) async {
    _bookingHistory.add({'role': 'user', 'content': text});
    _setTyping(true);

    try {
      final result =
          await _aiService.continueBookingCollection(_bookingHistory);

      _setTyping(false);
      _addAI(result.aiText);
      _bookingHistory.add({'role': 'assistant', 'content': result.aiText});

      if (result.isComplete) {
        _state = ChatState.fetchingSlots;
        notifyListeners();
        await _fetchAndShowSlots();
      }
    } catch (e) {
      _setTyping(false);
      _error = 'Could not reach AI service. Check your connection.';
    }
    notifyListeners();
  }

  Future<void> _fetchAndShowSlots() async {
    _setTyping(true);
    try {
      final slots = await _firestoreService
          .getAvailableSlots(_recommendedSpecialty ?? 'General Practice');

      _setTyping(false);

      if (slots.isEmpty) {
        _addAI(
          'Sorry, I couldn\'t find available slots right now. '
          'You can try again later or browse the Appointments tab.',
        );
        _state = ChatState.declined;
      } else {
        _addAI('Here are the nearest available slots. Tap one to book:');
        _messages.add(ChatMessageModel.slotPicker(slots));
        _state = ChatState.showingSlots;
      }
    } catch (e) {
      _setTyping(false);
      _error = 'Failed to fetch available slots.';
      _state = ChatState.declined;
    }
    notifyListeners();
  }

  void _addAI(String text) => _messages.add(ChatMessageModel.ai(text));
  void _addUser(String text) => _messages.add(ChatMessageModel.user(text));

  void _setTyping(bool value) {
    _isTyping = value;
    notifyListeners();
  }

  Future<void> _saveChat({required bool appointmentCreated}) async {
    try {
      await _firestoreService.saveAIChat(
        userId: userId,
        messages: _messages
            .where((m) => m.type == ChatMessageType.text)
            .map((m) => m.toMap())
            .toList(),
        verdict: _recommendedSpecialty ?? '',
        recommendedSpecialty: _recommendedSpecialty ?? '',
        appointmentCreated: appointmentCreated,
      );
    } catch (_) {}
  }
}
