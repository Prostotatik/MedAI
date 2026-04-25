// PLACEHOLDER — run 'flutterfire configure' to generate this file.
// See FIREBASE_SETUP.md for step-by-step instructions.

import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      throw UnsupportedError('Web not configured. Run flutterfire configure.');
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      default:
        throw UnsupportedError('Platform not configured.');
    }
  }

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyBiMs2Qq4EO_ALhTfbRXMmgAk2e_jcpqZc',
    appId: '1:832790992357:android:0d7596c2ad6354c7ec0b0c',
    messagingSenderId: '832790992357',
    projectId: 'medai-43824',
    storageBucket: 'medai-43824.firebasestorage.app',
  );

  // TODO: Replace with your actual Firebase project values after running flutterfire configure

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'TODO_REPLACE_IOS_API_KEY',
    appId: 'TODO_REPLACE_IOS_APP_ID',
    messagingSenderId: 'TODO_REPLACE_SENDER_ID',
    projectId: 'TODO_REPLACE_PROJECT_ID',
    storageBucket: 'TODO_REPLACE_PROJECT_ID.appspot.com',
    iosBundleId: 'com.example.medaiMobile',
  );
}