# Android Studio Emulator Setup Guide (Linux)

## Step 1: Install Android Studio

### 1.1 Download Android Studio
```bash
# Option A: Download from official website
# Visit: https://developer.android.com/studio
# Download the Linux .tar.gz file

# Option B: Install via snap (easier)
sudo snap install android-studio --classic
```

### 1.2 Launch Android Studio
```bash
android-studio
```

## Step 2: Android Studio Initial Setup

1. **Welcome Screen**: Click "Next" through the setup wizard
2. **Install Type**: Choose "Standard" installation
3. **SDK Components**: The wizard will install:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)
   - Performance (Intel® HAXM or KVM)

4. **Accept Licenses**: Accept all license agreements

⏱️ This may take 10-20 minutes depending on your internet speed.

## Step 3: Configure Environment Variables

### 3.1 Add to your `~/.bashrc` or `~/.zshrc`:

```bash
# Open your shell config file
nano ~/.bashrc

# Add these lines at the end:
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin

# Save and exit (Ctrl+X, then Y, then Enter)
```

### 3.2 Apply the changes:
```bash
source ~/.bashrc
```

### 3.3 Verify installation:
```bash
# Check if adb is available
adb --version

# Check if SDK is configured
echo $ANDROID_HOME
# Should output: /home/your-username/Android/Sdk
```

## Step 4: Install Required SDK Packages

### 4.1 Open Android Studio SDK Manager:
1. Launch Android Studio
2. Click on "More Actions" → "SDK Manager"
   - OR: Configure → SDK Manager from welcome screen

### 4.2 Install these SDK components:

**SDK Platforms tab:**
- ✅ Android 14.0 ("UpsideDownCake") API Level 34
- ✅ Android 13.0 ("Tiramisu") API Level 33
- ✅ Show Package Details → check:
  - Android SDK Platform 34
  - Google APIs Intel x86_64 Atom System Image

**SDK Tools tab:**
- ✅ Android SDK Build-Tools
- ✅ Android Emulator
- ✅ Android SDK Platform-Tools
- ✅ Android SDK Tools
- ✅ Intel x86 Emulator Accelerator (HAXM installer)

Click "Apply" and wait for installation.

## Step 5: Create Android Virtual Device (AVD)

### 5.1 Open AVD Manager:
1. In Android Studio: Tools → Device Manager
2. OR: "More Actions" → "Virtual Device Manager"

### 5.2 Create New Device:
1. Click **"Create Device"**
2. **Select Hardware**: Choose "Pixel 5" or "Pixel 6" (recommended)
3. **System Image**: 
   - Select **API Level 34** (Android 14)
   - Choose **x86_64** image (faster)
   - Download if needed (click Download next to the image)
4. **AVD Name**: Name it "Pixel_5_API_34" or similar
5. **Advanced Settings** (Optional but recommended):
   - RAM: 2048 MB (or more if you have RAM to spare)
   - Internal Storage: 2048 MB
   - SD Card: 512 MB
   - ✅ Enable "Hardware - GLES 2.0" for better graphics
6. Click **"Finish"**

## Step 6: Enable KVM for Better Performance (Linux)

### 6.1 Check if KVM is available:
```bash
egrep -c '(vmx|svm)' /proc/cpuinfo
# If output is > 0, your CPU supports virtualization
```

### 6.2 Install KVM:
```bash
sudo apt-get install qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils

# Add your user to kvm group
sudo adduser $USER kvm

# Verify
kvm-ok
# Should say: "KVM acceleration can be used"
```

### 6.3 Reboot (required for group changes to take effect):
```bash
sudo reboot
```

## Step 7: Configure Your Expo Project

### 7.1 Navigate to mobile-app directory:
```bash
cd /mnt/c/Users/chaar/OneDrive/Bureau/transporti-app/mobile-app
```

