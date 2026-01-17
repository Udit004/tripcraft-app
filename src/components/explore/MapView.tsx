'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ExploreActivity, MapViewport } from '@/types/explore';
import { colors } from '@/constants/colors';
import { Loader2, Navigation } from 'lucide-react';

interface MapViewProps {
  activities: ExploreActivity[];
  viewport: MapViewport;
  onViewportChange: (viewport: MapViewport) => void;
  onActivityClick: (activityId: string) => void;
  onMapClick?: (coordinates: { lat: number; lng: number }) => void;
  highlightedActivityId?: string;
  className?: string;
}

/**
 * Interactive map component using MapLibre GL JS
 * Displays activity markers with clustering and sync with activity list
 */
export function MapView({
  activities,
  viewport,
  onViewportChange,
  onActivityClick,
  onMapClick,
  highlightedActivityId,
  className = '',
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<Map<string, maplibregl.Marker>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json', // Free CartoDB style
        center: [viewport.longitude, viewport.latitude],
        zoom: viewport.zoom,
      });

      // Add navigation controls
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

      // Add geolocation control
      map.current.addControl(
        new maplibregl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        }),
        'top-right'
      );

      // Map click handler for reverse geocoding
      map.current.on('click', (e) => {
        if (onMapClick) {
          onMapClick({
            lat: e.lngLat.lat,
            lng: e.lngLat.lng,
          });
        }
      });

      // Update viewport on map move
      map.current.on('moveend', () => {
        if (map.current) {
          const center = map.current.getCenter();
          const zoom = map.current.getZoom();
          onViewportChange({
            latitude: center.lat,
            longitude: center.lng,
            zoom,
          });
        }
      });

      map.current.on('load', () => {
        setIsLoading(false);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setIsLoading(false);
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update map center when viewport changes externally
  useEffect(() => {
    if (map.current) {
      map.current.flyTo({
        center: [viewport.longitude, viewport.latitude],
        zoom: viewport.zoom,
        duration: 1000,
      });
    }
  }, [viewport.latitude, viewport.longitude, viewport.zoom]);

  // Update markers when activities change
  useEffect(() => {
    if (!map.current) return;

    // Remove old markers
    markers.current.forEach((marker) => marker.remove());
    markers.current.clear();

    // Add new markers
    activities.forEach((activity) => {
      // Outer wrapper for MapLibre (DO NOT modify transform on this!)
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.cursor = 'pointer';
      
      // Inner circle that we can safely scale
      const innerCircle = document.createElement('div');
      innerCircle.className = 'marker-inner';
      innerCircle.style.width = '32px';
      innerCircle.style.height = '32px';
      innerCircle.style.borderRadius = '50%';
      innerCircle.style.backgroundColor = colors.primary;
      innerCircle.style.border = '3px solid white';
      innerCircle.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      innerCircle.style.transition = 'transform 0.2s, box-shadow 0.2s';
      innerCircle.style.position = 'relative';
      innerCircle.style.display = 'flex';
      innerCircle.style.alignItems = 'center';
      innerCircle.style.justifyContent = 'center';
      
      // Add category emoji
      const emojiSpan = document.createElement('span');
      emojiSpan.textContent = getCategoryEmoji(activity.category);
      emojiSpan.style.fontSize = '16px';
      emojiSpan.style.lineHeight = '1';
      innerCircle.appendChild(emojiSpan);
      
      el.appendChild(innerCircle);
      
      // Store activity ID on the element for easy access
      el.setAttribute('data-activity-id', activity.id);

      el.addEventListener('mouseenter', () => {
        innerCircle.style.transform = 'scale(1.2)';
        innerCircle.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
      });

      el.addEventListener('mouseleave', () => {
        if (activity.id !== highlightedActivityId) {
          innerCircle.style.transform = 'scale(1)';
          innerCircle.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        }
      });

      el.addEventListener('click', () => {
        onActivityClick(activity.id);
        // Open the popup when marker is clicked
        marker.togglePopup();
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([activity.location.lng, activity.location.lat])
        .addTo(map.current!);

      // Add popup
      const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 8px;">
          <h3 style="margin: 0 0 4px 0; font-weight: 600; font-size: 14px;">${activity.name}</h3>
          <p style="margin: 0; font-size: 12px; color: #666;">${activity.address || ''}</p>
          ${activity.rating ? `<p style="margin: 4px 0 0 0; font-size: 12px;">⭐ ${activity.rating.toFixed(1)}</p>` : ''}
        </div>
      `);

      marker.setPopup(popup);
      markers.current.set(activity.id, marker);
    });
  }, [activities, onActivityClick]);

  // Highlight marker when activity is hovered in list
  useEffect(() => {
    markers.current.forEach((marker, id) => {
      const el = marker.getElement();
      const innerCircle = el.querySelector('.marker-inner') as HTMLElement;
      
      if (!innerCircle) return;
      
      if (id === highlightedActivityId) {
        innerCircle.style.transform = 'scale(1.4)';
        innerCircle.style.boxShadow = '0 6px 16px rgba(0,0,0,0.5)';
        el.style.zIndex = '1000';
      } else {
        innerCircle.style.transform = 'scale(1)';
        innerCircle.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        el.style.zIndex = '1';
      }
    });
  }, [highlightedActivityId]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center rounded-lg"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        >
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" style={{ color: colors.primary }} />
            <p className="text-white text-sm">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper to get emoji for category
function getCategoryEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    accommodation: '🏨',
    food: '🍽️',
    religious: '🛕',
    nature: '🌳',
    attractions: '🏛️',
    transport: '🚉',
    shopping: '🛍️',
  };
  return emojiMap[category] || '📍';
}
