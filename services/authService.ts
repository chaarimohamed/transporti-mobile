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
  phone?: string;
  dateOfBirth?: string;
  gouvernorat?: string;  // carrier-specific
  vehicleType?: string;  // carrier-specific
  vehicleSize?: string;  // carrier-specific: S, M, L, XL
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

/**
 * Upload encrypted profile photo (works for both sender and carrier).
 */
export const uploadProfilePhoto = async (photoBase64: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await apiClient.post<{ success: boolean; error?: string }>(
      API_ENDPOINTS.AUTH.PROFILE_PHOTO,
      { photoBase64 }
    );
    if (response.data.success) return { success: true };
    return { success: false, error: response.data.error || 'Échec du téléchargement' };
  } catch (error) {
    const apiError = handleApiError(error);
    return { success: false, error: apiError.message };
  }
};

/**
 * Retrieve decrypted profile photo base64 for the current user.
 */
export const getProfilePhoto = async (): Promise<{ success: boolean; photoBase64?: string | null; error?: string }> => {
  try {
    const response = await apiClient.get<{ success: boolean; data?: { photoBase64: string | null }; error?: string }>(
      API_ENDPOINTS.AUTH.PROFILE_PHOTO
    );
    if (response.data.success && response.data.data !== undefined) {
      return { success: true, photoBase64: response.data.data.photoBase64 };
    }
    return { success: false, error: response.data.error || 'Erreur de récupération' };
  } catch (error) {
    const apiError = handleApiError(error);
    return { success: false, error: apiError.message };
  }
};

/**
 * Upload carrier identity documents (base64-encoded images).
 * The backend will encrypt and persist them.
 */
export const uploadDocuments = async (data: {
  cinBase64?: string;
  permisBase64?: string;
}): Promise<{ success: boolean; uploadedAt?: string; error?: string }> => {
  try {
    const response = await apiClient.post<{
      success: boolean;
      data?: { cinUploaded: boolean; permisUploaded: boolean; uploadedAt: string };
      error?: string;
    }>(API_ENDPOINTS.AUTH.DOCUMENTS, data);

    if (response.data.success && response.data.data) {
      return { success: true, uploadedAt: response.data.data.uploadedAt };
    }
    return { success: false, error: response.data.error || 'Échec du téléchargement' };
  } catch (error) {
    const apiError = handleApiError(error);
    return { success: false, error: apiError.message };
  }
};

/**
 * Retrieve decrypted carrier documents (base64).
 */
export const getDocuments = async (): Promise<{
  success: boolean;
  cinBase64?: string | null;
  permisBase64?: string | null;
  uploadedAt?: string | null;
  error?: string;
}> => {
  try {
    const response = await apiClient.get<{
      success: boolean;
      data?: { cinBase64: string | null; permisBase64: string | null; uploadedAt: string | null };
      error?: string;
    }>(API_ENDPOINTS.AUTH.DOCUMENTS);

    if (response.data.success && response.data.data) {
      return { success: true, ...response.data.data };
    }
    return { success: false, error: response.data.error || 'Erreur de récupération' };
  } catch (error) {
    const apiError = handleApiError(error);
    return { success: false, error: apiError.message };
  }
};
