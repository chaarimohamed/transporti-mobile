# Transporti - Mobile App

A React Native mobile application for messaging and chat with rating features, built for both iOS and Android platforms.

## 🚀 Features

### Screens
- **M1**: Conversation List - View all active conversations
- **M2**: Active Chat - Real-time messaging interface
- **M3**: Read-Only Chat - View archived conversations
- **M4**: Conversation Details - User and trip information

### Features
- **F1**: Rating Modal - Rate your experience
- **F2**: Rating Success - Confirmation screen
- **F3**: Push Notification - Notification simulation
- **F4**: Received Ratings - View all ratings
- **F5**: Rating Detail - Detailed rating view
- **F6**: Error Toast - Error notifications

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or newer)
- **npm** or **yarn**
- **Expo CLI**: `npm install -g expo-cli`

### For iOS Development:
- **macOS** required
- **Xcode** (latest version)
- **iOS Simulator** or physical iOS device
- **CocoaPods**: `sudo gem install cocoapods`

### For Android Development:
- **Android Studio**
- **Android SDK** (API level 21 or higher)
- **Android Emulator** or physical Android device
- **Java Development Kit (JDK)**

## 🛠️ Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd /mnt/c/Users/chaar/OneDrive/Bureau/transporti
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## 🏃 Running the App

### Start Metro Bundler:
```bash
npm start
```

This will open Expo Developer Tools in your browser.

### Run on iOS:
```bash
npm run ios
```

Or press `i` in the Expo Developer Tools.

### Run on Android:
```bash
npm run android
```

Or press `a` in the Expo Developer Tools.

### Run on Web (for testing):
```bash
npm run web
```

## 📱 Testing on Physical Devices

1. Install **Expo Go** app:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code from Expo Developer Tools with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

## 🏗️ Project Structure

```
transporti/
├── .github/
│   └── copilot-instructions.md
├── components/
│   └── screens/
│       ├── M1_ConversationList.tsx
│       ├── M2_ActiveChat.tsx
│       ├── M3_ReadOnlyChat.tsx
│       ├── M4_ConversationDetails.tsx
│       ├── F1_RatingModal.tsx
│       ├── F2_RatingSuccess.tsx
│       ├── F3_NotificationPush.tsx
│       ├── F4_ReceivedRatings.tsx
│       ├── F5_RatingDetail.tsx
│       └── F6_ErrorToast.tsx
├── App.tsx
├── app.json
├── package.json
├── tsconfig.json
├── babel.config.js
└── README.md
```

## 🎨 Tech Stack

- **React Native** - Mobile app framework
- **TypeScript** - Type safety
- **Expo** - Development platform
- **React Navigation** - Navigation library (ready to integrate)

## 🔧 Development

### Type Checking:
```bash
npm run type-check
```

### Linting:
```bash
npm run lint
```

## 📦 Building for Production

### iOS:
```bash
expo build:ios
```

### Android:
```bash
expo build:android
```

## 🐛 Troubleshooting

### Metro Bundler Issues:
```bash
# Clear cache
expo start -c
```

### iOS Simulator Not Opening:
```bash
# Ensure Xcode Command Line Tools are installed
xcode-select --install
```

### Android Emulator Issues:
```bash
# Check if emulator is running
adb devices
```

## 📄 License

This project is private and confidential.

## 👥 Contributors

- Development Team

## 📞 Support

For support, please contact the development team.
