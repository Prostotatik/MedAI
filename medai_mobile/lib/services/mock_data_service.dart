import 'package:cloud_firestore/cloud_firestore.dart';
import '../services/firestore_service.dart';

class MockDataService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  final FirestoreService _firestoreService;

  MockDataService(this._firestoreService);

  static final List<Map<String, dynamic>> _hospitals = [
    {
      'id': 'hosp_kl_medical',
      'name': 'KL Medical Center',
      'address': '123 Jalan Tun Razak, Kuala Lumpur, 50400',
      'workingHours': {'Mon-Fri': '08:00-20:00', 'Sat': '08:00-14:00', 'Sun': 'Closed'},
    },
    {
      'id': 'hosp_sunway',
      'name': 'Sunway Medical Centre',
      'address': '5 Jalan Lagoon Selatan, Subang Jaya, 47500',
      'workingHours': {'Mon-Sun': '08:00-22:00'},
    },
    {
      'id': 'hosp_gleneagles',
      'name': 'Gleneagles Kuala Lumpur',
      'address': '286 & 288 Jalan Ampang, Kuala Lumpur, 50450',
      'workingHours': {'Mon-Sun': '24 Hours'},
    },
    {
      'id': 'hosp_prince_court',
      'name': 'Prince Court Medical Centre',
      'address': '39 Jalan Kia Peng, Kuala Lumpur, 50450',
      'workingHours': {'Mon-Sun': '24 Hours'},
    },
    {
      'id': 'hosp_pantai',
      'name': 'Pantai Hospital Kuala Lumpur',
      'address': '8 Jalan Bukit Pantai, Bangsar, 59100',
      'workingHours': {'Mon-Sun': '24 Hours'},
    },
    {
      'id': 'hosp_columbia',
      'name': 'Columbia Asia Hospital PJ',
      'address': '39 Jalan Ikram-Uniten, Petaling Jaya, 47810',
      'workingHours': {'Mon-Fri': '08:00-18:00', 'Sat': '08:00-13:00', 'Sun': 'Closed'},
    },
  ];

  static final Map<String, List<Map<String, dynamic>>> _specialists = {
    'hosp_kl_medical': [
      {'id': 'sp_kl_1', 'fullName': 'Dr. Sarah Chen', 'specialty': 'Cardiology', 'price': 150.0},
      {'id': 'sp_kl_2', 'fullName': 'Dr. Ahmad Rizal', 'specialty': 'Neurology', 'price': 200.0},
      {'id': 'sp_kl_3', 'fullName': 'Dr. Wei Ming Tan', 'specialty': 'Orthopedics', 'price': 180.0},
      {'id': 'sp_kl_4', 'fullName': 'Dr. Priya Nair', 'specialty': 'General Practice', 'price': 80.0},
    ],
    'hosp_sunway': [
      {'id': 'sp_sw_1', 'fullName': 'Dr. Michael Lim', 'specialty': 'Dermatology', 'price': 120.0},
      {'id': 'sp_sw_2', 'fullName': 'Dr. Anita Sharma', 'specialty': 'Pediatrics', 'price': 100.0},
      {'id': 'sp_sw_3', 'fullName': 'Dr. Robert Wong', 'specialty': 'Gastroenterology', 'price': 160.0},
    ],
    'hosp_gleneagles': [
      {'id': 'sp_gl_1', 'fullName': 'Dr. Karim Hassan', 'specialty': 'Cardiology', 'price': 220.0},
      {'id': 'sp_gl_2', 'fullName': 'Dr. Lisa Tan', 'specialty': 'Dermatology', 'price': 150.0},
      {'id': 'sp_gl_3', 'fullName': 'Dr. James Ooi', 'specialty': 'Orthopedics', 'price': 230.0},
      {'id': 'sp_gl_4', 'fullName': 'Dr. Mei Lin Chow', 'specialty': 'Neurology', 'price': 250.0},
    ],
    'hosp_prince_court': [
      {'id': 'sp_pc_1', 'fullName': 'Dr. Suresh Kumar', 'specialty': 'ENT', 'price': 130.0},
      {'id': 'sp_pc_2', 'fullName': 'Dr. Natasha Ibrahim', 'specialty': 'Pediatrics', 'price': 120.0},
      {'id': 'sp_pc_3', 'fullName': 'Dr. David Ng', 'specialty': 'General Practice', 'price': 70.0},
    ],
    'hosp_pantai': [
      {'id': 'sp_pt_1', 'fullName': 'Dr. Aisha Mohd', 'specialty': 'Cardiology', 'price': 180.0},
      {'id': 'sp_pt_2', 'fullName': 'Dr. Chen Wei', 'specialty': 'Pulmonology', 'price': 160.0},
      {'id': 'sp_pt_3', 'fullName': 'Dr. Raj Patel', 'specialty': 'Orthopedics', 'price': 190.0},
    ],
    'hosp_columbia': [
      {'id': 'sp_ca_1', 'fullName': 'Dr. Hakim Zulkifli', 'specialty': 'General Practice', 'price': 60.0},
      {'id': 'sp_ca_2', 'fullName': 'Dr. Grace Loh', 'specialty': 'Dermatology', 'price': 110.0},
      {'id': 'sp_ca_3', 'fullName': 'Dr. Arjun Singh', 'specialty': 'Gastroenterology', 'price': 140.0},
    ],
  };

  Future<void> seed() async {
    if (await _firestoreService.isMockDataSeeded()) return;

    final batch = _db.batch();
    final now = DateTime.now();

    for (final hospital in _hospitals) {
      final hospId = hospital['id'] as String;
      final hospRef = _db.collection('hospitals').doc(hospId);

      batch.set(hospRef, {
        'name': hospital['name'],
        'address': hospital['address'],
        'workingHours': hospital['workingHours'],
        'country': 'Malaysia',
        'defaultLanguage': 'en-MY',
        'integration': {
          'apiBaseUrl': 'https://mock.${hospId.replaceAll('_', '-')}.api',
          'medaiApiKeyMasked': 'med_••••••••abc',
          'postbackEnabled': true,
          'lastSyncAt': Timestamp.fromDate(now),
        },
      });

      final specialists = _specialists[hospId] ?? [];
      for (final spec in specialists) {
        final specRef = hospRef.collection('specialists').doc(spec['id'] as String);
        batch.set(specRef, {
          'fullName': spec['fullName'],
          'specialty': spec['specialty'],
          'price': spec['price'],
          'isActive': true,
          'updatedAt': Timestamp.fromDate(now),
        });

        // Generate slots for next 7 days
        _generateSlots(
          batch: batch,
          hospitalId: hospId,
          hospitalName: hospital['name'] as String,
          hospitalAddress: hospital['address'] as String,
          specialistId: spec['id'] as String,
          specialistName: spec['fullName'] as String,
          specialty: spec['specialty'] as String,
          price: spec['price'] as double,
          now: now,
        );
      }
    }

    await batch.commit();
    await _firestoreService.markMockDataSeeded();
  }

  void _generateSlots({
    required WriteBatch batch,
    required String hospitalId,
    required String hospitalName,
    required String hospitalAddress,
    required String specialistId,
    required String specialistName,
    required String specialty,
    required double price,
    required DateTime now,
  }) {
    final slotTimes = [9, 10, 11, 14, 15, 16]; // hours
    final expiresAt = now.add(const Duration(days: 14));

    for (int day = 1; day <= 7; day++) {
      final date = now.add(Duration(days: day));
      if (date.weekday == DateTime.sunday) continue;

      final cacheId =
          '${hospitalId}_${date.year}${date.month.toString().padLeft(2, '0')}${date.day.toString().padLeft(2, '0')}_${specialty.replaceAll(' ', '_')}';

      final freeSlots = <Map<String, dynamic>>[];
      for (int i = 0; i < slotTimes.length; i++) {
        final slotTime =
            DateTime(date.year, date.month, date.day, slotTimes[i]);
        freeSlots.add({
          'slotId': '${specialistId}_${day}_$i',
          'hospitalId': hospitalId,
          'hospitalName': hospitalName,
          'hospitalAddress': hospitalAddress,
          'specialistId': specialistId,
          'specialistName': specialistName,
          'specialty': specialty,
          'dateTime': Timestamp.fromDate(slotTime),
          'price': price,
        });
      }

      final ref = _db.collection('slotCache').doc(cacheId);
      batch.set(ref, {
        'hospitalId': hospitalId,
        'specialty': specialty,
        'date':
            '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}',
        'freeSlots': freeSlots,
        'fetchedAt': Timestamp.fromDate(now),
        'expiresAt': Timestamp.fromDate(expiresAt),
      }, SetOptions(merge: true));
    }
  }
}
