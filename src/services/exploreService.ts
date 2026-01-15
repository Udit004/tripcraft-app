import apiClient  from './apiClient';
import { ExploreActivity } from '@/types/activity';

// Re-export for backward compatibility
export type { ExploreActivity };

export interface ExploreData {
  destination: string;
  destinationInfo: string;
  activities: ExploreActivity[];
}

/**
 * Fetch tourist attractions for a destination
 * @param destination - City or location name
 * @returns Explore data with activities
 */
export async function fetchExploreData(destination: string): Promise<ExploreData> {
  if (!destination || destination.trim().length === 0) {
    throw new Error('Destination is required');
  }

  const params = new URLSearchParams({ destination: destination.trim() });
  const response = await apiClient.get<ExploreData>(`/explore?${params.toString()}`);
  
  return response.data;
}

/**
 * Client-side explore service (for use in client components)
 */
export const exploreService = {
  /**
   * Search for attractions in a destination
   */
  async search(destination: string): Promise<ExploreData> {
    if (!destination || destination.trim().length === 0) {
      return {
        destination: '',
        destinationInfo: '',
        activities: [],
      };
    }

    try {
      const params = new URLSearchParams({ destination: destination.trim() });
      const response = await apiClient.get<ExploreData>(`/explore?${params.toString()}`);

      if (!response.data) {
        throw new Error(`Failed to fetch explore data: ${response.statusText}`);
      }

      const data: ExploreData = await response.data;
      return data;
    } catch (error) {
      console.error('Error in exploreService.search:', error);
      throw error;
    }
  },
};
