import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import apiClient from './api.service';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Requests push notification permissions and returns the Expo push token.
 * Returns null if running on a simulator or permissions are denied.
 */
export const registerForPushNotificationsAsync = async (): Promise<string | null> => {
  if (Platform.OS === 'web') return null;

  if (!Device.isDevice) {
    console.log('Push notifications require a physical device');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Push notification permission not granted');
    return null;
  }

  try {
    const projectId =
      Constants.easConfig?.projectId ??
      (Constants.expoConfig?.extra as any)?.eas?.projectId;

    if (!projectId) {
      console.log('Push notifications: no EAS projectId configured, skipping token registration');
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    return tokenData.data;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
};

/**
 * Registers an Expo push token with the backend so the server can send push notifications.
 */
export const registerTokenWithBackend = async (token: string): Promise<void> => {
  try {
    await apiClient.post('/notifications/register-token', { token });
  } catch (error) {
    console.error('Error registering push token with backend:', error);
  }
};
