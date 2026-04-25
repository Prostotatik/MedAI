import 'dart:convert';
import 'package:http/http.dart' as http;
import '../core/constants.dart';

class AIService {
  static const String _endpoint =
      '${AppConstants.zaiBaseUrl}/chat/completions';

  static const String _symptomSystemPrompt = '''
You are MedAI, a professional and empathetic medical assistant helping patients in Malaysia.
Your job is to collect symptom information through a natural, caring conversation.

You must gather ALL of the following before finishing:
1. Main complaint (what is the main problem?)
2. Duration (how long have symptoms been present?)
3. Severity on a scale of 1-10
4. Associated symptoms (any other symptoms?)
5. Relevant medical history (existing conditions, past surgeries)
6. Current medications (any drugs or supplements being taken?)

Ask about 1-2 things at a time. Be warm and professional. Use simple language.

IMPORTANT: When you have collected ALL six pieces of information above, append this exact block at the end of your final response (after your conversational text):
<SYMPTOMS_COMPLETE>{"mainComplaint":"...","duration":"...","severity":7,"associatedSymptoms":"...","medicalHistory":"...","currentMedications":"..."}</SYMPTOMS_COMPLETE>
''';

  static const String _verdictSystemPrompt = '''
You are a medical triage specialist. Based on the patient's symptoms, determine the most appropriate specialist type.

Return ONLY valid JSON with this exact schema:
{"specialty":"Cardiology","urgency":"asap","explanation":"Brief 1-2 sentence explanation for the patient."}

Urgency values:
- "asap" = needs to be seen within days
- "week" = should see a doctor within a week
- "month" = can wait up to a month
- "routine" = routine check-up, any time

Common specialties: General Practice, Cardiology, Dermatology, Orthopedics, Pediatrics, Neurology, ENT, Ophthalmology, Gastroenterology, Pulmonology
''';

  static const String _bookingSystemPrompt = '''
You are MedAI helping a patient book a medical appointment in Malaysia.

Collect ALL of the following preferences:
1. Budget (in RM — ask for a comfortable range)
2. Preferred hospital (or "Any" if no preference) — mention that we have options in KL, Subang, PJ, Ampang, Bangsar
3. Preferred time of day ("morning", "afternoon", "evening") and day preference if any

Ask naturally, 1-2 questions at a time.

IMPORTANT: When you have collected all three preferences, append this exact block at the end of your response:
<BOOKING_COMPLETE>{"budget":200,"preferredHospital":"Any","preferredTime":"morning"}</BOOKING_COMPLETE>
''';

  Future<Map<String, dynamic>> _call(
    List<Map<String, dynamic>> messages, {
    bool jsonMode = false,
    double temperature = 0.7,
  }) async {
    final body = {
      'model': AppConstants.zaiModel,
      'messages': messages,
      'temperature': temperature,
      if (jsonMode) 'response_format': {'type': 'json_object'},
    };

    final response = await http.post(
      Uri.parse(_endpoint),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${AppConstants.zaiApiKey}',
      },
      body: jsonEncode(body),
    );

    if (response.statusCode != 200) {
      throw Exception('AI API error ${response.statusCode}: ${response.body}');
    }

    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  String _extractContent(Map<String, dynamic> response) {
    final choices = response['choices'] as List<dynamic>;
    return (choices[0]['message']['content'] as String).trim();
  }

  // ── Symptom collection ─────────────────────────────────────────────────────

  /// Sends the next user message and returns AI reply + whether symptoms are complete.
  Future<SymptomCollectionResult> continueSymptomCollection(
    List<Map<String, dynamic>> history,
  ) async {
    final messages = [
      {'role': 'system', 'content': _symptomSystemPrompt},
      ...history,
    ];

    final response = await _call(messages);
    String content = _extractContent(response);

    Map<String, dynamic>? symptomData;
    String displayText = content;

    if (content.contains('<SYMPTOMS_COMPLETE>')) {
      final start = content.indexOf('<SYMPTOMS_COMPLETE>') + '<SYMPTOMS_COMPLETE>'.length;
      final end = content.indexOf('</SYMPTOMS_COMPLETE>');
      if (end > start) {
        final jsonStr = content.substring(start, end).trim();
        try {
          symptomData = jsonDecode(jsonStr) as Map<String, dynamic>;
        } catch (_) {}
      }
      displayText = content.substring(0, content.indexOf('<SYMPTOMS_COMPLETE>')).trim();
    }

    return SymptomCollectionResult(
      aiText: displayText,
      symptomData: symptomData,
      isComplete: symptomData != null,
    );
  }

  // ── Verdict generation ─────────────────────────────────────────────────────

  Future<VerdictResult> generateVerdict(Map<String, dynamic> symptomData) async {
    final messages = [
      {'role': 'system', 'content': _verdictSystemPrompt},
      {
        'role': 'user',
        'content': 'Patient symptoms: ${jsonEncode(symptomData)}',
      },
    ];

    final response = await _call(messages, jsonMode: true, temperature: 0.2);
    final content = _extractContent(response);

    // Strip potential markdown code fences
    final clean = content
        .replaceAll(RegExp(r'^```(?:json)?\n?', multiLine: true), '')
        .replaceAll(RegExp(r'\n?```$', multiLine: true), '')
        .trim();

    final data = jsonDecode(clean) as Map<String, dynamic>;
    return VerdictResult(
      specialty: data['specialty'] ?? 'General Practice',
      urgency: data['urgency'] ?? 'routine',
      explanation: data['explanation'] ?? '',
    );
  }

  // ── Booking preferences collection ────────────────────────────────────────

  Future<BookingCollectionResult> continueBookingCollection(
    List<Map<String, dynamic>> history,
  ) async {
    final messages = [
      {'role': 'system', 'content': _bookingSystemPrompt},
      ...history,
    ];

    final response = await _call(messages);
    String content = _extractContent(response);

    Map<String, dynamic>? bookingData;
    String displayText = content;

    if (content.contains('<BOOKING_COMPLETE>')) {
      final start = content.indexOf('<BOOKING_COMPLETE>') + '<BOOKING_COMPLETE>'.length;
      final end = content.indexOf('</BOOKING_COMPLETE>');
      if (end > start) {
        final jsonStr = content.substring(start, end).trim();
        try {
          bookingData = jsonDecode(jsonStr) as Map<String, dynamic>;
        } catch (_) {}
      }
      displayText = content.substring(0, content.indexOf('<BOOKING_COMPLETE>')).trim();
    }

    return BookingCollectionResult(
      aiText: displayText,
      bookingData: bookingData,
      isComplete: bookingData != null,
    );
  }
}

class SymptomCollectionResult {
  final String aiText;
  final Map<String, dynamic>? symptomData;
  final bool isComplete;

  const SymptomCollectionResult({
    required this.aiText,
    required this.symptomData,
    required this.isComplete,
  });
}

class VerdictResult {
  final String specialty;
  final String urgency;
  final String explanation;

  const VerdictResult({
    required this.specialty,
    required this.urgency,
    required this.explanation,
  });

  String get urgencyLabel {
    switch (urgency) {
      case 'asap':
        return 'as soon as possible';
      case 'week':
        return 'within a week';
      case 'month':
        return 'within a month';
      default:
        return 'at your convenience';
    }
  }
}

class BookingCollectionResult {
  final String aiText;
  final Map<String, dynamic>? bookingData;
  final bool isComplete;

  const BookingCollectionResult({
    required this.aiText,
    required this.bookingData,
    required this.isComplete,
  });
}
