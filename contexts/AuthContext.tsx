import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, LoginCredentials, RegisterData } from '../types/user.types';
import * as authService from '../services/authService';
import * as storage from '../utils/storage';

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider - Wraps the app and provides authentication state
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Auto-login on app start if user session exists
  useEffect(() => {
    checkUserSession();
  }, []);

  /**
   * Check if user session exists in AsyncStorage
   */
  const checkUserSession = async () => {
    try {
      setIsLoading(true);
      const savedUser = await storage.getUser();
      const savedToken = await storage.getToken();
      
      if (savedUser) {
        // Check if this is old mock data (no token or mock email patterns)
        const isMockData = !savedToken || 
                          savedUser.email === 'sender@test.com' || 
                          savedUser.email === 'carrier@test.com' ||
                          savedUser.id === '1' || 
                          savedUser.id === '2';
        
        if (isMockData) {
          console.log('🧹 Clearing old mock data...');
          await storage.clearStorage();
          console.log('ℹ️  Please login with real credentials');
        } else {
          setUser(savedUser);
          console.log('✅ User session restored:', savedUser.email);
        }
      } else {
        console.log('ℹ️  No saved session found');
      }
    } catch (error) {
      console.error('Error checking user session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login function
   */
  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await authService.login(credentials);

      if (result.success && result.user && result.token) {
        // Save user and token to state and AsyncStorage
        setUser(result.user);
        await storage.saveUser(result.user);
        await storage.saveToken(result.token);
        console.log('✅ Login successful:', result.user.email);
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Échec de la connexion' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Une erreur est survenue' };
    }
  };

  /**
   * Register function
   */
  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await authService.register(data);

      if (result.success && result.user && result.token) {
        // Auto-login after successful registration
        setUser(result.user);
        await storage.saveUser(result.user);
        await storage.saveToken(result.token);
        console.log('✅ Registration successful:', result.user.email);
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Échec de l\'inscription' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Une erreur est survenue' };
    }
  };

  /**
   * Logout function
   */
  const logout = async (): Promise<void> => {
    try {
      await storage.clearStorage(); // Clears both user and token
      setUser(null);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  /**
   * Update user function
   */
  const updateUser = async (updatedUser: User): Promise<void> => {
    try {
      setUser(updatedUser);
      await storage.saveUser(updatedUser);
      console.log('✅ User updated:', updatedUser.email);
    } catch (error) {
      console.error('Update user error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
