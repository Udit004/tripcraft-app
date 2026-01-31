import { useState, useCallback } from 'react';
import { exploreService, ExploreData } from '@/services/exploreService';

export interface UseExploreState {
  data: ExploreData | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  activeFilters: string[];
}

export interface UseExploreReturn extends UseExploreState {
  search: (destination: string, filters?: string[]) => Promise<void>;
  loadMore: () => Promise<void>;
  changePage: (page: number) => Promise<void>;
  updateFilters: (filters: string[]) => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook for managing explore functionality with pagination and filters
 * Handles API calls, loading states, and error handling
 */
export function useExplore(): UseExploreReturn {
  const [state, setState] = useState<UseExploreState>({
    data: null,
    isLoading: false,
    error: null,
    currentPage: 1,
    activeFilters: ['attraction', 'monument'], // Default filters
  });

  /**
   * Search for attractions in a destination with optional filters
   */
  const search = useCallback(async (destination: string, filters?: string[]) => {
    if (!destination || destination.trim().length === 0) {
      setState(prev => ({
        ...prev,
        data: null,
        error: 'Please enter a destination',
      }));
      return;
    }

    const searchFilters = filters || state.activeFilters;

    setState(prev => ({
      ...prev,
      data: null,
      isLoading: true,
      error: null,
      currentPage: 1,
      activeFilters: searchFilters,
    }));

    try {
      const result = await exploreService.search({
        destination,
        page: 1,
        filters: searchFilters,
      });
      
      setState(prev => ({
        ...prev,
        data: result,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      console.error('Error searching destination:', error);
      setState(prev => ({
        ...prev,
        data: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch attractions',
      }));
    }
  }, [state.activeFilters]);

  /**
   * Load more results (append to existing data)
   */
  const loadMore = useCallback(async () => {
    if (!state.data || !state.data.pagination.hasNextPage || state.isLoading) {
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const nextPage = state.currentPage + 1;
      const result = await exploreService.search({
        destination: state.data.destination,
        page: nextPage,
        filters: state.activeFilters,
      });
      
      setState(prev => ({
        ...prev,
        data: prev.data ? {
          ...result,
          activities: [...prev.data.activities, ...result.activities],
        } : result,
        isLoading: false,
        currentPage: nextPage,
        error: null,
      }));
    } catch (error) {
      console.error('Error loading more results:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load more results',
      }));
    }
  }, [state.data, state.currentPage, state.activeFilters, state.isLoading]);

  /**
   * Change to a specific page (replaces current data)
   */
  const changePage = useCallback(async (page: number) => {
    if (!state.data || state.isLoading || page === state.currentPage) {
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const result = await exploreService.search({
        destination: state.data.destination,
        page,
        filters: state.activeFilters,
      });
      
      setState(prev => ({
        ...prev,
        data: result,
        isLoading: false,
        currentPage: page,
        error: null,
      }));
    } catch (error) {
      console.error('Error changing page:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to change page',
      }));
    }
  }, [state.data, state.currentPage, state.activeFilters, state.isLoading]);

  /**
   * Update filters and re-search
   */
  const updateFilters = useCallback(async (filters: string[]) => {
    if (!state.data || state.isLoading) {
      setState(prev => ({ ...prev, activeFilters: filters }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isLoading: true,
      activeFilters: filters,
      currentPage: 1,
    }));

    try {
      const result = await exploreService.search({
        destination: state.data.destination,
        page: 1,
        filters,
      });
      
      setState(prev => ({
        ...prev,
        data: result,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      console.error('Error updating filters:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update filters',
      }));
    }
  }, [state.data, state.isLoading]);

  /**
   * Reset the explore state
   */
  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
      currentPage: 1,
      activeFilters: ['attraction', 'monument'],
    });
  }, []);

  return {
    ...state,
    search,
    loadMore,
    changePage,
    updateFilters,
    reset,
  };
}
