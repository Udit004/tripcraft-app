// app/trips/[tripSlug]/itinerary/[daySlug]/page.tsx
"use client";
import React, { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IActivity } from '@/types/activity';
import { IItineraryDay } from '@/types/itineraryDay';
import { getItineraryDayById, addActivityToItineraryDay, deleteActivity, updateActivityOrder } from '@/services/tripService';
import { LoadingState } from '@/components/dashboard/tripSlug/dayActivity/LoadingState';
import { ErrorState } from '@/components/dashboard/tripSlug/dayActivity/ErrorState';
import ActivityListWithDnD from '@/components/dashboard/tripSlug/dayActivity/ActivityListWithDnD';
import { Calendar, MapPin, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';


export default function ItineraryPage({ 
  params 
}: { 
  params: Promise<{ tripSlug: string; daySlug: string }> 
}) {
  const router = useRouter();
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

  const handleAddActivity = async (activityData: any) => {
    try {
      // Convert time strings to Date objects if provided
      const formattedData = {
        ...activityData,
        startTime: activityData.startTime ? new Date(`2000-01-01T${activityData.startTime}`) : undefined,
        endTime: activityData.endTime ? new Date(`2000-01-01T${activityData.endTime}`) : undefined,
      };
      
      await addActivityToItineraryDay(tripSlug, daySlug, formattedData);
      // Refresh the data
      await fetchItineraryDayById();
    } catch (error) {
      console.error('Error adding activity:', error);
      throw error;
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    try {
      await deleteActivity(tripSlug, daySlug, activityId);
      // Refresh the data
      await fetchItineraryDayById();
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  };

  const handleReorderActivities = async (activities: IActivity[]) => {
    try {
      const activityIds = activities.map(a => a._id?.toString()).filter(Boolean) as string[];
      await updateActivityOrder(tripSlug, daySlug, activityIds);
      // Update local state
      setActivityData(activities);
    } catch (error) {
      console.error('Error reordering activities:', error);
      // Revert on error
      await fetchItineraryDayById();
      throw error;
    }
  };

  const handleEditActivity = (activity: IActivity) => {
    // TODO: Implement edit functionality
    console.log('Edit activity:', activity);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push(`/dashboard/${tripSlug}`)}
              className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors font-semibold mb-4 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Itinerary
            </button>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Day {itineraryData.dayNumber}
            </h2>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <span className="font-medium">
                  {format(new Date(itineraryData.date), 'EEEE, MMMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Activities Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <ActivityListWithDnD
            tripId={tripSlug}
            dayId={daySlug}
            initialActivities={activityData}
            onActivityAdd={handleAddActivity}
            onActivityEdit={handleEditActivity}
            onActivityDelete={handleDeleteActivity}
            onReorder={handleReorderActivities}
          />
        </div>
      </div>
    </div>
  );
}