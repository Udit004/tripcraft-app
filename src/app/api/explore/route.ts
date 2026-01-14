import { NextRequest, NextResponse } from 'next/server';

// No API key needed for OpenStreetMap!
const REQUEST_TIMEOUT = 10000; // 10 seconds

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
  title: string;
  category: string;
  location: string;
  description: string;
  confidence: 'high' | 'medium' | 'low';
}

interface ExploreResponse {
  destination: string;
  destinationInfo: string;
  activities: NormalizedActivity[];
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
    
    const response = await fetchWithTimeout(url, 5000);

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
 */
async function fetchNearbyAttractions(lat: number, lon: number): Promise<OSMPlace[]> {
  const radius = 3000; // 3km radius (reduced from 5km to reduce load)
  
  // Simplified Overpass QL query for better performance
  const query = `
    [out:json][timeout:15];
    (
      node["tourism"](around:${radius},${lat},${lon});
      node["historic"](around:${radius},${lat},${lon});
    );
    out body 30;
  `;
  
  console.log(`[DEBUG] Fetching attractions from OpenStreetMap:`, {
    lat,
    lon,
    radius,
  });

  // Try each API instance until one succeeds
  for (let i = 0; i < OVERPASS_API_URLS.length; i++) {
    const apiUrl = OVERPASS_API_URLS[i];
    
    try {
      console.log(`[DEBUG] Trying Overpass API instance ${i + 1}/${OVERPASS_API_URLS.length}: ${apiUrl}`);
      
      const response = await fetchWithTimeout(apiUrl, 12000, {
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
        console.log('[DEBUG] Sample places:', responseData.elements.slice(0, 2));
        return responseData.elements;
      }

      return [];
    } catch (error) {
      console.error(`[DEBUG] Error with Overpass instance ${i + 1}:`, error);
      
      // If this isn't the last instance, try the next one
      if (i < OVERPASS_API_URLS.length - 1) {
        console.log(`[DEBUG] Trying next Overpass API instance...`);
        continue;
      }
      return [];
    }
  }

  return [];
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
 */
function normalizeActivities(
  places: OSMPlace[],
  destination: string
): NormalizedActivity[] {
  const normalized: NormalizedActivity[] = [];

  for (const place of places) {
    // Ignore places with empty names
    if (!place.tags?.name || place.tags.name.trim().length === 0) {
      continue;
    }

    const category = mapToCategory(place);
    const primaryTag = place.tags.tourism || place.tags.historic || place.tags.leisure || place.tags.natural || 'attraction';
    
    const activity: NormalizedActivity = {
      title: place.tags.name,
      category,
      location: destination,
      description: `${place.tags.name} - ${primaryTag.replace(/_/g, ' ')}`,
      confidence: getConfidenceLevel(place),
    };

    normalized.push(activity);

    // Limit to max 15 results
    if (normalized.length >= 15) {
      break;
    }
  }

  return normalized;
}

/**
 * Main API handler
 */
export async function GET(request: NextRequest) {
  try {
    // Extract destination from query parameters
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get('destination');

    if (!destination || destination.trim().length === 0) {
      return NextResponse.json(
        { error: 'Destination parameter is required' },
        { status: 400 }
      );
    }

    // Step 1: Get coordinates for the destination using Nominatim
    const coordinates = await getDestinationCoordinates(destination);
    
    if (!coordinates) {
      // Return empty array if geocoding fails (graceful degradation)
      return NextResponse.json<ExploreResponse>(
        {
          destination,
          destinationInfo: `Explore ${destination}`,
          activities: [],
        },
        { status: 200 }
      );
    }

    // Step 2: Fetch nearby attractions from OpenStreetMap (100% free!)
    const places = await fetchNearbyAttractions(coordinates.lat, coordinates.lon);

    // Step 3: Normalize the response
    const activities = normalizeActivities(places, destination);

    // Generate destination description
    const destinationInfo = coordinates.name 
      ? `Discover the best attractions in ${coordinates.name}. Find museums, parks, monuments, and cultural landmarks.`
      : `Explore ${destination} and discover amazing places to visit.`;

    // Step 4: Return clean data to frontend
    return NextResponse.json<ExploreResponse>(
      {
        destination,
        destinationInfo,
        activities,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in explore API:', error);
    
    // Return empty array on error (do not throw hard error)
    return NextResponse.json<ExploreResponse>(
      {
        destination: '',
        destinationInfo: '',
        activities: [],
      },
      { status: 200 }
    );
  }
}
