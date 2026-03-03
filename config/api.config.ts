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
  // For development - using ngrok tunnel
  const isDevelopment = __DEV__;
  
  if (isDevelopment) {
    // ngrok URL - updated automatically
    return 'https://unperceptional-unvaguely-ervin.ngrok-free.dev/api';
  }
  
  // Production: Replace with your actual backend URL
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
  },
  
  // Shipments (for Senders)
  SHIPMENTS: {
    LIST: '/shipments',
    CREATE: '/shipments',
    GET: (id: string) => `/shipments/${id}`,
    UPDATE: (id: string) => `/shipments/${id}`,
    DELETE: (id: string) => `/shipments/${id}`,
    STATS: '/shipments/stats',
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
