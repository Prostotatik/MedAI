import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:intl/intl.dart';

class SlotModel {
  final String id;
  final String hospitalId;
  final String hospitalName;
  final String hospitalAddress;
  final String specialistId;
  final String specialistName;
  final String specialty;
  final DateTime dateTime;
  final double price;

  const SlotModel({
    required this.id,
    required this.hospitalId,
    required this.hospitalName,
    required this.hospitalAddress,
    required this.specialistId,
    required this.specialistName,
    required this.specialty,
    required this.dateTime,
    required this.price,
  });

  String get formattedDate {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final slotDay = DateTime(dateTime.year, dateTime.month, dateTime.day);
    final diff = slotDay.difference(today).inDays;
    if (diff == 0) return 'Today';
    if (diff == 1) return 'Tomorrow';
    return DateFormat('MMM d').format(dateTime);
  }

  String get formattedTime => DateFormat('hh:mm a').format(dateTime);

  factory SlotModel.fromMap(String id, Map<String, dynamic> data) {
    return SlotModel(
      id: id,
      hospitalId: data['hospitalId'] ?? '',
      hospitalName: data['hospitalName'] ?? '',
      hospitalAddress: data['hospitalAddress'] ?? '',
      specialistId: data['specialistId'] ?? '',
      specialistName: data['specialistName'] ?? '',
      specialty: data['specialty'] ?? '',
      dateTime: (data['dateTime'] as Timestamp?)?.toDate() ?? DateTime.now(),
      price: (data['price'] ?? 0).toDouble(),
    );
  }

  Map<String, dynamic> toMap() => {
        'hospitalId': hospitalId,
        'hospitalName': hospitalName,
        'hospitalAddress': hospitalAddress,
        'specialistId': specialistId,
        'specialistName': specialistName,
        'specialty': specialty,
        'dateTime': Timestamp.fromDate(dateTime),
        'price': price,
      };
}
