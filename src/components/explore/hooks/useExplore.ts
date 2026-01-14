import { useState, useCallback } from 'react';
import { exploreService, ExploreData } from '@/services/exploreService';

export interface UseExploreState {
  data: ExploreData | null;
  isLoading: boolean;
  error: string | null;
}

export interface UseExploreReturn extends UseExploreState {
  search: (destination: string) => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook for managing explore functionality
 * Handles API calls, loading states, and error handling
 */
export function useExplore(): UseExploreReturn {
  const [state, setState] = useState<UseExploreState>({
    data: null,
    isLoading: false,
    error: null,
  });

  /**
   * Search for attractions in a destination
   */
  const search = useCallback(async (destination: string) => {
    if (!destination || destination.trim().length === 0) {
      setState({
        data: null,
        isLoading: false,
        error: 'Please enter a destination',
      });
      return;
    }

    setState({
      data: null,
      isLoading: true,
      error: null,
    });

    try {
      const result = await exploreService.search(destination);
      
      setState({
        data: result,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error searching destination:', error);
      setState({
        data: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch attractions',
      });
    }
  }, []);

  /**
   * Reset the explore state
   */
  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    search,
    reset,
  };
}
