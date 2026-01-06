// app/trips/[tripSlug]/itinerary/[daySlug]/page.tsx
"use client";
import React, { use, useEffect, useState } from 'react';
import { IActivity } from '@/types/activity';
import { IItineraryDay } from '@/types/itineraryDay';
import { getItineraryDayById } from '@/services/tripService';
import { ItineraryDayView } from '@/components/dashboard/tripSlug/dayActivity/ItineraryDayView';
import { LoadingState } from '@/components/dashboard/tripSlug/dayActivity/LoadingState';
import { ErrorState } from '@/components/dashboard/tripSlug/dayActivity/ErrorState';


export default function ItineraryPage({ 
  params 
}: { 
  params: Promise<{ tripSlug: string; daySlug: string }> 
}) {
  const { tripSlug, daySlug } = use(params);
  
  const [itineraryData, setItineraryData] = useState<IItineraryDay | null>(null);
  const [activityData, setActivityData] = useState<IActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItineraryDayById = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const dayData = await getItineraryDayById(tripSlug, daySlug);
      
      if (dayData) {
        setItineraryData(dayData);
        setActivityData(dayData.activities || []);
      } else {
        setError('Itinerary day not found');
      }
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      setError('Failed to fetch itinerary day data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tripSlug && daySlug) {
      fetchItineraryDayById();
    }
  }, [tripSlug, daySlug]);

  // Loading State
  if (loading) {
    return <LoadingState />;
  }

  // Error State
  if (error) {
    return <ErrorState message={error} onRetry={fetchItineraryDayById} />;
  }

  // Empty State
  if (!itineraryData) {
    return (
      <ErrorState 
        message="No itinerary data available" 
        onRetry={fetchItineraryDayById} 
      />
    );
  }

  // Success State
  return (
    <ItineraryDayView 
      itineraryDay={itineraryData} 
      activities={activityData} 
    />
  );
}