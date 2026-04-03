import apiClient, { ApiResponse, handleApiError } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';

/**
 * Shipment interface matching backend
 */
export interface Shipment {
  id: string;
  refNumber: string;
  from: string;
  to: string;
  cargo?: string;
  price: number;
  status: 'PENDING' | 'REQUESTED' | 'CONFIRMED' | 'HANDOVER_PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  description?: string;
  senderId: string;
  carrierId?: string;
  requestedCarrierId?: string;
  createdAt: string;
  updatedAt: string;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  carrier?: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    gouvernerat?: string;
    averageRating?: number;
    totalReviews?: number;
    vehicleType?: string;
  };
  requestedCarrier?: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    gouvernerat?: string;
    averageRating?: number;
    totalReviews?: number;
    vehicleType?: string;
  };
}

export interface ShipmentStats {
  inProgress: number;
  pending: number;
  delivered: number;
  total: number;
}

export interface CarrierStats {
  assigned: number;
  inProgress: number;
  completed: number;
  total: number;
}

export interface CreateShipmentData {
  from: string;
  to: string;
  cargo?: string;
  price: number;
  description?: string;
  pickupDate?: string;
  weight?: string;
  format?: string;
  dimensions?: {
    height?: number;
    width?: number;
    length?: number;
  };
  declaredValue?: number;
  insurance?: boolean;
  specialInstructions?: string;
}

/**
 * Create a new shipment
 */
