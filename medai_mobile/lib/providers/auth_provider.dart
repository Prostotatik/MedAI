import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';
import '../services/firestore_service.dart';
import '../services/mock_data_service.dart';
import '../core/constants.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService;
  final FirestoreService _firestoreService;

  User? _firebaseUser;
  UserModel? _userModel;
  bool _isLoading = true;
  bool _onboardingDone = false;
  String? _error;

  AuthProvider({
    required AuthService authService,
    required FirestoreService firestoreService,
  })  : _authService = authService,
        _firestoreService = firestoreService {
    _init();
  }

  User? get firebaseUser => _firebaseUser;
  UserModel? get userModel => _userModel;
  bool get isLoading => _isLoading;
  bool get onboardingDone => _onboardingDone;
  bool get isAuthenticated => _firebaseUser != null;
  String? get error => _error;

  Future<void> _init() async {
    final prefs = await SharedPreferences.getInstance();
    _onboardingDone = prefs.getBool(AppConstants.keyOnboardingDone) ?? false;

    _authService.authStateChanges.listen((user) async {
      _firebaseUser = user;
      if (user != null) {
        await _loadUserModel(user.uid);
        await _seedMockDataIfNeeded();
      } else {
        _userModel = null;
      }
      _isLoading = false;
      notifyListeners();
    });
  }

  Future<void> _loadUserModel(String uid) async {
    try {
      _userModel = await _firestoreService.getUser(uid);
    } catch (_) {}
  }

  Future<void> _seedMockDataIfNeeded() async {
    try {
      final seeder = MockDataService(_firestoreService);
      await seeder.seed();
    } catch (_) {}
  }

  Future<void> completeOnboarding() async {
    _onboardingDone = true;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(AppConstants.keyOnboardingDone, true);
    notifyListeners();
  }

  Future<void> signIn(String email, String password) async {
    _clearError();
    _isLoading = true;
    notifyListeners();
    try {
      await _authService.signIn(email: email, password: password);
    } on FirebaseAuthException catch (e) {
      _error = _mapFirebaseError(e.code);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> register({
    required String email,
    required String password,
    required String fullName,
    required String passport,
    required String phone,
  }) async {
    _clearError();
    _isLoading = true;
    notifyListeners();
    try {
      final cred = await _authService.register(email: email, password: password);
      final user = UserModel(
        uid: cred.user!.uid,
        fullName: fullName,
        passport: passport,
        phone: phone,
        email: email,
        createdAt: DateTime.now(),
      );
      await _firestoreService.createUser(user);
      _userModel = user;
    } on FirebaseAuthException catch (e) {
      _error = _mapFirebaseError(e.code);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> signOut() async {
    await _authService.signOut();
    _userModel = null;
    notifyListeners();
  }

  Future<void> sendPasswordResetEmail(String email) async {
    _clearError();
    try {
      await _authService.sendPasswordResetEmail(email);
    } on FirebaseAuthException catch (e) {
      _error = _mapFirebaseError(e.code);
      notifyListeners();
    }
  }

  Future<void> updateProfile(Map<String, dynamic> data) async {
    if (_firebaseUser == null) return;
    await _firestoreService.updateUser(_firebaseUser!.uid, data);
    _userModel = await _firestoreService.getUser(_firebaseUser!.uid);
    notifyListeners();
  }

  Future<void> updatePassword(String current, String newPass) async {
    _clearError();
    try {
      await _authService.reauthenticate(
          email: _firebaseUser!.email!, password: current);
      await _authService.updatePassword(newPass);
    } on FirebaseAuthException catch (e) {
      _error = _mapFirebaseError(e.code);
      notifyListeners();
      rethrow;
    }
  }

  void clearError() => _clearError();

  void _clearError() {
    _error = null;
    notifyListeners();
  }

  String _mapFirebaseError(String code) {
    switch (code) {
      case 'user-not-found':
        return 'No account found with this email.';
      case 'wrong-password':
        return 'Incorrect password.';
      case 'email-already-in-use':
        return 'This email is already registered.';
      case 'weak-password':
        return 'Password must be at least 6 characters.';
      case 'invalid-email':
        return 'Please enter a valid email address.';
      case 'too-many-requests':
        return 'Too many attempts. Please try again later.';
      case 'network-request-failed':
        return 'Network error. Check your connection.';
      default:
        return 'Authentication failed. Please try again.';
    }
  }
}
