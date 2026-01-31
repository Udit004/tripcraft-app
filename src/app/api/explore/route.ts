import { NextRequest, NextResponse } from 'next/server';
import { VALID_ACTIVITY_TYPES } from '@/types/explore';

// Configuration constants
const REQUEST_TIMEOUT = 25000; // 25 seconds - Overpass API can be slow
const OSM_TIMEOUT = 30000; // 30 seconds for OSM Overpass queries specifically
const ITEMS_PER_PAGE = 12; // Number of items per page
const DEFAULT_FILTERS = ['attraction', 'monument']; // Default filters for first load
const MAX_RESULTS = 50; // Reduced from 100 for faster queries

// Multiple Overpass API instances for fallback (in case one is down/busy)
const OVERPASS_API_URLS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.ru/api/interpreter',
];

// Category mapping from OSM tags to planner categories
const CATEGORY_MAP: Record<string, string> = {
  // Nature & Outdoors
  'beach': 'nature',
  'park': 'nature',
  'garden': 'nature',
  'viewpoint': 'nature',
  'waterfall': 'nature',
  'nature_reserve': 'nature',
  
  // Culture & History
  'museum': 'culture',
  'memorial': 'culture',
  'artwork': 'culture',
  'gallery': 'culture',
  'theatre': 'culture',
  
  // Sightseeing & Places of Worship
  'monument': 'sightseeing',
  'attraction': 'sightseeing',
  'castle': 'sightseeing',
  'tower': 'sightseeing',
  'church': 'sightseeing',
  'temple': 'sightseeing',
  'mosque': 'sightseeing',
  'cathedral': 'sightseeing',
  
  // Default
  'yes': 'general',
};

interface OSMPlace {
  type: string;
  id: number;
  lat: number;
  lon: number;
  tags?: {
    name?: string;
    tourism?: string;
    historic?: string;
    leisure?: string;
    amenity?: string;
    natural?: string;
    'addr:city'?: string;
  };
}

interface GeoNameResult {
  lat: number;
  lon: number;
  name?: string;
  country?: string;
}

