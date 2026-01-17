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
