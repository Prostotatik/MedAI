# MedAI

A healthcare platform that combines AI-powered symptom assessment with appointment booking, connecting patients to hospitals through a unified mobile and web experience.

# Pitching Video

https://drive.google.com/file/d/1xxHxC23YlhEBAefE9tM5Tz9bgZwpsrjZ/view?usp=drive_link

## Overview

MedAI consists of two components:

- **Mobile App** - Flutter-based patient application for AI chat consultations and appointment management
- **Web Portal** - React-based dashboard for hospital managers to manage appointments and integrations

## Features

### Patient Mobile App
- AI-powered symptom collection and triage using Z.AI API
- Secure user authentication via Firebase
- Appointment booking with specialist and time slot selection
- Chat history and appointment tracking
- Multi-language support ready
- Cross-platform (iOS/Android)

### Hospital Web Portal
- Dashboard for appointment management
- Hospital system integration interface
- Account and settings management
- Modern, responsive UI components

## Tech Stack

### Mobile App (Flutter)
- **Framework**: Flutter SDK >=3.0.0
- **State Management**: Provider
- **Backend**: Firebase (Auth, Firestore, Storage, Messaging)
- **AI Integration**: Z.AI API (`ilmu-glm-5.1` model)
- **Key Packages**:
  - `google_fonts` - Typography
  - `intl` - Internationalization
  - `image_picker` - Image capture/upload
  - `flutter_secure_storage` - Secure local storage

### Web Portal (React)
- **Framework**: React 19 + Vite
- **Routing**: React Router DOM
- **UI**: Custom component library with consistent design system
- **Build Tool**: Vite 8

## Getting Started

### Prerequisites

- Flutter SDK >=3.0.0
- Node.js >=18
- Firebase project with configured services
- Z.AI API key

### Mobile App Setup

```bash
cd medai_mobile

# Install dependencies
flutter pub get

# Configure Firebase (if not already done)
flutterfire configure

# Run on connected device/emulator
flutter run

# Run analysis
flutter analyze

# Run tests
flutter test
```

### Web Portal Setup

```bash
cd website

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

## Project Structure

```
MedAI/
├── medai_mobile/          # Flutter mobile application
│   ├── lib/
│   │   ├── main.dart      # App entry point
│   │   ├── core/          # Constants and configuration
│   │   ├── models/        # Data models
│   │   ├── providers/     # State management
│   │   ├── screens/       # UI screens
│   │   ├── services/      # Business logic
│   │   ├── theme/         # App theming
│   │   └── widgets/       # Reusable widgets
│   └── test/
└── website/               # React web portal
    ├── src/
    │   ├── main.jsx       # Entry point
    │   ├── App.jsx        # Router setup
    │   ├── pages/         # Page components
    │   └── components/    # UI components
    └── public/

```

## Architecture

### AI Chat Flow

The AI service uses XML-delimited structured data extraction for conversational symptom collection:

```
Patient: "I have a headache"
AI: [Asks follow-up questions]
<SYMPTOMS_COMPLETE>{"mainComplaint":"headache","duration":"2 days"}</SYMPTOMS_COMPLETE>
```

This pattern allows structured data extraction while maintaining natural conversation flow.

### State Management

- **Mobile**: Provider pattern for reactive state management
- **Web**: React hooks with context for global state

## Configuration

### Environment Variables

Create appropriate configuration files for:

- Firebase project credentials
- Z.AI API key (`https://api.ilmu.ai/v1`)
- Any hospital-specific integration endpoints

## Testing

```bash
# Mobile tests
cd medai_mobile
flutter test

# Web linting
cd website
npm run lint
```

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and analysis
4. Submit a pull request

## License

This project is proprietary software. All rights reserved.

---

Built with Flutter and React for modern healthcare delivery.
