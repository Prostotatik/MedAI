import 'dart:async';
import 'package:flutter/material.dart';
import '../models/appointment_model.dart';
import '../services/firestore_service.dart';

class AppointmentsProvider extends ChangeNotifier {
  final FirestoreService _firestoreService;
  final String userId;

  List<AppointmentModel> _upcoming = [];
  List<AppointmentModel> _past = [];
  StreamSubscription<List<AppointmentModel>>? _subscription;
  bool _isLoading = true;
  String? _error;

  AppointmentsProvider({
    required this.userId,
    required FirestoreService firestoreService,
  }) : _firestoreService = firestoreService {
    _listen();
  }

  List<AppointmentModel> get upcoming => _upcoming;
  List<AppointmentModel> get past => _past;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // First upcoming appointment for the Home screen banner
  AppointmentModel? get nextAppointment =>
      _upcoming.isNotEmpty ? _upcoming.first : null;

  void _listen() {
    _subscription =
        _firestoreService.streamUserAppointments(userId).listen((all) {
      _upcoming = all
          .where((a) =>
              a.status == AppointmentStatus.pending ||
              a.status == AppointmentStatus.confirmed)
          .toList()
        ..sort((a, b) => a.dateTime.compareTo(b.dateTime));

      _past = all
          .where((a) =>
              a.status == AppointmentStatus.cancelled ||
              a.status == AppointmentStatus.completed)
          .toList()
        ..sort((a, b) => b.dateTime.compareTo(a.dateTime));

      _isLoading = false;
      _error = null;
      notifyListeners();
    }, onError: (e) {
      _isLoading = false;
      _error = 'Failed to load appointments.';
      notifyListeners();
    });
  }

  Future<void> cancel(String appointmentId) async {
    try {
      await _firestoreService.updateAppointmentStatus(
        appointmentId,
        AppointmentStatus.cancelled,
        StatusSource.medai,
      );
    } catch (e) {
      _error = 'Failed to cancel appointment.';
      notifyListeners();
    }
  }

  @override
  void dispose() {
    _subscription?.cancel();
    super.dispose();
  }
}
