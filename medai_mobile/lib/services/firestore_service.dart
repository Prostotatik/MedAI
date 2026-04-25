import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/user_model.dart';
import '../models/appointment_model.dart';
import '../models/hospital_model.dart';
import '../models/specialist_model.dart';
import '../models/slot_model.dart';

class FirestoreService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  // ── Users ──────────────────────────────────────────────────────────────────

  Future<void> createUser(UserModel user) async {
    await _db.collection('users').doc(user.uid).set(user.toFirestore());
  }

  Future<UserModel?> getUser(String uid) async {
    final doc = await _db.collection('users').doc(uid).get();
    if (!doc.exists) return null;
    return UserModel.fromFirestore(doc);
  }

  Future<void> updateUser(String uid, Map<String, dynamic> data) async {
    await _db.collection('users').doc(uid).update(data);
  }

  // ── Appointments ───────────────────────────────────────────────────────────

  Stream<List<AppointmentModel>> streamUserAppointments(String userId) {
    return _db
        .collection('appointments')
        .where('userId', isEqualTo: userId)
        .snapshots()
        .map((snap) =>
            snap.docs.map(AppointmentModel.fromFirestore).toList());
  }

  Future<String> createAppointment(AppointmentModel appointment) async {
    final ref = await _db
        .collection('appointments')
        .add(appointment.toFirestore());
    return ref.id;
  }

  Future<void> updateAppointmentStatus(
    String appointmentId,
    AppointmentStatus status,
    StatusSource source,
  ) async {
    await _db.collection('appointments').doc(appointmentId).update({
      'status': status.name,
      'statusSource': source == StatusSource.hospitalPostback
          ? 'hospital_postback'
          : 'medai',
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }

  // ── Hospitals ──────────────────────────────────────────────────────────────

  Future<List<HospitalModel>> getHospitals() async {
    final snap = await _db.collection('hospitals').get();
    return snap.docs.map(HospitalModel.fromFirestore).toList();
  }

  Future<List<SpecialistModel>> getSpecialists(String hospitalId) async {
    final snap = await _db
        .collection('hospitals')
        .doc(hospitalId)
        .collection('specialists')
        .where('isActive', isEqualTo: true)
        .get();
    return snap.docs
        .map((d) => SpecialistModel.fromFirestore(d, hospitalId))
        .toList();
  }

  // ── Slot cache ─────────────────────────────────────────────────────────────

  Future<List<SlotModel>> getAvailableSlots(String specialty) async {
    final now = Timestamp.fromDate(DateTime.now());
    final snap = await _db
        .collection('slotCache')
        .where('specialty', isEqualTo: specialty)
        .where('expiresAt', isGreaterThan: now)
        .orderBy('expiresAt')
        .limit(5)
        .get();

    final slots = <SlotModel>[];
    for (final doc in snap.docs) {
      final data = doc.data();
      final freeSlots = data['freeSlots'] as List<dynamic>? ?? [];
      for (final s in freeSlots) {
        final map = Map<String, dynamic>.from(s as Map);
        final slotTime = (map['dateTime'] as Timestamp?)?.toDate();
        if (slotTime != null && slotTime.isAfter(DateTime.now())) {
          slots.add(SlotModel.fromMap(
              '${doc.id}_${map['slotId'] ?? slots.length}', map));
        }
      }
    }
    // Return up to 5 earliest slots
    slots.sort((a, b) => a.dateTime.compareTo(b.dateTime));
    return slots.take(5).toList();
  }

  Future<void> saveSlotCache(
      String cacheId, List<Map<String, dynamic>> freeSlots,
      String specialty, String hospitalId) async {
    await _db.collection('slotCache').doc(cacheId).set({
      'hospitalId': hospitalId,
      'specialty': specialty,
      'freeSlots': freeSlots,
      'fetchedAt': FieldValue.serverTimestamp(),
      'expiresAt': Timestamp.fromDate(
          DateTime.now().add(const Duration(hours: 1))),
    });
  }

  // ── AI Chats ───────────────────────────────────────────────────────────────

  Future<void> saveAIChat({
    required String userId,
    required List<Map<String, dynamic>> messages,
    required String verdict,
    required String recommendedSpecialty,
    required bool appointmentCreated,
  }) async {
    await _db.collection('aiChats').add({
      'userId': userId,
      'messages': messages,
      'verdict': verdict,
      'recommendedSpecialty': recommendedSpecialty,
      'appointmentCreated': appointmentCreated,
      'createdAt': FieldValue.serverTimestamp(),
    });
  }

  // ── Mock data flag ─────────────────────────────────────────────────────────

  Future<bool> isMockDataSeeded() async {
    final doc = await _db.collection('_meta').doc('mockData').get();
    return doc.exists && (doc.data()?['seeded'] == true);
  }

  Future<void> markMockDataSeeded() async {
    await _db
        .collection('_meta')
        .doc('mockData')
        .set({'seeded': true, 'seededAt': FieldValue.serverTimestamp()});
  }
}
