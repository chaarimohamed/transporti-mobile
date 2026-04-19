import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../config/api.config';
import * as storage from '../utils/storage';

/**
 * API Client Service
 * 
 * Centralized HTTP client with:
 * - Automatic JWT token attachment
 * - Request/response interceptors
 * - Error handling
 */

const usesNgrok = (() => {
  try {
    return new URL(API_CONFIG.BASE_URL).hostname.includes('ngrok');
  } catch {
    return false;
  }
})();

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    ...API_CONFIG.HEADERS,
    ...(usesNgrok && {
      // Required only when the backend is exposed through ngrok.
      'ngrok-skip-browser-warning': 'true',
    }),
  },
});

/**
 * Request Interceptor
 * Automatically attaches JWT token to all requests
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Get token from storage
    const token = await storage.getToken();
    
    // Attach token to headers if it exists
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (__DEV__) {
      console.log(`🌐 ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles common response patterns and errors
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (__DEV__) {
      console.log(`✅ Response from ${response.config.url}:`, response.status);
    }
    
    return response;
  },
  async (error: AxiosError) => {
    if (__DEV__) {
      console.error('❌ Response error:', error.message);
    }
    
    // Handle specific error status codes
    if (error.response) {
      const status = error.response.status;
      
      // Unauthorized - token expired or invalid
      if (status === 401) {
        console.log('🔒 Unauthorized - clearing session');
        await storage.clearStorage();
        // You can trigger a logout or redirect here if needed
      }
      
      // Server error
      if (status >= 500) {
        console.error('🔥 Server error:', status);
      }
    } else if (error.request) {
      // Network error - no response received
      console.error('📡 Network error - no response from server');
    }
    
    return Promise.reject(error);
  }
);

/**
 * API Response type
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * API Error type
 */
export interface ApiError {
  message: string;
  statusCode?: number;
}

/**
 * Handle API errors consistently
 */
export const handleApiError = (error: any): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse>;
    
    // Server returned an error response
    if (axiosError.response?.data) {
      return {
        message: axiosError.response.data.error || 'Une erreur est survenue',
        statusCode: axiosError.response.status,
      };
    }
    
    // Network error
    if (axiosError.request) {
      return {
        message: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.',
        statusCode: 0,
      };
    }
  }
  
  // Unknown error
  return {
    message: 'Une erreur inattendue est survenue',
  };
};

export default apiClient;
