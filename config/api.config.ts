import { Platform } from 'react-native';

/**
 * API Configuration
 * 
 * Base URL selection:
 * - Development: Uses localhost with different IPs based on platform
 * - Production: Use your deployed backend URL
 */

// Determine the base URL based on platform
const getBaseUrl = () => {
  const isDevelopment = __DEV__;
  const envUrl = process.env.EXPO_PUBLIC_API_URL;

  if (envUrl && envUrl.length > 0) {
    return envUrl;
  }

  if (isDevelopment) {
    // Use cloud API for testing
    return 'https://ciufp6cq05.execute-api.eu-west-1.amazonaws.com/api';
  }

  // Production: AWS API Gateway endpoint
  return 'https://ciufp6cq05.execute-api.eu-west-1.amazonaws.com/api';
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
    VERIFY_PHONE: '/auth/verify-phone',
    RESEND_OTP: '/auth/resend-otp',
    SEND_EMAIL_OTP: '/auth/send-email-otp',
    VERIFY_EMAIL: '/auth/verify-email',
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
    APPLICATIONS: (id: string) => `/shipments/${id}/applications`,
    FEEDBACK: (id: string) => `/shipments/${id}/feedback`,
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