export const createShipment = async (data: CreateShipmentData): Promise<{ success: boolean; shipment?: Shipment; error?: string }> => {
  try {
    const response = await apiClient.post<ApiResponse<Shipment>>(
      API_ENDPOINTS.SHIPMENTS.CREATE,
      data
    );

    if (response.data.success && response.data.data) {
      return {
        success: true,
        shipment: response.data.data,
      };
    }

    return {
      success: false,
      error: response.data.error || 'Échec de la création de l\'expédition',
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
 * Get all my shipments (with optional status filter)
 */
export const getMyShipments = async (status?: string): Promise<{ success: boolean; shipments?: Shipment[]; error?: string }> => {
  try {
    const url = status ? `${API_ENDPOINTS.SHIPMENTS.LIST}?status=${status}` : API_ENDPOINTS.SHIPMENTS.LIST;
    
    const response = await apiClient.get<ApiResponse<Shipment[]>>(url);

    if (response.data.success && response.data.data) {
      return {
        success: true,
        shipments: response.data.data,
      };
    }

    return {
      success: false,
      error: response.data.error || 'Échec de la récupération des expéditions',
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
 * Get all available shipments (for carriers)
 */
export const getAvailableShipments = async (status?: string): Promise<{ success: boolean; shipments?: Shipment[]; error?: string }> => {
  try {
    const url = status 
      ? `${API_ENDPOINTS.SHIPMENTS.LIST}/available?status=${status}` 
      : `${API_ENDPOINTS.SHIPMENTS.LIST}/available`;
    
    const response = await apiClient.get<ApiResponse<Shipment[]>>(url);

    if (response.data.success && response.data.data) {
      return {
        success: true,
        shipments: response.data.data,
      };
    }

    return {
      success: false,
      error: response.data.error || 'Échec de la récupération des expéditions disponibles',
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
 * Get shipment by ID
 */
export const getShipmentById = async (id: string): Promise<{ success: boolean; shipment?: Shipment; error?: string }> => {
  try {
    const response = await apiClient.get<ApiResponse<Shipment>>(
      API_ENDPOINTS.SHIPMENTS.GET(id)
    );

    if (response.data.success && response.data.data) {
      return {
        success: true,
        shipment: response.data.data,
      };
    }

    return {
      success: false,
      error: response.data.error || 'Expédition introuvable',
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
 * Request a shipment (carrier expresses interest)
 */
export const requestShipment = async (id: string): Promise<{ success: boolean; shipment?: Shipment; error?: string; message?: string }> => {
  try {
    const response = await apiClient.post<ApiResponse<Shipment>>(
      `${API_ENDPOINTS.SHIPMENTS.LIST}/${id}/request`
    );

    if (response.data.success) {
      return {
        success: true,
        shipment: response.data.data,
        message: response.data.message || 'Demande envoyée avec succès',
      };
    }

    return {
      success: false,
      error: response.data.error || 'Échec de la demande',
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
 * Invite a carrier to a shipment (sender invites specific carrier)
 */
export const inviteCarrier = async (shipmentId: string, carrierId: string): Promise<{ success: boolean; error?: string; message?: string }> => {
  try {
    const response = await apiClient.post<ApiResponse<any>>(
      `${API_ENDPOINTS.SHIPMENTS.LIST}/${shipmentId}/invite-carrier`,
      { carrierId }
    );

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message || 'Invitation envoyée avec succès',
      };
    }

    return {
      success: false,
      error: response.data.error || 'Échec de l\'invitation',
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
 * Accept invitation (carrier accepts sender's invitation)
 */
export const acceptInvitation = async (id: string): Promise<{ success: boolean; shipment?: Shipment; error?: string; message?: string }> => {
  try {
    const response = await apiClient.post<ApiResponse<Shipment>>(
      `${API_ENDPOINTS.SHIPMENTS.LIST}/${id}/accept-invitation`
    );

    if (response.data.success) {
      return {
        success: true,
        shipment: response.data.data,
        message: response.data.message || 'Invitation acceptée avec succès',
      };
    }

    return {
      success: false,
      error: response.data.error || 'Échec de l\'acceptation',
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
 * Accept carrier request (sender accepts a carrier's application)
 */
export const acceptCarrier = async (id: string): Promise<{ success: boolean; shipment?: Shipment; error?: string; message?: string }> => {
  try {
    const response = await apiClient.post<ApiResponse<Shipment>>(
      `${API_ENDPOINTS.SHIPMENTS.LIST}/${id}/accept-carrier`
    );

    if (response.data.success) {
      return {
        success: true,
        shipment: response.data.data,
        message: response.data.message || 'Transporteur accepté avec succès',
      };
    }

    return {
      success: false,
      error: response.data.error || 'Échec de l\'acceptation',
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
 * Reject carrier request (sender rejects a carrier's application)
 */
export const rejectCarrier = async (id: string): Promise<{ success: boolean; shipment?: Shipment; error?: string; message?: string }> => {
  try {
    const response = await apiClient.post<ApiResponse<Shipment>>(
      `${API_ENDPOINTS.SHIPMENTS.LIST}/${id}/reject-carrier`
    );

    if (response.data.success) {
      return {
        success: true,
        shipment: response.data.data,
        message: response.data.message || 'Transporteur refusé',
      };
    }

    return {
      success: false,
      error: response.data.error || 'Échec du refus',
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
 * Update shipment
 */
export const updateShipment = async (id: string, data: Partial<CreateShipmentData>): Promise<{ success: boolean; shipment?: Shipment; error?: string }> => {
  try {
    const response = await apiClient.put<ApiResponse<Shipment>>(
      API_ENDPOINTS.SHIPMENTS.UPDATE(id),
      data
    );

    if (response.data.success && response.data.data) {
      return {
        success: true,
        shipment: response.data.data,
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
 * Update shipment status by carrier
 */
export const updateShipmentStatus = async (
  id: string,
  status: 'IN_TRANSIT' | 'DELIVERED'
): Promise<{ success: boolean; shipment?: Shipment; error?: string }> => {
  try {
    const response = await apiClient.put<ApiResponse<Shipment>>(
      `${API_ENDPOINTS.SHIPMENTS.LIST}/${id}/status`,
      { status }
    );

    if (response.data.success && response.data.data) {
      return {
        success: true,
        shipment: response.data.data,
      };
    }

    return {
      success: false,
      error: response.data.error || 'Échec de la mise à jour du statut',
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
 * Cancel shipment
 */
export const cancelShipment = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await apiClient.delete<ApiResponse>(
      API_ENDPOINTS.SHIPMENTS.DELETE(id)
    );

    if (response.data.success) {
      return {
        success: true,
      };
    }

    return {
      success: false,
      error: response.data.error || 'Échec de l\'annulation',
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
 * Get shipment statistics for dashboard
 */
export const getShipmentStats = async (): Promise<{ success: boolean; stats?: ShipmentStats; error?: string }> => {
  try {
    const response = await apiClient.get<ApiResponse<ShipmentStats>>(
      API_ENDPOINTS.SHIPMENTS.STATS
    );

    if (response.data.success && response.data.data) {
      return {
        success: true,
        stats: response.data.data,
      };
    }

    return {
      success: false,
      error: response.data.error || 'Échec de la récupération des statistiques',
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
 * Get carrier shipment stats (for carrier dashboard)
 */
export const getCarrierShipmentStats = async (): Promise<{ success: boolean; stats?: CarrierStats; error?: string }> => {
  try {
    console.log('🚀 Calling getCarrierShipmentStats API...');
    const url = `${API_ENDPOINTS.SHIPMENTS.LIST}/carrier-stats`;
    console.log('📍 URL:', url);
    
    const response = await apiClient.get<{ success: boolean; stats: CarrierStats }>(url);
    
    console.log('📥 Response:', response.data);

    if (response.data.success && response.data.stats) {
      return {
        success: true,
        stats: response.data.stats,
      };
    }

    return {
      success: false,
      error: 'Échec de la récupération des statistiques',
    };
  } catch (error) {
    console.error('❌ getCarrierShipmentStats error:', error);
    const apiError = handleApiError(error);
    return {
      success: false,
      error: apiError.message,
    };
  }
};

/**
 * Carrier interface for available carriers
 */
export interface Carrier {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gouvernerat?: string;
  verified?: boolean;
  averageRating?: number;
  totalReviews?: number;
}

/**
 * Get available carriers for a shipment (suggested transporters)
 */
export const getAvailableCarriers = async (shipmentId: string): Promise<{ success: boolean; carriers?: Carrier[]; error?: string }> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: Carrier[] }>(
      `${API_ENDPOINTS.SHIPMENTS.LIST}/${shipmentId}/available-carriers`
    );

    if (response.data.success && response.data.data) {
      return {
        success: true,
        carriers: response.data.data,
      };
    }

    return {
      success: false,
      error: response.data.error || 'Échec de la récupération des transporteurs',
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
 * Get IDs of carriers already invited to a shipment
 */
export const getInvitedCarriers = async (shipmentId: string): Promise<{ success: boolean; carrierIds?: string[]; error?: string }> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: string[] }>(
      `${API_ENDPOINTS.SHIPMENTS.LIST}/${shipmentId}/invited-carriers`
    );

    if (response.data.success) {
      return {
        success: true,
        carrierIds: response.data.data || [],
      };
    }

    return {
      success: false,
      error: response.data.error || 'Échec de la récupération',
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
 * Sender confirms they handed the parcel to the carrier.
 * Transitions the shipment from HANDOVER_PENDING → IN_TRANSIT.
 * POST /api/shipments/:id/confirm-handover
 */
export const confirmHandover = async (shipmentId: string): Promise<{ success: boolean; shipment?: Shipment; error?: string }> => {
  try {
    const response = await apiClient.post<{ success: boolean; data?: Shipment; error?: string }>(
      `${API_ENDPOINTS.SHIPMENTS.LIST}/${shipmentId}/confirm-handover`
    );

    if (response.data.success && response.data.data) {
      return { success: true, shipment: response.data.data };
    }

    return {
      success: false,
      error: response.data.error || 'Impossible de confirmer la remise',
    };
  } catch (error) {
    const apiError = handleApiError(error);
    return { success: false, error: apiError.message };
  }
};
