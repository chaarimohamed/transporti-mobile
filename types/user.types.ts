export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'sender' | 'carrier';
  dateOfBirth?: string;
  // Carrier-specific fields
  gouvernerat?: string;
  license?: string;
  matricule?: string;
  vehicleType?: string;
  verified?: boolean;
  // Timestamps
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'sender' | 'carrier';
  dateOfBirth?: string;
  gouvernerat?: string;
  license?: string;
  matricule?: string;
  vehicleType?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}
