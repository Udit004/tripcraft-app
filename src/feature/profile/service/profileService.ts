import apiClient from '@/services/apiClient';
import { IUserResponse, IProfileUpdateRequest } from '@/types/user';

export const profileService = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<IUserResponse> => {
    const response = await apiClient.get<{ success: boolean; user: IUserResponse }>('/profile');
    return response.data.user;
  },

  /**
   * Update user profile
   */
  updateProfile: async (profileData: IProfileUpdateRequest): Promise<IUserResponse> => {
    const response = await apiClient.put<{ success: boolean; user: IUserResponse }>(
      '/profile',
      profileData
    );
    return response.data.user;
  },
};