interface NormalizedActivity {
  id: string;
  name: string;
  type: string;
  description: string;
  location: { lat: number; lng: number };
  address?: string;
  category: string;
  confidence: 'high' | 'medium' | 'low';
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ExploreResponse {
  destination: string;
  destinationInfo: string;
  activities: NormalizedActivity[];
  pagination: PaginationInfo;
  appliedFilters: string[];
}

/**
 * Fetches data with timeout protection
 */
async function fetchWithTimeout(url: string, timeout: number = REQUEST_TIMEOUT, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const headers: HeadersInit = {
      'Accept': 'application/json',
      'User-Agent': 'TripCraft/1.0',
      ...options.headers,
    };

    const response = await fetch(url, { 
      ...options,
      signal: controller.signal,
      headers,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Convert destination name to coordinates using Nominatim (OpenStreetMap)
 * Free alternative to OpenTripMap's non-existent geoname endpoint
 */
async function getDestinationCoordinates(destination: string): Promise<GeoNameResult | null> {
  try {
    // Use Nominatim (OpenStreetMap's free geocoding service)
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json&limit=1`;
    
    // Use standard timeout for geocoding
    const response = await fetchWithTimeout(url, REQUEST_TIMEOUT);

    console.log(`[DEBUG] Geocoding "${destination}":`, {
      url,
      status: response.status,
    });

    if (!response.ok) {
      console.error('Nominatim geocoding API error:', response.status);
      return null;
    }

    const data: any[] = await response.json();
    
    console.log(`[DEBUG] Geocoding response:`, data);

    if (!Array.isArray(data) || data.length === 0) {
      console.error(`[DEBUG] Destination not found`);
      return null;
    }

    const result = data[0];
    
    return {
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      name: result.display_name,
      country: result.address?.country,
    };
  } catch (error) {
    console.error('Error fetching destination coordinates:', error);
    return null;
  }
}

/**
 * Fetch nearby attractions using OpenStreetMap Overpass API (100% FREE, no API key!)
 * Uses multiple API instances for reliability
 * Enhanced with category filtering
 */
async function fetchNearbyAttractions(
  lat: number,
  lon: number,
  filters: string[] = DEFAULT_FILTERS
): Promise<OSMPlace[]> {
  const radius = 5000; // 5km radius
  
  // Build query based on filters - map our filter names to OSM tags
  const osmTagQueries = buildOSMQueryFromFilters(filters, lat, lon, radius);
  
  // Optimized Overpass QL query with increased timeout
  const query = `
    [out:json][timeout:25];
    (
      ${osmTagQueries}
    );
    out body ${MAX_RESULTS};
  `;
  
  console.log(`[DEBUG] Fetching attractions from OpenStreetMap:`, {
    lat,
    lon,
    radius,
    filters,
    queryLength: query.length,
  });

  // Try each API instance until one succeeds
  for (let i = 0; i < OVERPASS_API_URLS.length; i++) {
    const apiUrl = OVERPASS_API_URLS[i];
    
    try {
      console.log(`[DEBUG] Trying Overpass API instance ${i + 1}/${OVERPASS_API_URLS.length}: ${apiUrl}`);
      
      // Use longer timeout for OSM queries
      const response = await fetchWithTimeout(apiUrl, OSM_TIMEOUT, {
        method: 'POST',
        body: query,
      });

      console.log(`[DEBUG] OSM Overpass API response:`, {
        instance: apiUrl,
        status: response.status,
        statusText: response.statusText,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[DEBUG] Overpass API error (instance ${i + 1}):`, response.status, errorText.substring(0, 200));
        
        // If this isn't the last instance, try the next one
        if (i < OVERPASS_API_URLS.length - 1) {
          console.log(`[DEBUG] Trying next Overpass API instance...`);
          continue;
        }
        return [];
      }

      const responseData = await response.json();
      
      console.log(`[DEBUG] OSM response:`, {
        instance: apiUrl,
        elementsCount: responseData.elements?.length || 0,
        hasElements: !!responseData.elements,
      });

      if (responseData.elements && Array.isArray(responseData.elements)) {
        console.log('[DEBUG] Successfully fetched from OSM. Sample places:', responseData.elements.slice(0, 2));
        return responseData.elements;
      }

      console.warn('[DEBUG] No elements in OSM response');
      return [];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorName = error instanceof Error ? error.name : 'Error';
      
      console.error(`[DEBUG] Error with Overpass instance ${i + 1} (${errorName}):`, errorMessage);
      
      // If this isn't the last instance, try the next one
      if (i < OVERPASS_API_URLS.length - 1) {
        console.log(`[DEBUG] Trying next Overpass API instance...`);
        continue;
      }
      
      console.error('[DEBUG] All Overpass API instances failed');
      return [];
    }
  }

  console.warn('[DEBUG] Exhausted all Overpass API instances without success');
  return [];
}

/**
 * Build OSM Overpass query from our filter types
 * Optimized to reduce query complexity and improve performance
 */
function buildOSMQueryFromFilters(filters: string[], lat: number, lon: number, radius: number): string {
  const queries: string[] = [];
  
  // If no filters specified, use default
  const activeFilters = filters.length > 0 ? filters : DEFAULT_FILTERS;
  
  // Track which query types we've already added to avoid duplicates
  const addedQueries = new Set<string>();
  
  activeFilters.forEach(filter => {
    switch (filter.toLowerCase()) {
      case 'attraction':
      case 'sightseeing':
        if (!addedQueries.has('attraction')) {
          queries.push(`node["tourism"="attraction"](around:${radius},${lat},${lon});`);
          addedQueries.add('attraction');
        }
        break;
      case 'monument':
      case 'historical':
        if (!addedQueries.has('historic')) {
          queries.push(`node["historic"](around:${radius},${lat},${lon});`);
          addedQueries.add('historic');
        }
        break;
      case 'museum':
        if (!addedQueries.has('museum')) {
          queries.push(`node["tourism"="museum"](around:${radius},${lat},${lon});`);
          addedQueries.add('museum');
        }
        break;
      case 'park':
      case 'nature':
        if (!addedQueries.has('park')) {
          queries.push(`node["leisure"="park"](around:${radius},${lat},${lon});`);
          addedQueries.add('park');
        }
        if (!addedQueries.has('natural')) {
          queries.push(`node["natural"](around:${radius},${lat},${lon});`);
          addedQueries.add('natural');
        }
        break;
      case 'culture':
        if (!addedQueries.has('gallery')) {
          queries.push(`node["tourism"="gallery"](around:${radius},${lat},${lon});`);
          addedQueries.add('gallery');
        }
        if (!addedQueries.has('theatre')) {
          queries.push(`node["amenity"="theatre"](around:${radius},${lat},${lon});`);
          addedQueries.add('theatre');
        }
        break;
      case 'religious':
        if (!addedQueries.has('worship')) {
          queries.push(`node["amenity"="place_of_worship"](around:${radius},${lat},${lon});`);
          addedQueries.add('worship');
        }
        break;
      case 'restaurant':
        if (!addedQueries.has('restaurant')) {
          queries.push(`node["amenity"="restaurant"](around:${radius},${lat},${lon});`);
          addedQueries.add('restaurant');
        }
        break;
      case 'hotel':
        if (!addedQueries.has('hotel')) {
          queries.push(`node["tourism"="hotel"](around:${radius},${lat},${lon});`);
          addedQueries.add('hotel');
        }
        break;
      case 'shopping':
        if (!addedQueries.has('shop')) {
          queries.push(`node["shop"](around:${radius},${lat},${lon});`);
          addedQueries.add('shop');
        }
        break;
      case 'entertainment':
        if (!addedQueries.has('theme_park')) {
          queries.push(`node["tourism"="theme_park"](around:${radius},${lat},${lon});`);
          addedQueries.add('theme_park');
        }
        break;
    }
  });
  
  // If no valid filters matched, use default tourism query
  if (queries.length === 0) {
    queries.push(`node["tourism"](around:${radius},${lat},${lon});`);
    queries.push(`node["historic"](around:${radius},${lat},${lon});`);
  }
  
  // Limit to max 5 queries to avoid timeout - prioritize first ones
  const limitedQueries = queries.slice(0, 5);
  
  console.log(`[DEBUG] Built ${limitedQueries.length} OSM queries (from ${activeFilters.length} filters)`);
  
  return limitedQueries.join('\n');
}

/**
 * Map OSM tags to planner categories
 */
function mapToCategory(place: OSMPlace): string {
  const tags = place.tags;
  if (!tags) return 'general';

  // Check tourism tag first
  if (tags.tourism && CATEGORY_MAP[tags.tourism]) {
    return CATEGORY_MAP[tags.tourism];
  }

  // Check historic tag
  if (tags.historic && CATEGORY_MAP[tags.historic]) {
    return CATEGORY_MAP[tags.historic];
  }

  // Check leisure tag
  if (tags.leisure && CATEGORY_MAP[tags.leisure]) {
    return CATEGORY_MAP[tags.leisure];
  }

  // Check natural tag
  if (tags.natural && CATEGORY_MAP[tags.natural]) {
    return CATEGORY_MAP[tags.natural];
  }

  return 'general';
}

/**
 * Determine confidence level based on available data
 */
function getConfidenceLevel(place: OSMPlace): 'high' | 'medium' | 'low' {
  const hasName = Boolean(place.tags?.name && place.tags.name.trim().length > 0);
  const hasTags = Boolean(place.tags?.tourism || place.tags?.historic || place.tags?.leisure);
  const hasCoords = Boolean(place.lat && place.lon);

  if (hasName && hasTags && hasCoords) {
    return 'high';
  } else if (hasName && hasTags) {
    return 'medium';
  }
  return 'low';
}

/**
 * Normalize OSM response to planner-friendly structure
 * Enhanced with data quality filtering
 */
function normalizeActivities(
  places: OSMPlace[],
  destination: string
): NormalizedActivity[] {
  const normalized: NormalizedActivity[] = [];

  for (const place of places) {
    const placeName = place.tags?.name?.trim() || '';
    
    // Filter out noise data:
    // 1. No name at all
    // 2. Name is "unknown", "unnamed", or similar
    // 3. Name is too short (likely invalid)
    if (!placeName || 
        placeName.length < 2 ||
        /unknown|unnamed|untitled|no name|n\/a/i.test(placeName)) {
      continue;
    }

    const category = mapToCategory(place);
    const primaryTag = place.tags?.tourism || place.tags?.historic || place.tags?.leisure || place.tags?.natural || 'attraction';
    
    const activity: NormalizedActivity = {
      id: `osm-${place.id}`,
      name: placeName,
      category,
      location: {
        lat: place.lat,
        lng: place.lon,
      },
      address: destination,
      description: `${placeName} - ${primaryTag.replace(/_/g, ' ')}`,
      confidence: getConfidenceLevel(place),
      type: primaryTag,
    };

    normalized.push(activity);
  }

  return normalized;
}

/**
 * Main API handler with pagination and filtering support
 */
export async function GET(request: NextRequest) {
  try {
    // Extract parameters from query
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get('destination');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || String(ITEMS_PER_PAGE));
    const filtersParam = searchParams.get('filters');
    
    // Parse and validate filters
    let filters: string[] = DEFAULT_FILTERS;
    if (filtersParam) {
      const requestedFilters = filtersParam.split(',').map(f => f.trim().toLowerCase());
      // Validate against allowed types
      filters = requestedFilters.filter(f => 
        VALID_ACTIVITY_TYPES.includes(f as any)
      );
      // If no valid filters, use defaults
      if (filters.length === 0) {
        filters = DEFAULT_FILTERS;
      }
    }

    if (!destination || destination.trim().length === 0) {
      return NextResponse.json(
        { error: 'Destination parameter is required' },
        { status: 400 }
      );
    }

    console.log('[DEBUG] Explore request:', {
      destination,
      page,
      limit,
      filters,
    });

    // Step 1: Get coordinates for the destination using Nominatim
    const coordinates = await getDestinationCoordinates(destination);
    
    if (!coordinates) {
      // Return empty response if geocoding fails (graceful degradation)
      return NextResponse.json<ExploreResponse>(
        {
          destination,
          destinationInfo: `Explore ${destination}`,
          activities: [],
          pagination: {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: limit,
            hasNextPage: false,
            hasPreviousPage: false,
          },
          appliedFilters: filters,
        },
        { status: 200 }
      );
    }

    // Step 2: Fetch nearby attractions from OpenStreetMap with filters
    const places = await fetchNearbyAttractions(coordinates.lat, coordinates.lon, filters);

    // Step 3: Normalize and clean the data
    const allActivities = normalizeActivities(places, destination);

    // Step 4: Implement pagination
    const totalItems = allActivities.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedActivities = allActivities.slice(startIndex, endIndex);

    console.log('[DEBUG] Pagination:', {
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage: limit,
      startIndex,
      endIndex,
      returnedItems: paginatedActivities.length,
    });

    // Generate destination description
    const destinationInfo = coordinates.name 
      ? `Discover ${totalItems} attractions in ${coordinates.name}. Find museums, parks, monuments, and cultural landmarks.`
      : `Explore ${destination} and discover ${totalItems} amazing places to visit.`;

    // Step 5: Return paginated data with metadata
    return NextResponse.json<ExploreResponse>(
      {
        destination,
        destinationInfo,
        activities: paginatedActivities,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
        appliedFilters: filters,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in explore API:', error);
    
    // Return empty response on error (graceful degradation)
    return NextResponse.json<ExploreResponse>(
      {
        destination: '',
        destinationInfo: '',
        activities: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: ITEMS_PER_PAGE,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        appliedFilters: DEFAULT_FILTERS,
      },
      { status: 200 }
    );
  }
}
