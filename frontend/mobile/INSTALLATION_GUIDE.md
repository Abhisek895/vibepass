# 🚀 Installation & Setup Guide - VibePass Mobile

Complete step-by-step guide to get the app running on your machine.

---

## 📋 Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   ```bash
   node --version  # Should be v18.0.0 or higher
   ```
   Download: https://nodejs.org/

2. **npm** (comes with Node.js)
   ```bash
   npm --version  # Should be 9.0.0 or higher
   ```

3. **JDK 17** (for Android)
   ```bash
   java -version  # Should show version 17
   ```
   Download: https://adoptium.net/

4. **Android Studio** (for Android development)
   - Download: https://developer.android.com/studio
   - Include Android SDK, Android SDK Platform, Android Virtual Device

5. **Git** (for version control)
   ```bash
   git --version
   ```
   Download: https://git-scm.com/

### Optional (for iOS - macOS only)
- Xcode 14+ from Mac App Store
- CocoaPods: `sudo gem install cocoapods`

---

## 🔧 Environment Setup

### 1. Android Studio Configuration

1. Open Android Studio
2. Go to `Settings/Preferences` → `Appearance & Behavior` → `System Settings` → `Android SDK`
3. Install the following in SDK Platforms tab:
   - Android 14.0 (API Level 34)
   - Android 13.0 (API Level 33)
   - Android 12.0 (API Level 31)

4. Install in SDK Tools tab:
   - Android SDK Build-Tools
   - Android SDK Command-line Tools
   - Android Emulator
   - Android SDK Platform-Tools

5. Set environment variables (Windows):
   ```bash
   setx ANDROID_HOME "%LOCALAPPDATA%\Android\Sdk"
   setx PATH "%PATH%;%LOCALAPPDATA%\Android\Sdk\platform-tools"
   ```

   For macOS/Linux (add to ~/.bash_profile or ~/.zshrc):
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

---

## 📦 Installation Steps

### Step 1: Navigate to Project Directory
```bash
cd C:\VibePass\frontend\mobile
```

### Step 2: Install Dependencies
```bash
npm install
```

**Expected Output:**
```
added XXX packages in XXs
```

**If you see errors:**
- Try: `npm install --legacy-peer-deps`
- Or: `npm cache clean --force && npm install`

### Step 3: Link Native Dependencies
```bash
npx react-native link react-native-vector-icons
npx react-native link react-native-linear-gradient
```

### Step 4: Create Environment File
Create `.env` file in the mobile directory:
```bash
API_URL=http://10.0.2.2:3000/api
SOCKET_URL=http://10.0.2.2:3000
```

**Note:** `10.0.2.2` is the Android emulator's alias for localhost.
For physical devices, use your computer's IP address (e.g., `http://192.168.1.100:3000`)

---

## 🤖 Running on Android

### Option A: Using Android Emulator (Recommended for Testing)

1. **Create an AVD (Android Virtual Device)**
   ```bash
   # Open Android Studio
   # Tools → Device Manager → Create Device
   # Choose: Pixel 6 or any device with API 34
   # System Image: API Level 34 (Android 14)
   ```

2. **Start the Emulator**
   ```bash
   # From Android Studio: Click the play button on your AVD
   # Or from command line:
   emulator -avd Pixel_6_API_34
   ```

3. **Start Metro Bundler**
   ```bash
   npm start
   ```

4. **Run the App (in new terminal)**
   ```bash
   npm run android
   ```

### Option B: Using Physical Device

1. **Enable Developer Options on your Android phone:**
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings → Developer Options
   - Enable "USB Debugging"

2. **Connect via USB**
   ```bash
   # Verify device is connected
   adb devices
   # Should show your device
   ```

3. **Run the App**
   ```bash
   npm start
   npm run android
   ```

---

## 🍎 Running on iOS (macOS only)

### Step 1: Install iOS Dependencies
```bash
cd ios
pod install
cd ..
```

### Step 2: Run on Simulator
```bash
npm run ios
```

### Step 3: Run on Specific Simulator
```bash
npm run ios -- --simulator="iPhone 15 Pro"
```

---

## 🔍 Troubleshooting

### Issue: "command not found: adb"
**Solution:**
```bash
# Add Android platform-tools to PATH
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Issue: Metro bundler port conflict
**Solution:**
```bash
# Kill existing Metro process
npx react-native start --reset-cache
```

### Issue: Android build fails with Gradle error
**Solution:**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Issue: "Unable to load script from assets"
**Solution:**
```bash
# Make sure Metro is running
npm start

