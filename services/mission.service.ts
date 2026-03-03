import apiClient, { handleApiError } from './api.service';

export interface Mission {
  id: string;
  refNumber: string;
  from: string;
  to: string;
  cargo: string;
  price: number;
  date: string;
  status: 'PENDING' | 'REQUESTED' | 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  description?: string;
  carrierId?: string;
  carrier?: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MissionStats {
  assigned: number;
  inProgress: number;
  completed: number;
}

export interface AcceptMissionData {
  counterOffer?: number;
}

// Get available missions
export const getAvailableMissions = async (
  status?: string
): Promise<{ success: boolean; missions?: Mission[]; error?: string }> => {
  try {
    const params = status ? { status } : {};
    const response = await apiClient.get('/missions/available', { params });
    return { success: true, missions: response.data.missions };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
};

// Get my missions
export const getMyMissions = async (
  status?: string
): Promise<{ success: boolean; missions?: Mission[]; error?: string }> => {
  try {
    const params = status ? { status } : {};
    const response = await apiClient.get('/missions/my-missions', { params });
    return { success: true, missions: response.data.missions };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
};

// Get mission by ID
export const getMissionById = async (
  id: string
): Promise<{ success: boolean; mission?: Mission; error?: string }> => {
  try {
    const response = await apiClient.get(`/missions/${id}`);
    return { success: true, mission: response.data.mission };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
};

// Accept a mission
export const acceptMission = async (
  id: string,
  data?: AcceptMissionData
): Promise<{ success: boolean; mission?: Mission; error?: string }> => {
  try {
    const response = await apiClient.post(`/missions/${id}/accept`, data || {});
    return { success: true, mission: response.data.mission };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
};

// Update mission status
export const updateMissionStatus = async (
  id: string,
  status: string
): Promise<{ success: boolean; mission?: Mission; error?: string }> => {
  try {
    const response = await apiClient.put(`/missions/${id}/status`, { status });
    return { success: true, mission: response.data.mission };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
};

// Cancel mission
export const cancelMission = async (
  id: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await apiClient.delete(`/missions/${id}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
};

// Confirm delivery with payment code
export const confirmDelivery = async (
  id: string,
  code: string
): Promise<{ success: boolean; mission?: Mission; receiptNumber?: string; error?: string; attemptsLeft?: number }> => {
  try {
    const response = await apiClient.post(`/missions/${id}/confirm-delivery`, { code });
    return { 
      success: true, 
      mission: response.data.mission,
      receiptNumber: response.data.receiptNumber,
    };
  } catch (error: any) {
    return { 
      success: false, 
      error: handleApiError(error),
      attemptsLeft: error.response?.data?.attemptsLeft,
    };
  }
};

// Get mission stats
export const getMissionStats = async (): Promise<{
  success: boolean;
  stats?: MissionStats;
  error?: string;
}> => {
  try {
    const response = await apiClient.get('/missions/stats');
    return { success: true, stats: response.data.stats };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
};
