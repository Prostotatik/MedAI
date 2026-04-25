import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

enum AppointmentStatus { pending, confirmed, cancelled, completed }

enum StatusSource { medai, hospitalPostback }

class AppointmentModel {
  final String id;
  final String userId;
  final String hospitalId;
  final String hospitalName;
  final String specialistId;
  final String specialistName;
  final String specialty;
  final String externalSlotId;
  final String externalAppointmentId;
  final DateTime dateTime;
  final AppointmentStatus status;
  final StatusSource statusSource;
  final DateTime createdAt;
  final DateTime updatedAt;
  final bool createdViaAI;

  const AppointmentModel({
    required this.id,
    required this.userId,
    required this.hospitalId,
    required this.hospitalName,
    required this.specialistId,
    required this.specialistName,
    required this.specialty,
    required this.externalSlotId,
    required this.externalAppointmentId,
    required this.dateTime,
    required this.status,
    required this.statusSource,
    required this.createdAt,
    required this.updatedAt,
    required this.createdViaAI,
  });

  String get statusLabel {
    switch (status) {
      case AppointmentStatus.pending:
        return 'Pending';
      case AppointmentStatus.confirmed:
        return 'Confirmed';
      case AppointmentStatus.cancelled:
        return 'Cancelled';
      case AppointmentStatus.completed:
        return 'Completed';
    }
  }

  Color get statusColor {
    switch (status) {
      case AppointmentStatus.pending:
        return AppColors.warning500;
      case AppointmentStatus.confirmed:
        return AppColors.success500;
      case AppointmentStatus.cancelled:
        return AppColors.error500;
      case AppointmentStatus.completed:
        return AppColors.primary600;
    }
  }

  String get doctorInitials {
    final parts = specialistName.replaceFirst('Dr. ', '').trim().split(' ');
    if (parts.length >= 2) return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    return parts.isNotEmpty ? parts[0][0].toUpperCase() : '??';
  }

  factory AppointmentModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return AppointmentModel(
      id: doc.id,
      userId: data['userId'] ?? '',
      hospitalId: data['hospitalId'] ?? '',
      hospitalName: data['hospitalName'] ?? '',
      specialistId: data['specialistId'] ?? '',
      specialistName: data['specialistName'] ?? '',
      specialty: data['specialty'] ?? '',
      externalSlotId: data['externalSlotId'] ?? '',
      externalAppointmentId: data['externalAppointmentId'] ?? '',
      dateTime: (data['dateTime'] as Timestamp?)?.toDate() ?? DateTime.now(),
      status: _parseStatus(data['status']),
      statusSource: data['statusSource'] == 'hospital_postback'
          ? StatusSource.hospitalPostback
          : StatusSource.medai,
      createdAt: (data['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      updatedAt: (data['updatedAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      createdViaAI: data['createdViaAI'] ?? false,
    );
  }

  Map<String, dynamic> toFirestore() => {
        'userId': userId,
        'hospitalId': hospitalId,
        'hospitalName': hospitalName,
        'specialistId': specialistId,
        'specialistName': specialistName,
        'specialty': specialty,
        'externalSlotId': externalSlotId,
        'externalAppointmentId': externalAppointmentId,
        'dateTime': Timestamp.fromDate(dateTime),
        'status': status.name,
        'statusSource': statusSource == StatusSource.hospitalPostback
            ? 'hospital_postback'
            : 'medai',
        'createdAt': Timestamp.fromDate(createdAt),
        'updatedAt': Timestamp.fromDate(updatedAt),
        'createdViaAI': createdViaAI,
      };

  AppointmentModel copyWithStatus(AppointmentStatus newStatus) {
    return AppointmentModel(
      id: id,
      userId: userId,
      hospitalId: hospitalId,
      hospitalName: hospitalName,
      specialistId: specialistId,
      specialistName: specialistName,
      specialty: specialty,
      externalSlotId: externalSlotId,
      externalAppointmentId: externalAppointmentId,
      dateTime: dateTime,
      status: newStatus,
      statusSource: StatusSource.medai,
      createdAt: createdAt,
      updatedAt: DateTime.now(),
      createdViaAI: createdViaAI,
    );
  }

  static AppointmentStatus _parseStatus(String? raw) {
    switch (raw) {
      case 'confirmed':
        return AppointmentStatus.confirmed;
      case 'cancelled':
        return AppointmentStatus.cancelled;
      case 'completed':
        return AppointmentStatus.completed;
      default:
        return AppointmentStatus.pending;
    }
  }
}