# In new terminal
npm run android
```

### Issue: Red screen "Unable to resolve module"
**Solution:**
```bash
# Clear cache and restart
npm start -- --reset-cache
watchman watch-del-all  # macOS/Linux only
rm -rf node_modules
npm install
```

### Issue: Vector icons not showing
**Solution:**
```bash
# Android: Rebuild the app
cd android
./gradlew clean
cd ..
npm run android

# iOS: Re-install pods
cd ios
pod install
cd ..
npm run ios
```

### Issue: "SDK location not found"
**Solution:**
Create `local.properties` in `android/` folder:
```
sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
```

---

## 🎨 Development Tips

### Hot Reload
- Press `r` in Metro terminal to reload
- Press `d` to open Developer Menu
- Shake device to open Developer Menu

### Debug Menu Options
- **Enable Fast Refresh**: Auto-reload on code changes
- **Toggle Inspector**: Inspect element layout
- **Debug**: Open Chrome DevTools
- **Show Perf Monitor**: FPS and memory usage

### Useful Commands
```bash
# Clear cache
npm start -- --reset-cache

# Build release APK
npm run build:android

# Build Android bundle
npm run build:android:bundle

# Run on specific device
npm run android -- --deviceId=<device-id>

# Lint code
npm run lint

# Format code
npx prettier --write "src/**/*.{ts,tsx}"
```

---

## 📱 Testing on Real Device

### Find Your Computer's IP Address

**Windows:**
```bash
ipconfig
# Look for IPv4 Address (e.g., 192.168.1.100)
```

**macOS/Linux:**
```bash
ifconfig | grep "inet "
# Look for your local IP (e.g., 192.168.1.100)
```

### Update .env File
```
API_URL=http://192.168.1.100:3000/api
SOCKET_URL=http://192.168.1.100:3000
```

### Ensure Phone and Computer on Same WiFi Network

### Run the App
```bash
npm start
npm run android
```

---

## 🏗️ Build for Production

### Android Release Build

1. **Generate Release Keystore**
   ```bash
   cd android/app
   keytool -genkeypair -v -storetype PKCS12 -keystore vibepass-release.keystore -alias vibepass -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure Gradle**
   Edit `android/gradle.properties`:
   ```properties
   VIBEPASS_RELEASE_STORE_FILE=vibepass-release.keystore
   VIBEPASS_RELEASE_KEY_ALIAS=vibepass
   VIBEPASS_RELEASE_STORE_PASSWORD=your_password
   VIBEPASS_RELEASE_KEY_PASSWORD=your_password
   ```

3. **Build Release APK**
   ```bash
   npm run build:android
   # Output: android/app/build/outputs/apk/release/app-release.apk
   ```

4. **Build App Bundle (for Play Store)**
   ```bash
   npm run build:android:bundle
   # Output: android/app/build/outputs/bundle/release/app-release.aab
   ```

---

## ✅ Verification Checklist

After installation, verify:

- [ ] Metro bundler starts without errors
- [ ] App builds successfully
- [ ] App launches on emulator/device
- [ ] No red error screens
- [ ] Onboarding carousel works
- [ ] Can navigate between screens
- [ ] Bottom tabs are visible
- [ ] Icons are displaying correctly
- [ ] Gradients are rendering
- [ ] Swipe gestures work

---

## 📞 Support

### Common Commands Reference
```bash
# Install dependencies
npm install

# Start Metro
npm start

# Run Android
npm run android

# Run iOS
npm run ios

# Clear cache
npm start -- --reset-cache

# Clean Android build
cd android && ./gradlew clean && cd ..

# Reinstall everything
rm -rf node_modules && npm install
```

### Getting Help
1. Check the QA_REPORT.md for known issues
2. Review the README.md for architecture details
3. Check React Native documentation: https://reactnative.dev/
4. Check Stack Overflow for specific errors

---

## 🎉 Success!

If you see the VibePass onboarding screen, congratulations! 🎊

The app is now running. You can:
- Swipe through the onboarding
- Test the login screen
- Navigate through all tabs
- Check all screens

**Next Steps:**
1. Connect to your backend API
2. Replace mock data with real data
3. Add app icons and splash screen
4. Test on physical devices
5. Add unit tests

---

**Last Updated:** 2026-10-27  
**Version:** 1.0.0  
**Status:** ✅ Ready for Development
