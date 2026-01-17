import { NextRequest, NextResponse } from 'next/server';

/**
 * API route for searching nearby places
 * Uses OpenStreetMap Overpass API for free geocoded data
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const query = searchParams.get('query') || '';
    const categories = searchParams.get('categories')?.split(',') || [];

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Define radius (in meters)
    const radius = 5000; // 5km

    // Build Overpass query
    const overpassQuery = buildOverpassQuery(
      parseFloat(lat),
      parseFloat(lng),
      radius,
      categories
    );

    // Query Overpass API
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(overpassQuery)}`,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Overpass API');
    }

    const data = await response.json();

    // Transform data to our activity format
    const activities = transformOverpassData(
      data.elements,
      parseFloat(lat),
      parseFloat(lng),
      categories
    );

    return NextResponse.json({
      activities,
      count: activities.length,
    });
  } catch (error) {
    console.error('Error in places API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch places', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Build Overpass QL query based on filters
 */
function buildOverpassQuery(
  lat: number,
  lng: number,
  radius: number,
  categories: string[]
): string {
  // Map categories to OSM tags
  const osmTags = mapCategoriesToOSMTags(categories);
  
  // If no specific categories, fetch common tourism/amenity POIs
  const tags = osmTags.length > 0 
    ? osmTags 
    : [
        'tourism',
        'amenity=restaurant',
        'amenity=cafe',
        'historic',
        'leisure=park',
      ];

  // Build query parts
  const queries = tags.map(tag => {
    if (tag.includes('=')) {
      const [key, value] = tag.split('=');
      return `node["${key}"="${value}"](around:${radius},${lat},${lng});`;
    }
    return `node["${tag}"](around:${radius},${lat},${lng});`;
  });

  return `
    [out:json][timeout:25];
    (
      ${queries.join('\n')}
    );
    out body;
    >;
    out skel qt;
  `;
}

/**
 * Map our filter categories to OSM tags
 */
function mapCategoriesToOSMTags(categories: string[]): string[] {
  const tagMap: Record<string, string[]> = {
    hotel: ['tourism=hotel', 'tourism=hostel', 'tourism=guest_house'],
    hostel: ['tourism=hostel'],
    resort: ['tourism=resort'],
    lodging: ['tourism=hotel'],
    accommodation: ['tourism=hotel', 'tourism=hostel'],
    restaurant: ['amenity=restaurant'],
    cafe: ['amenity=cafe'],
    bar: ['amenity=bar', 'amenity=pub'],
    food: ['amenity=restaurant', 'amenity=cafe', 'amenity=fast_food'],
    bakery: ['shop=bakery'],
    church: ['amenity=place_of_worship', 'building=church'],
    mosque: ['amenity=place_of_worship', 'building=mosque'],
    temple: ['amenity=place_of_worship', 'building=temple'],
    synagogue: ['amenity=place_of_worship', 'building=synagogue'],
    place_of_worship: ['amenity=place_of_worship'],
    park: ['leisure=park', 'leisure=garden'],
    natural_feature: ['natural'],
    zoo: ['tourism=zoo'],
    tourist_attraction: ['tourism=attraction', 'tourism=viewpoint'],
    museum: ['tourism=museum'],
    art_gallery: ['tourism=gallery'],
    aquarium: ['tourism=aquarium'],
    amusement_park: ['tourism=theme_park'],
    landmark: ['historic', 'tourism=attraction'],
    airport: ['aeroway=aerodrome'],
    train_station: ['railway=station'],
    transit_station: ['public_transport=station'],
    bus_station: ['amenity=bus_station'],
    shopping_mall: ['shop=mall'],
    store: ['shop'],
  };

  const tags: string[] = [];
  for (const category of categories) {
    const mapped = tagMap[category];
    if (mapped) {
      tags.push(...mapped);
    }
  }

  return [...new Set(tags)]; // Remove duplicates
}

/**
 * Generate a meaningful description from OSM tags
 */
function generateDescription(tags: any): string {
  // If there's a Wikipedia tag, use it
  if (tags.wikipedia) return `Learn more: ${tags.wikipedia}`;
  
  // If there's a description, use it
  if (tags.description) return tags.description;
  
  // Generate description from available tags
  const parts = [];
  
  // Type of place
  if (tags.tourism) {
    parts.push(tags.tourism.replace(/_/g, ' '));
  } else if (tags.amenity) {
    parts.push(tags.amenity.replace(/_/g, ' '));
  } else if (tags.historic) {
    parts.push(`historic ${tags.historic.replace(/_/g, ' ')}`);
  } else if (tags.leisure) {
    parts.push(tags.leisure.replace(/_/g, ' '));
  }
  
  // Religion for places of worship
  if (tags.religion) {
    parts.push(`(${tags.religion})`);
  }
  
  // Denomination for religious places
  if (tags.denomination) {
    parts.push(`- ${tags.denomination}`);
  }
  
  // Building type
  if (tags.building && tags.building !== 'yes') {
    parts.push(`${tags.building} building`);
  }
  
  // Cuisine for restaurants
  if (tags.cuisine) {
    parts.push(`Cuisine: ${tags.cuisine.replace(/;/g, ', ')}`);
  }
  
  // Website
  if (tags.website) {
    parts.push(`Website: ${tags.website}`);
  }
  
  // Phone
  if (tags.phone) {
    parts.push(`Tel: ${tags.phone}`);
  }
  
  return parts.length > 0 ? parts.join(' ').trim() : '';
}