### 7.2 Update package.json scripts (already configured!):
Your scripts are already set up:
- `npm run android` - Launches Android emulator and app
- `npm run start:lan` - Starts dev server on LAN

### 7.3 Install dependencies if needed:
```bash
npm install
```

## Step 8: Launch Your App on Emulator

### 8.1 Start the Android Emulator:

**Option A: From Android Studio**
1. Open Device Manager
2. Click ▶️ (Play button) next to your AVD

**Option B: From Command Line**
```bash
# List available emulators
emulator -list-avds

# Start the emulator (replace with your AVD name)
emulator -avd Pixel_5_API_34 &
```

### 8.2 Wait for emulator to fully boot (1-2 minutes)
You should see the Android home screen.

### 8.3 Launch your Expo app:
```bash
cd /mnt/c/Users/chaar/OneDrive/Bureau/transporti-app/mobile-app
npm run android
```

This will:
1. Start the Metro bundler
2. Build your app
3. Install it on the emulator
4. Launch the app

## Step 9: Development Workflow

### Fast Refresh is Enabled by Default!

- **Edit any file** in your project
- **Save** (Ctrl+S)
- Changes appear **instantly** in the emulator (usually < 1 second)

### Useful Commands:

```bash
# In the emulator, press R or double-tap R to reload
# Press Ctrl+M (or Cmd+M on Mac) to open dev menu

# Or shake the device (in emulator toolbar)
```

### Dev Menu Options:
- **Reload**: Manual refresh
- **Debug**: Open Chrome DevTools
- **Show Inspector**: Inspect UI elements
- **Show Performance Monitor**: Check FPS

## Step 10: Debugging

### 10.1 View Logs:
```bash
# In a new terminal
adb logcat | grep Expo

# Or React Native logs
npx react-native log-android
```

### 10.2 Chrome DevTools:
1. Open dev menu in emulator (Ctrl+M)
2. Select "Debug"
3. Chrome will open with debugger

### 10.3 React DevTools:
```bash
# Install globally
npm install -g react-devtools

# Run
react-devtools
```

## Troubleshooting

### Issue: "adb command not found"
```bash
# Ensure environment variables are set
echo $ANDROID_HOME
source ~/.bashrc
```

### Issue: Emulator is slow
- Enable KVM acceleration (see Step 6)
- Allocate more RAM to AVD
- Use x86_64 system image (not ARM)
- Close other applications

### Issue: "SDK location not found"
```bash
# Create local.properties in android folder
echo "sdk.dir=$HOME/Android/Sdk" > android/local.properties
```

### Issue: Metro bundler port conflict
```bash
# Kill process on port 8081
npx react-native start --reset-cache
```

### Issue: App not installing
```bash
# Check connected devices
adb devices

# Uninstall old version
adb uninstall com.transporti.app

# Try again
npm run android
```

## Performance Tips

1. **Keep emulator running**: Don't close it between changes
2. **Use Fast Refresh**: Don't manually reload unless needed
3. **Monitor RAM**: Close unused apps if system is slow
4. **Snapshot AVD**: Save emulator state for faster startups
5. **Use LAN mode**: `npm run start:lan` for faster connection

## Next Steps

Once everything is working:

1. ✅ Test authentication flows
2. ✅ Test shipment creation
3. ✅ Test navigation between screens
4. ✅ Verify API connections to backend
5. ✅ Test with different screen sizes (create multiple AVDs)

---

## Quick Reference Commands

```bash
# Start emulator
emulator -avd Pixel_5_API_34 &

# Run app on Android
npm run android

# View logs
adb logcat | grep -i expo

# List connected devices
adb devices

# Restart ADB
adb kill-server && adb start-server

# Clear app data
adb shell pm clear com.transporti.app
```

---

**Need Help?** 
- Android Studio docs: https://developer.android.com/studio/run/emulator
- React Native Android setup: https://reactnative.dev/docs/environment-setup
- Expo Android docs: https://docs.expo.dev/workflow/android-studio-emulator/
