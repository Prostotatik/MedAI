import 'package:cloud_firestore/cloud_firestore.dart';

class HospitalModel {
  final String id;
  final String name;
  final String address;
  final Map<String, dynamic> workingHours;
  final String apiBaseUrl;
  final bool postbackEnabled;

  const HospitalModel({
    required this.id,
    required this.name,
    required this.address,
    required this.workingHours,
    required this.apiBaseUrl,
    required this.postbackEnabled,
  });

  factory HospitalModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    final integration = data['integration'] as Map<String, dynamic>? ?? {};
    return HospitalModel(
      id: doc.id,
      name: data['name'] ?? '',
      address: data['address'] ?? '',
      workingHours: data['workingHours'] ?? {},
      apiBaseUrl: integration['apiBaseUrl'] ?? '',
      postbackEnabled: integration['postbackEnabled'] ?? false,
    );
  }

  Map<String, dynamic> toFirestore() => {
        'name': name,
        'address': address,
        'workingHours': workingHours,
        'country': 'Malaysia',
        'defaultLanguage': 'en-MY',
        'integration': {
          'apiBaseUrl': apiBaseUrl,
          'postbackEnabled': postbackEnabled,
        },
      };
}
