import apiClient from './apiClient';
import { ILoginRequest, ISignupRequest, IAuthResponse, IUserResponse } from '@/types/user';

/**
 * Auth Service - Handles all authentication related API calls
 * Now uses HttpOnly cookies for secure token storage
 */
export const authService = {
  /**
   * Login user with email and password
   */
  login: async (credentials: ILoginRequest): Promise<IAuthResponse> => {
    try {
      const response = await apiClient.post<IAuthResponse>('/auth/login', credentials);
      
      // Store user data (including token) in localStorage
      if (response.data.success && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('An error occurred during login');
    }
  },

  /**
   * Register new user
   */
  signup: async (userData: ISignupRequest): Promise<IAuthResponse> => {
    try {
      const response = await apiClient.post<IAuthResponse>('/auth/signup', userData);
      
      // Store user data in localStorage (not sensitive)
      if (response.data.success && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('An error occurred during signup');
    }
  },

  /**
   * Get current authenticated user
   */
  getMe: async (): Promise<{ success: boolean; user?: IUserResponse; message?: string }> => {
    try {
      const response = await apiClient.get('/auth/me');
      
      // Update stored user data
      if (response.data.success && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('An error occurred while fetching user data');
    }
  },

  /**
   * Logout user - clears cookie and local storage
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear user data from localStorage
      localStorage.removeItem('user');
      // Redirect to login
      window.location.href = '/login';
    }
  },

  /**
   * Get stored user from localStorage
   */
  getStoredUser: (): IUserResponse | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  /**
   * Check if user is authenticated (has user data)
   * Note: Token is in HttpOnly cookie, so we check for user data
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('user');
  },
};

export default authService;
