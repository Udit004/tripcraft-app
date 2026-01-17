'use client';

import { useState, useCallback, useEffect } from 'react';
import { ExploreMode, ExploreActivity, MapViewport, LocationCoordinates } from '@/types/explore';
import { FilterId, ACTIVITY_FILTERS } from '@/constants/exploreFilters';

interface UseExploreStateProps {
  initialMode?: ExploreMode;
}

/**
 * Comprehensive state management hook for the Explore page
 * Manages mode, search, filters, activities, map viewport, and sync
 */
export function useExploreState({ initialMode = 'combined' }: UseExploreStateProps = {}) {
  // Mode state
  const [mode, setMode] = useState<ExploreMode>(initialMode);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState<LocationCoordinates | null>(null);

  // Filter state
  const [activeFilters, setActiveFilters] = useState<Set<FilterId>>(new Set());

  // Activities state
  const [activities, setActivities] = useState<ExploreActivity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

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
   * Handle search submission
   */
  const handleSearch = useCallback(async (query: string, coordinates?: LocationCoordinates) => {
    setSearchQuery(query);
    setIsLoadingActivities(true);

    try {
      // If coordinates provided, use them directly
      if (coordinates) {
        setSearchLocation(coordinates);
        setViewport({
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          zoom: 13,
        });
      } else {
        // Otherwise, geocode the query
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
        );
        const data = await response.json();

        if (data.length > 0) {
          const coords: LocationCoordinates = {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
          };
          setSearchLocation(coords);
          setViewport({
            latitude: coords.lat,
            longitude: coords.lng,
            zoom: 13,
          });
        }
      }

      // Fetch activities
      await fetchActivities();
    } catch (error) {
      console.error('Error handling search:', error);
    } finally {
      setIsLoadingActivities(false);
    }
  }, []);

  /**
   * Fetch activities based on current location and filters
   */
  const fetchActivities = useCallback(async () => {
    if (!searchLocation) return;

    setIsLoadingActivities(true);

    try {
      // Build filter query
      const filterCategories = Array.from(activeFilters).flatMap(
        (filterId) => ACTIVITY_FILTERS.find((f) => f.id === filterId)?.categories || []
      );

      // Call API
      const params = new URLSearchParams({
        lat: searchLocation.lat.toString(),
        lng: searchLocation.lng.toString(),
        query: searchQuery,
      });

      if (filterCategories.length > 0) {
        params.append('categories', filterCategories.join(','));
      }

      const response = await fetch(`/api/explore/places?${params}`);
      const data = await response.json();

      setActivities(data.activities || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setActivities([]);
    } finally {
      setIsLoadingActivities(false);
    }
  }, [searchLocation, searchQuery, activeFilters]);

  /**
   * Refetch activities when filters change
   */
  useEffect(() => {
    if (searchLocation) {
      fetchActivities();
    }
  }, [activeFilters, fetchActivities]);

  /**
   * Handle filter changes
   */
  const handleFiltersChange = useCallback((filters: Set<FilterId>) => {
    setActiveFilters(filters);
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

      // Fetch activities for this location
      await fetchActivities();
    } catch (error) {
      console.error('Error with reverse geocoding:', error);
    }
  }, [fetchActivities]);

  /**
   * Handle activity click from map
   */
  const handleActivityClick = useCallback((activityId: string) => {
    setSelectedActivityId(activityId);
  }, []);

  /**
   * Handle activity hover from list
   */
  const handleActivityHover = useCallback((activityId: string | null) => {
    setHoveredActivityId(activityId);
  }, []);

  /**
   * Handle save to pool
   */
  const handleSaveActivity = useCallback(async (activityId: string) => {
    try {
      const activity = activities.find((a) => a.id === activityId);
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
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save activity');
      }
    } catch (error) {
      console.error('Error saving activity:', error);
      throw error;
    }
  }, [activities]);

  /**
   * Get filtered activities with saved status
   */
  const filteredActivities = activities.map((activity) => ({
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
    activities: filteredActivities,
    isLoadingActivities,
    fetchActivities,

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
  };
}
