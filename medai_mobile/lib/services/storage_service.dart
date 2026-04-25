import 'dart:io';
import 'package:firebase_storage/firebase_storage.dart';

class StorageService {
  final FirebaseStorage _storage = FirebaseStorage.instance;

  Future<String> uploadAvatar(String userId, File file) async {
    final ref = _storage.ref('avatars/$userId.jpg');
    await ref.putFile(file);
    return ref.getDownloadURL();
  }

  Future<void> deleteAvatar(String userId) async {
    try {
      await _storage.ref('avatars/$userId.jpg').delete();
    } catch (_) {}
  }

  Future<String> uploadDocument(String userId, File file, String fileName) async {
    final ts = DateTime.now().millisecondsSinceEpoch;
    final ref = _storage.ref('documents/$userId/${ts}_$fileName');
    await ref.putFile(file);
    return ref.getDownloadURL();
  }
}
