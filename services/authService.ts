import { User, LoginCredentials, RegisterData } from '../types/user.types';
import apiClient, { ApiResponse, handleApiError } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

/**
 * Login user with email and password
 */
export const login = async (credentials: LoginCredentials): Promise<{ success: boolean; user?: User; token?: string; error?: string }> => {
  try {
    const response = await apiClient.post<ApiResponse<{ user: User; token: string }>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    if (response.data.success && response.data.data) {
      return {
        success: true,
        user: response.data.data.user,
        token: response.data.data.token,
      };
    }

    return {
      success: false,
      error: response.data.error || 'Échec de la connexion',
    };
  } catch (error) {
    const apiError = handleApiError(error);
    return {
      success: false,
      error: apiError.message,
    };
  }
};

/**
 * Register a new user
 */
export const register = async (data: RegisterData): Promise<{ success: boolean; user?: User; token?: string; error?: string }> => {
  try {
    const response = await apiClient.post<ApiResponse<{ user: User; token: string }>>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );

    if (response.data.success && response.data.data) {
      return {
        success: true,
        user: response.data.data.user,
        token: response.data.data.token,
      };
    }

    return {
      success: false,
      error: response.data.error || 'Échec de l\'inscription',
    };
  } catch (error) {
    const apiError = handleApiError(error);
    return {
      success: false,
      error: apiError.message,
    };
  }
};

/**
 * Get current user profile
 */
export const getMe = async (): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const response = await apiClient.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME);

    if (response.data.success && response.data.data) {
      return {
        success: true,
        user: response.data.data,
      };
    }

    return {
      success: false,
      error: response.data.error || 'Impossible de récupérer le profil',
    };
  } catch (error) {
    const apiError = handleApiError(error);
    return {
      success: false,
      error: apiError.message,
    };
  }
};

/**
 * Request password reset
 */
export const forgotPassword = async (email: string): Promise<{ success: boolean; message?: string; resetToken?: string; error?: string }> => {
  try {
    const response = await apiClient.post<ApiResponse<{ message: string; resetToken?: string }>>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email }
    );

    if (response.data.success) {
      return {
        success: true,
        message: response.data.data?.message || response.data.message || 'Code envoyé',
        resetToken: response.data.data?.resetToken, // Only in development
      };
    }

    return {
      success: false,
      error: response.data.error || 'Erreur lors de la demande',
    };
  } catch (error) {
    const apiError = handleApiError(error);
    return {
      success: false,
      error: apiError.message,
    };
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async (email: string, resetToken: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      { email, resetToken, newPassword }
    );

    if (response.data.success) {
      return {
        success: true,
        message: response.data.data?.message || response.data.message || 'Mot de passe réinitialisé',
      };
    }

    return {
      success: false,
      error: response.data.error || 'Erreur lors de la réinitialisation',
    };
  } catch (error) {
    const apiError = handleApiError(error);
    return {
      success: false,
      error: apiError.message,
    };
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (data: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gouvernorat?: string; // carrier-specific
}): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const response = await apiClient.put<ApiResponse<User>>(
      API_ENDPOINTS.AUTH.UPDATE_PROFILE,
      data
    );

    if (response.data.success && response.data.data) {
      return {
        success: true,
        user: response.data.data,
      };
    }

    return {
      success: false,
      error: response.data.error || 'Échec de la mise à jour',
    };
  } catch (error) {
    const apiError = handleApiError(error);
    return {
      success: false,
      error: apiError.message,
    };
  }
};