/**
 * Transform Overpass data to our activity format
 */
function transformOverpassData(
  elements: any[],
  centerLat: number,
  centerLng: number,
  filterCategories: string[]
): any[] {
  return elements
    .filter((el) => el.type === 'node' && el.tags)
    .map((el) => {
      const tags = el.tags;
      const name = tags.name || tags['name:en'] || 'Unnamed Location';
      const category = determineCategory(tags, filterCategories);
      
      return {
        id: `osm-${el.id}`,
        name,
        type: tags.tourism || tags.amenity || tags.historic || tags.leisure || 'place',
        description: generateDescription(tags),
        location: {
          lat: el.lat,
          lng: el.lon,
        },
        address: formatAddress(tags),
        category,
        distance: calculateDistance(centerLat, centerLng, el.lat, el.lon),
      };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 50); // Limit to 50 results
}

/**
 * Determine activity category from OSM tags
 */
function determineCategory(tags: any, filterCategories: string[]): string {
  // Check filter categories first
  if (filterCategories.length > 0) {
    for (const category of filterCategories) {
      if (tags.tourism === category || tags.amenity === category) {
        return mapOSMToOurCategory(category);
      }
    }
  }

  // Priority-based category detection (check most specific first)
  
  // Religious places (highest priority for places of worship)
  if (tags.amenity === 'place_of_worship' || 
      tags.building === 'church' || 
      tags.building === 'temple' || 
      tags.building === 'mosque' ||
      tags.building === 'cathedral' ||
      tags.building === 'chapel' ||
      tags.building === 'synagogue') {
    return 'religious';
  }
  
  // Accommodation
  if (tags.tourism && ['hotel', 'hostel', 'guest_house', 'motel', 'apartment'].includes(tags.tourism)) {
    return 'accommodation';
  }
  
  // Food & Restaurants
  if (tags.amenity && ['restaurant', 'cafe', 'bar', 'pub', 'fast_food', 'food_court'].includes(tags.amenity)) {
    return 'food';
  }
  
  // Nature & Parks
  if (tags.leisure && ['park', 'garden', 'nature_reserve'].includes(tags.leisure)) {
    return 'nature';
  }
  if (tags.natural || tags.tourism === 'viewpoint') {
    return 'nature';
  }
  
  // Attractions & Monuments
  if (tags.tourism && ['museum', 'gallery', 'attraction', 'artwork', 'viewpoint'].includes(tags.tourism)) {
    return 'attractions';
  }
  if (tags.historic) {
    return 'attractions';
  }
  
  // Transport
  if (tags.amenity && ['bus_station', 'taxi'].includes(tags.amenity)) {
    return 'transport';
  }
  if (tags.railway || tags.aeroway || tags.public_transport) {
    return 'transport';
  }
  
  // Shopping
  if (tags.shop) {
    return 'shopping';
  }
  
  // Zoo/Aquarium
  if (tags.tourism === 'zoo' || tags.tourism === 'aquarium') {
    return 'nature';
  }

  return 'general';
}

/**
 * Map OSM category to our category
 */
function mapOSMToOurCategory(osmCategory: string): string {
  const map: Record<string, string> = {
    hotel: 'accommodation',
    hostel: 'accommodation',
    restaurant: 'food',
    cafe: 'food',
    bar: 'food',
    church: 'religious',
    mosque: 'religious',
    temple: 'religious',
    park: 'nature',
    museum: 'attractions',
    attraction: 'attractions',
  };
  return map[osmCategory] || 'general';
}

/**
 * Format address from OSM tags
 * Uses multiple fallback strategies to create meaningful addresses
 */
function formatAddress(tags: any): string {
  const parts = [];
  
  // Street address
  if (tags['addr:street']) {
    const houseNumber = tags['addr:housenumber'] || '';
    parts.push(`${houseNumber} ${tags['addr:street']}`.trim());
  }
  
  // City/Town/Village
  const locality = tags['addr:city'] || tags['addr:town'] || tags['addr:village'] || tags['addr:suburb'];
  if (locality) {
    parts.push(locality);
  }
  
  // State/Region
  if (tags['addr:state'] || tags['addr:province']) {
    parts.push(tags['addr:state'] || tags['addr:province']);
  }
  
  // Country
  if (tags['addr:country']) {
    parts.push(tags['addr:country']);
  }
  
  // If still empty, try to construct from other available tags
  if (parts.length === 0) {
    // Use city or country if available
    if (tags.city) parts.push(tags.city);
    if (tags.country) parts.push(tags.country);
  }

  return parts.length > 0 ? parts.join(', ') : '';
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
