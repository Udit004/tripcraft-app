import apiClient  from './apiClient';
import { ExploreActivity, PaginationInfo, ExploreData } from '@/types/explore';

// Re-export for backward compatibility
export type { ExploreActivity, PaginationInfo, ExploreData };

export interface ExploreParams {
  destination: string;
  page?: number;
  limit?: number;
  filters?: string[];
}

/**
 * Fetch tourist attractions for a destination with pagination and filters
 * @param params - Search parameters including destination, page, limit, and filters
 * @returns Explore data with activities and pagination info
 */
export async function fetchExploreData(params: ExploreParams): Promise<ExploreData> {
  const { destination, page = 1, limit = 12, filters = ['attraction', 'monument'] } = params;

  if (!destination || destination.trim().length === 0) {
    throw new Error('Destination is required');
  }

  const searchParams = new URLSearchParams({
    destination: destination.trim(),
    page: page.toString(),
    limit: limit.toString(),
    filters: filters.join(','),
  });

  const response = await apiClient.get<ExploreData>(`/explore?${searchParams.toString()}`);
  
  return response.data;
}

/**
 * Client-side explore service (for use in client components)
 */
export const exploreService = {
  /**
   * Search for attractions in a destination with pagination and filters
   */
  async search(params: ExploreParams): Promise<ExploreData> {
    const { destination, page = 1, limit = 12, filters = ['attraction', 'monument'] } = params;

    if (!destination || destination.trim().length === 0) {
      return {
        destination: '',
        destinationInfo: '',
        activities: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: limit,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        appliedFilters: [],
      };
    }

    try {
      const searchParams = new URLSearchParams({
        destination: destination.trim(),
        page: page.toString(),
        limit: limit.toString(),
        filters: filters.join(','),
      });

      const response = await apiClient.get<ExploreData>(`/explore?${searchParams.toString()}`);

      if (!response.data) {
        throw new Error(`Failed to fetch explore data: ${response.statusText}`);
      }

      return response.data;
    } catch (error) {
      console.error('Error in exploreService.search:', error);
      throw error;
    }
  },
};
