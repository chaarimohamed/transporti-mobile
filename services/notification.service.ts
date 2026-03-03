import apiClient, { ApiResponse, handleApiError } from './api.service';

export interface Notification {
  id: string;
  type: 'CARRIER_REQUEST' | 'SHIPMENT_INVITATION' | 'REQUEST_ACCEPTED' | 'REQUEST_REJECTED' | 'SHIPMENT_IN_TRANSIT' | 'SHIPMENT_DELIVERED';
  title: string;
  message: string;
  read: boolean;
  senderId?: string;
  carrierId?: string;
  shipmentId?: string;
  data?: any;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get user notifications
 */
export const getNotifications = async (unreadOnly: boolean = false): Promise<{ success: boolean; notifications?: Notification[]; error?: string }> => {
  try {
    const url = unreadOnly ? '/notifications?unreadOnly=true' : '/notifications';
    const response = await apiClient.get<ApiResponse<Notification[]>>(url);

    if (response.data.success && response.data.data) {
      return {
        success: true,
        notifications: response.data.data,
      };
    }

    return {
      success: false,
      error: response.data.error || 'Échec de la récupération des notifications',
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
 * Get unread notification count
 */
export const getUnreadCount = async (): Promise<{ success: boolean; count?: number; error?: string }> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: { count: number } }>(
      '/notifications/unread-count'
    );

    if (response.data.success) {
      return {
        success: true,
        count: response.data.data.count,
      };
    }

    return {
      success: false,
      count: 0,
      error: 'Échec de la récupération du compteur',
    };
  } catch (error) {
    const apiError = handleApiError(error);
    return {
      success: false,
      count: 0,
      error: apiError.message,
    };
  }
};

/**
 * Mark notification as read
 */
export const markAsRead = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await apiClient.put<ApiResponse<Notification>>(
      `/notifications/${id}/read`
    );

    if (response.data.success) {
      return { success: true };
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
 * Mark all notifications as read
 */
export const markAllAsRead = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await apiClient.put<{ success: boolean; message?: string; error?: string }>(
      '/notifications/read-all'
    );

    if (response.data.success) {
      return { success: true };
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
 * Delete notification
 */
export const deleteNotification = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await apiClient.delete<{ success: boolean; message?: string; error?: string }>(
      `/notifications/${id}`
    );

    if (response.data.success) {
      return { success: true };
    }

    return {
      success: false,
      error: response.data.error || 'Échec de la suppression',
    };
  } catch (error) {
    const apiError = handleApiError(error);
    return {
      success: false,
      error: apiError.message,
    };
  }
};
