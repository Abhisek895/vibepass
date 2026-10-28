# VibePass Mobile - React Native Dating App

A professional, modern dating application built with React Native featuring swipe-based matching, real-time messaging, and beautiful UI/UX inspired by leading dating apps like Tinder and Bumble.

## ✨ Features

### Core Functionality
- 🔥 **Swipe-based Discovery** - Tinder-style card swiping with smooth animations
- 💝 **Smart Matching** - Like, Nope, and Super Like actions
- 💬 **Real-time Messaging** - Chat with your matches instantly
- 👤 **Rich Profiles** - Photos, bio, interests, occupation, and more
- 🎯 **Discovery Preferences** - Customize age range, distance, and preferences
- ✅ **Profile Verification** - Verified badges for authentic profiles
- 📍 **Location-based** - Find matches near you

### User Experience
- 🎨 Modern, polished UI with gradient accents
- 🌓 Light mode (dark mode ready)
- ⚡ Smooth animations and haptic feedback
- 📱 Native performance
- 🔔 Push notifications (coming soon)
- 🎥 Video chat support (coming soon)

## 🛠 Tech Stack

- **React Native 0.76.5** - Latest stable version
- **TypeScript** - Type-safe development
- **React Navigation 7** - Navigation with stack and tab navigators
- **Zustand** - Lightweight state management
- **React Native Gesture Handler** - Smooth gestures
- **React Native Reanimated** - Performant animations
- **React Native Deck Swiper** - Tinder-style card swiping
- **React Native Vector Icons** - Material Community icons
- **React Native Linear Gradient** - Beautiful gradients
- **Socket.io Client** - Real-time messaging
- **Axios** - HTTP requests

## 📁 Project Structure

```
mobile/
├── src/
│   ├── screens/           # Screen components
│   │   ├── DiscoveryScreen.tsx      # Main swipe/discovery screen
│   │   ├── MatchesScreen.tsx        # Matches list
│   │   ├── MessagesScreen.tsx       # Conversations list
│   │   ├── ChatScreen.tsx           # Individual chat
│   │   ├── ProfileScreen.tsx        # User profile & settings
│   │   ├── OnboardingScreen.tsx     # Welcome slides
│   │   └── LoginScreen.tsx          # Authentication
│   ├── components/        # Reusable components
│   ├── navigation/        # Navigation configuration
│   ├── store/            # Zustand state management
│   ├── services/         # API services
│   ├── types/            # TypeScript types
│   ├── theme/            # Design system & theme
│   ├── utils/            # Utility functions
│   ├── assets/           # Images, fonts, etc.
│   └── App.tsx           # Root component
├── android/              # Android native code
├── ios/                  # iOS native code (to be added)
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- JDK 17

### Installation

1. **Install dependencies**
   ```bash
   cd frontend/mobile
   npm install
   ```

2. **Install iOS dependencies (macOS only)**
   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **Setup environment**
   Create a `.env` file in the mobile directory:
   ```env
   API_URL=http://localhost:3000/api
   SOCKET_URL=http://localhost:3000
   ```

### Running the App

#### Android
```bash
npm run android
```

#### iOS (macOS only)
```bash
npm run ios
```

#### Start Metro bundler separately
```bash
npm start
```

## 🎨 Design System

### Colors
- **Primary**: `#FF6B6B` (Vibrant red-pink)
- **Secondary**: `#4ECDC4` (Turquoise)
- **Accent**: `#FFE66D` (Yellow)
- **Gradients**: Red-orange-yellow for CTAs
- **Like**: `#00D9A5` (Green)
- **Nope**: `#FF6B9D` (Pink)
- **Super Like**: `#4FC3F7` (Blue)

### Typography
- System fonts for native feel
- Font sizes: 12px - 48px
- Font weights: Regular (400) - Bold (700)

### Spacing
- Base unit: 4px
- Scale: 4, 8, 16, 24, 32, 48, 64

## 📱 Screens Overview

### Discovery Screen
- Card-based profile browsing
- Swipe right to like, left to nope
- Swipe up for super like
- Action buttons for accessibility
- Profile details with photos, bio, interests

### Matches Screen
- Grid of new matches with gradient borders
- List of all matches with last message
- Unread message indicators
- Quick access to conversations

### Messages Screen
- Conversation list sorted by recent activity
- Online/offline status indicators
- Unread message badges
- Search functionality

### Chat Screen
- Real-time messaging
- Message bubbles (sent/received)
- Photo sharing support
- Conversation starters
- Video call button (UI ready)

### Profile Screen
- User photos and info
- Interests tags
- Statistics (likes, matches, super likes)
- Settings sections
- Account preferences

### Authentication
- Onboarding carousel with smooth animations
- Login/Signup toggle
- Email/password authentication
- Social login buttons (Google, Facebook, Apple)
- Password visibility toggle

## 🔌 API Integration

The app is designed to work with the VibePass backend API. Update the following in your services:

```typescript
// src/services/api.ts
const API_URL = process.env.API_URL || 'http://localhost:3000/api';

// Endpoints:
// GET /users/discover - Get users for discovery
// POST /swipe - Record swipe action
// GET /matches - Get user matches
// GET /conversations/:matchId - Get messages
// POST /messages - Send message
```

## 🎯 State Management

Using Zustand for simple, performant state management:

- **useAuthStore** - Authentication state
- **useDiscoveryStore** - Discovery/swipe state
- **useMatchStore** - Matches data
- **useChatStore** - Messaging state

## 🔧 Configuration

### React Navigation
Stack navigator for main flow, bottom tabs for main screens. Configured in `src/navigation/AppNavigator.tsx`.

### Permissions
Required permissions in `AndroidManifest.xml`:
- Internet
- Camera (for photo upload)
- Photo library access
- Location (for distance-based matching)
- Notifications

## 📦 Build & Deploy

### Android APK
```bash
npm run build:android
# Output: android/app/build/outputs/apk/release/app-release.apk
```

### Android Bundle (Play Store)
```bash
npm run build:android:bundle
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

### iOS (macOS only)
1. Open `ios/VibePass.xcworkspace` in Xcode
2. Select your team and provisioning profile
3. Archive the app
4. Upload to App Store Connect

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Run linter
npm run lint
```

## 🎨 Customization

### Theme
Edit `src/theme/index.ts` to customize colors, spacing, typography, and shadows.

### Components
All screens are modular and can be easily customized. Components use the theme system for consistency.

### Mock Data
Currently using mock data in stores. Replace with actual API calls in:
- `src/store/index.ts`

## 🚧 Coming Soon

- [ ] Real-time notifications
- [ ] Video chat integration
- [ ] Photo filters and editing
- [ ] Stories feature
- [ ] In-app premium subscription
- [ ] Advanced matching algorithm
- [ ] Profile boost feature
- [ ] Undo last swipe

## 🐛 Troubleshooting

### Metro bundler issues
```bash
npm start -- --reset-cache
```

### Android build errors
```bash
cd android
./gradlew clean
cd ..
```

### Clear watchman (macOS/Linux)
```bash
watchman watch-del-all
```

## 📄 License

Private - VibePass

## 👥 Team

Built by experienced full-stack engineers with 12+ years of experience.

---

**Note**: This is a production-ready foundation. Connect it to your backend API and customize the design to match your brand!
