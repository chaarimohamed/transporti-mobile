import { Platform } from 'react-native';

/**
 * API Configuration
 * 
 * Base URL selection:
 * - Development: Uses localhost with different IPs based on platform
 * - Production: Use your deployed backend URL
 */

const normalizeApiUrl = (url: string) => {
  const trimmedUrl = url.trim().replace(/\/+$/, '');
  return trimmedUrl.endsWith('/api') ? trimmedUrl : `${trimmedUrl}/api`;
};

const getDevelopmentBaseUrl = () => {
  // Android emulator reaches the host machine through 10.0.2.2.
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api';
  }

  // iOS simulator and local web can use localhost directly.
  return 'http://localhost:3000/api';
};

// Determine the base URL based on platform
const getBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

  if (envUrl) {
    return normalizeApiUrl(envUrl);
  }

  if (__DEV__) {
    return getDevelopmentBaseUrl();
  }

  // Production: replace with your deployed backend URL via EXPO_PUBLIC_API_URL when building.
  return 'https://api.transporti.tn/api';
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  TIMEOUT: 15000, // 15 seconds
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    UPDATE_PROFILE: '/auth/profile',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    DOCUMENTS: '/auth/documents',
    PROFILE_PHOTO: '/auth/profile-photo',
  },
  
  // Shipments (for Senders)
  SHIPMENTS: {
    LIST: '/shipments',
    CREATE: '/shipments',
    GET: (id: string) => `/shipments/${id}`,
    UPDATE: (id: string) => `/shipments/${id}`,
    DELETE: (id: string) => `/shipments/${id}`,
    STATS: '/shipments/stats',
    PHOTOS: (id: string) => `/shipments/${id}/photos`,
  },
  
  // Missions (for Carriers)
  MISSIONS: {
    LIST: '/missions',
    GET: (id: string) => `/missions/${id}`,
    ACCEPT: (id: string) => `/missions/${id}/accept`,
    UPDATE_STATUS: (id: string) => `/missions/${id}/status`,
    MY_MISSIONS: '/missions/my-missions',
    STATS: '/missions/stats',
  },
};
