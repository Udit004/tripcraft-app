'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { exploreService } from '@/services/exploreService';

interface UseExploreQueryParams {
  destination: string;
  page: number;
  filters: string[];
}

/**
 * React Query hook for explore data with automatic caching
 * Data is cached by destination+filters combination
 */
export function useExploreQuery({ destination, page, filters }: UseExploreQueryParams) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['explore', destination, filters.sort().join(','), page],
    queryFn: async () => {
      if (!destination || destination.trim().length === 0) {
        return null;
      }
      return exploreService.search({
        destination,
        page,
        filters,
      });
    },
    enabled: !!destination && destination.trim().length > 0,
    // Keep data fresh for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Keep in cache for 30 minutes even if unused
    gcTime: 30 * 60 * 1000,
  });

  /**
   * Prefetch next page for smoother pagination
   */
  const prefetchNextPage = () => {
    if (query.data?.pagination.hasNextPage) {
      queryClient.prefetchQuery({
        queryKey: ['explore', destination, filters.sort().join(','), page + 1],
        queryFn: () =>
          exploreService.search({
            destination,
            page: page + 1,
            filters,
          }),
      });
    }
  };

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    prefetchNextPage,
  };
}
