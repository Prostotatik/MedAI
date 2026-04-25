import 'package:cloud_firestore/cloud_firestore.dart';

class SpecialistModel {
  final String id;
  final String hospitalId;
  final String fullName;
  final String specialty;
  final double price;
  final bool isActive;

  const SpecialistModel({
    required this.id,
    required this.hospitalId,
    required this.fullName,
    required this.specialty,
    required this.price,
    required this.isActive,
  });

  String get initials {
    final parts = fullName.replaceFirst('Dr. ', '').trim().split(' ');
    if (parts.length >= 2) return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    return parts.isNotEmpty ? parts[0][0].toUpperCase() : '??';
  }

  factory SpecialistModel.fromFirestore(DocumentSnapshot doc, String hospitalId) {
    final data = doc.data() as Map<String, dynamic>;
    return SpecialistModel(
      id: doc.id,
      hospitalId: hospitalId,
      fullName: data['fullName'] ?? '',
      specialty: data['specialty'] ?? '',
      price: (data['price'] ?? 0).toDouble(),
      isActive: data['isActive'] ?? true,
    );
  }

  Map<String, dynamic> toFirestore() => {
        'fullName': fullName,
        'specialty': specialty,
        'price': price,
        'isActive': isActive,
        'updatedAt': FieldValue.serverTimestamp(),
      };
}
