import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/user.types';

const USER_STORAGE_KEY = '@transporti_user';
const TOKEN_STORAGE_KEY = '@transporti_token';

/**
 * Save user data to AsyncStorage
 */
export const saveUser = async (user: User): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(user);
    await AsyncStorage.setItem(USER_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving user to storage:', error);
    throw error;
  }
};

/**
 * Get user data from AsyncStorage
 */
export const getUser = async (): Promise<User | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error reading user from storage:', error);
    return null;
  }
};

/**
 * Remove user data from AsyncStorage (logout)
 */
export const removeUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
  } catch (error) {
    console.error('Error removing user from storage:', error);
    throw error;
  }
};

/**
 * Save JWT token to AsyncStorage
 */
export const saveToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch (error) {
    console.error('Error saving token to storage:', error);
    throw error;
  }
};

/**
 * Get JWT token from AsyncStorage
 */
export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('Error reading token from storage:', error);
    return null;
  }
};

/**
 * Remove JWT token from AsyncStorage
 */
export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('Error removing token from storage:', error);
    throw error;
  }
};

/**
 * Clear all storage data
 */
export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};
