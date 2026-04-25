import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'firebase_options.dart';
import 'theme/app_theme.dart';
import 'theme/theme_provider.dart';
import 'providers/auth_provider.dart';
import 'providers/appointments_provider.dart';
import 'providers/chat_provider.dart';
import 'services/auth_service.dart';
import 'services/firestore_service.dart';
import 'services/ai_service.dart';
import 'services/storage_service.dart';
import 'screens/onboarding/onboarding_screen.dart';
import 'screens/auth/sign_in_screen.dart';
import 'screens/home/home_screen.dart';
import 'screens/ai_chat/ai_chat_screen.dart';
import 'screens/appointments/appointments_screen.dart';
import 'screens/profile/profile_screen.dart';

export 'theme/app_theme.dart' show AppColors;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);

  final authService = AuthService();
  final firestoreService = FirestoreService();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(
          create: (_) => AuthProvider(
            authService: authService,
            firestoreService: firestoreService,
          ),
        ),
      ],
      child: const MedAIApp(),
    ),
  );
}

class MedAIApp extends StatelessWidget {
  const MedAIApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<ThemeProvider>(
      builder: (_, themeProvider, __) {
        return MaterialApp(
          title: 'MedAI',
          debugShowCheckedModeBanner: false,
          theme: AppTheme.lightTheme,
          darkTheme: AppTheme.darkTheme,
          themeMode: themeProvider.themeMode,
          home: const RootScreen(),
        );
      },
    );
  }
}

/// Routes to the correct screen based on auth state and onboarding status.
class RootScreen extends StatelessWidget {
  const RootScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    if (auth.isLoading) {
      return const _SplashScreen();
    }

    if (auth.isAuthenticated) {
      // Provide AppointmentsProvider scoped to the authenticated user
      return MultiProvider(
        providers: [
          ChangeNotifierProvider(
            create: (_) => AppointmentsProvider(
              userId: auth.firebaseUser!.uid,
              firestoreService: FirestoreService(),
            ),
          ),
          ChangeNotifierProvider(
            create: (_) => ChatProvider(
              aiService: AIService(),
              firestoreService: FirestoreService(),
              storageService: StorageService(),
              userId: auth.firebaseUser!.uid,
            ),
          ),
        ],
        child: const MainScreen(),
      );
    }

    if (!auth.onboardingDone) {
      return const OnboardingScreen();
    }

    return const SignInScreen();
  }
}

class _SplashScreen extends StatelessWidget {
  const _SplashScreen();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [AppColors.primary500, AppColors.primary700],
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Icon(Icons.medical_services_outlined,
                  size: 40, color: Colors.white),
            ),
            const SizedBox(height: 24),
            const Text('MedAI',
                style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.w700,
                    color: AppColors.primary600)),
            const SizedBox(height: 8),
            Text('One AI chat. Every hospital.',
                style: TextStyle(fontSize: 14, color: AppColors.neutral500)),
            const SizedBox(height: 48),
            const CircularProgressIndicator(),
          ],
        ),
      ),
    );
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;

  void _goTo(int index) => setState(() => _currentIndex = index);

  @override
  Widget build(BuildContext context) {
    final screens = [
      HomeScreen(
        onChatTap: () => _goTo(1),
        onAppointmentsTap: () => _goTo(2),
      ),
      const AIChatScreen(),
      const AppointmentsScreen(),
      const ProfileScreen(),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: _goTo,
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.chat_bubble_outline),
            selectedIcon: Icon(Icons.chat_bubble),
            label: 'AI Chat',
          ),
          NavigationDestination(
            icon: Icon(Icons.calendar_today_outlined),
            selectedIcon: Icon(Icons.calendar_today),
            label: 'Appointments',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
