/**
 * Type definitions for the Explore page feature
 */

export type ExploreMode = 'search' | 'map' | 'combined';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface Place {
  name: string;
  coordinates: LocationCoordinates;
  address?: string;
  placeId?: string;
}

export interface ActivityFilter {
  id: string;
  label: string;
  icon: string;
  active: boolean;
}

export interface ExploreActivity {
  id: string;
  name: string;
  type: string;
  description?: string;
  location: LocationCoordinates;
  address?: string;
  rating?: number;
  imageUrl?: string;
  distance?: number;
  category: string;
  saved?: boolean;
  confidence?: 'high' | 'medium' | 'low';
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ExploreData {
  destination: string;
  destinationInfo: string;
  activities: ExploreActivity[];
  pagination: PaginationInfo;
  appliedFilters: string[];
}

export interface MapViewport {
  latitude: number;
  longitude: number;
  zoom: number;
}

export interface SearchSuggestion {
  name: string;
  address: string;
  coordinates: LocationCoordinates;
}

// Valid activity type filters
export const VALID_ACTIVITY_TYPES = [
  'attraction',
  'monument',
  'museum',
  'park',
  'nature',
  'culture',
  'sightseeing',
  'restaurant',
  'hotel',
  'entertainment',
  'historical',
  'religious',
  'shopping',
] as const;

export type ActivityType = typeof VALID_ACTIVITY_TYPES[number];
