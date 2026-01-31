import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../service/profileService';
import { IProfileUpdateRequest } from '@/types/user';
import { toast } from '@/lib/toast';

/**
 * Hook to fetch user profile
 */
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: profileService.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to update user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: IProfileUpdateRequest) =>
      profileService.updateProfile(profileData),
    onSuccess: (data) => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      // Update the cached data immediately
      queryClient.setQueryData(['profile'], data);
      
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    },
  });
};
