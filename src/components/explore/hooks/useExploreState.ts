'use client';

import { useState, useCallback, useEffect } from 'react';
import { ExploreMode, MapViewport, LocationCoordinates } from '@/types/explore';
import { FilterId, ACTIVITY_FILTERS } from '@/constants/exploreFilters';
import { useExploreQuery } from './useExploreQuery';
import { useActivityPoolContext } from '@/context/ActivityPoolContext';
import { useQueryState, parseAsString, parseAsInteger, parseAsArrayOf } from 'nuqs';

interface UseExploreStateProps {
  initialMode?: ExploreMode;
}

/**
 * Comprehensive state management hook for the Explore page
 * Uses React Query for data caching and URL state for persistence
 */
export function useExploreState({ initialMode = 'combined' }: UseExploreStateProps = {}) {
  // URL state for persistence and shareability
  const [searchQuery, setSearchQuery] = useQueryState('q', parseAsString.withDefault(''));
  const [currentPage, setCurrentPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [urlFilters, setUrlFilters] = useQueryState(
    'filters',
    parseAsArrayOf(parseAsString).withDefault(['attraction', 'monument'])
  );

  // Get activity pool context
  const { incrementPoolCount } = useActivityPoolContext();

  // Mode state (not in URL to avoid clutter)
  const [mode, setMode] = useState<ExploreMode>(initialMode);

  // Local filter state (synced with URL)
  const [activeFilters, setActiveFilters] = useState<Set<FilterId>>(() => {
    // Initialize from URL filters
    const initialFilters = new Set<FilterId>();
    urlFilters.forEach(filter => {
      // Map URL filter types back to FilterId
      if (filter === 'restaurant') initialFilters.add('food');
      else if (filter === 'hotel') initialFilters.add('accommodation');
      else if (filter === 'attraction' || filter === 'monument') initialFilters.add('attractions');
      else if (filter === 'religious') initialFilters.add('religious');
      else if (filter === 'shopping') initialFilters.add('shopping');
      else if (filter === 'park' || filter === 'nature') initialFilters.add('nature');
      else if (filter === 'transport') initialFilters.add('transport');
    });
    return initialFilters.size > 0 ? initialFilters : new Set(['attractions']);
  });

  // Search location state
  const [searchLocation, setSearchLocation] = useState<LocationCoordinates | null>(null);

  // Use React Query for data fetching with automatic caching
  const {
    data: exploreData,
    isLoading: isLoadingActivities,
    error: queryError,
    prefetchNextPage,
  } = useExploreQuery({
    destination: searchQuery,
    page: currentPage,
    filters: urlFilters,
  });

  const error = queryError ? (queryError as Error).message : null;

  // Map state
  const [viewport, setViewport] = useState<MapViewport>({
    latitude: 51.5074, // Default: London
    longitude: -0.1278,
    zoom: 12,
  });

  // Sync state
  const [hoveredActivityId, setHoveredActivityId] = useState<string | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  // Saved activities (persisted to activity pool)
  const [savedActivityIds, setSavedActivityIds] = useState<Set<string>>(new Set());

  /**
   * Convert frontend filter IDs to backend filter types
   */
  const convertFiltersToTypes = useCallback((filters: Set<FilterId>): string[] => {
    if (filters.size === 0) {
      return ['attraction', 'monument']; // Default filters
    }

    const filterTypes: string[] = [];
    filters.forEach(filterId => {
      const filter = ACTIVITY_FILTERS.find(f => f.id === filterId);
      if (filter) {
        // Map filter IDs to backend types
        switch (filterId) {
          case 'food':
            filterTypes.push('restaurant');
            break;
          case 'accommodation':
            filterTypes.push('hotel');
            break;
          case 'attractions':
            filterTypes.push('attraction', 'monument');
            break;
          case 'religious':
            filterTypes.push('religious');
            break;
          case 'shopping':
            filterTypes.push('shopping');
            break;
          case 'nature':
            filterTypes.push('park', 'nature');
            break;
          case 'transport':
            filterTypes.push('transport');
            break;
          default:
            filterTypes.push('attraction');
        }
      }
    });

    return [...new Set(filterTypes)]; // Remove duplicates
  }, []);

  // Debounced filter state for UI responsiveness
  const [pendingFilters, setPendingFilters] = useState<Set<FilterId> | null>(null);

  // Apply debounced filter updates
  useEffect(() => {
    if (pendingFilters === null) return;

    const timeoutId = setTimeout(() => {
      const filterTypes = convertFiltersToTypes(pendingFilters);
      setUrlFilters(filterTypes);
      setCurrentPage(1);
      setPendingFilters(null);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [pendingFilters, convertFiltersToTypes, setUrlFilters, setCurrentPage]);

  // Update viewport when data loads (only if no search location was provided)
  useEffect(() => {
    if (exploreData && exploreData.activities.length > 0 && !searchLocation) {
      const firstActivity = exploreData.activities[0];
      if (firstActivity.location) {
        setViewport({
          latitude: firstActivity.location.lat,
          longitude: firstActivity.location.lng,
          zoom: 13,
        });
      }
    } else if (searchLocation) {
      // Use the search location coordinates when available
      setViewport({
        latitude: searchLocation.lat,
        longitude: searchLocation.lng,
        zoom: 13,
      });
    }
  }, [exploreData, searchLocation]);

  /**
   * Handle search submission - now updates URL state
   */
  const handleSearch = useCallback(async (query: string, coordinates?: LocationCoordinates) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search

    // If coordinates provided, use them directly
    if (coordinates) {
      setSearchLocation(coordinates);
      setViewport({
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        zoom: 13,
      });
    } else {
      // Clear search location so the map can use the first activity's coordinates
      setSearchLocation(null);
    }

    // The query will automatically trigger a refetch via React Query
  }, [setSearchQuery, setCurrentPage]);

  /**
   * Handle filter changes - debounced for better UX
   */
  const handleFiltersChange = useCallback((filters: Set<FilterId>) => {
    setActiveFilters(filters);
    setPendingFilters(filters); // Trigger debounced update
  }, []);

  /**
   * Handle map click (reverse geocoding)
   */
  const handleMapClick = useCallback(async (coordinates: LocationCoordinates) => {
    try {
      // Reverse geocode
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.lat}&lon=${coordinates.lng}`
      );
      const data = await response.json();

      const placeName = data.display_name?.split(',')[0] || 'This location';
      setSearchQuery(placeName);
      setSearchLocation(coordinates);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error with reverse geocoding:', error);
    }
  }, [setSearchQuery, setCurrentPage]);

  /**
   * Handle activity click from map - toggle selection
   */
  const handleActivityClick = useCallback((activityId: string) => {
    setSelectedActivityId(prev => prev === activityId ? null : activityId);
  }, []);

  /**
   * Handle activity hover from list
   */
  const handleActivityHover = useCallback((activityId: string | null) => {
    setHoveredActivityId(activityId);
  }, []);

  /**
   * Load more activities - React Query automatically caches
   */
  const handleLoadMore = useCallback(() => {
    if (exploreData?.pagination.hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  }, [exploreData, currentPage, setCurrentPage]);

  /**
   * Handle page change - updates URL state
   */
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Prefetch next page for smoother navigation
    prefetchNextPage();
  }, [setCurrentPage, prefetchNextPage]);

  /**
   * Handle save to pool
   */
  const handleSaveActivity = useCallback(async (activityId: string) => {
    try {
      // Find activity from exploreData
      const activity = exploreData?.activities.find((a) => a.id === activityId);
      if (!activity) return;

      // Call API to save to pool using new format
      const response = await fetch('/api/user/activity-pool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: activity.name,
          type: activity.type,
          description: activity.description || '',
          location: activity.address || '',
          category: activity.category,
        }),
      });

      if (response.ok) {
        setSavedActivityIds((prev) => new Set(prev).add(activityId));
        // Update global pool count
        incrementPoolCount();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save activity');
      }
    } catch (error) {
      console.error('Error saving activity:', error);
      throw error;
    }
  }, [exploreData, incrementPoolCount]);

  /**
   * Get filtered activities with saved status
   * Ensures all activities have valid location coordinates
   */
  const activities = (exploreData?.activities || [])
    .filter(activity => {
      // Only include activities with valid coordinates
      return activity && activity.location && 
             typeof activity.location.lat === 'number' && 
             typeof activity.location.lng === 'number' &&
             !isNaN(activity.location.lat) &&
             !isNaN(activity.location.lng);
    })
    .map((activity) => ({
      ...activity,
      saved: savedActivityIds.has(activity.id),
    }));

  return {
    // Mode
    mode,
    setMode,

    // Search
    searchQuery,
    searchLocation,
    handleSearch,

    // Filters
    activeFilters,
    handleFiltersChange,

    // Activities
    activities,
    isLoadingActivities,
    
    // Pagination
    pagination: exploreData?.pagination,
    handleLoadMore,
    handlePageChange,
    currentPage,

    // Map
    viewport,
    setViewport,
    handleMapClick,

    // Sync
    hoveredActivityId,
    selectedActivityId,
    handleActivityClick,
    handleActivityHover,

    // Save
    handleSaveActivity,

    // Error
    error,
  };
}
