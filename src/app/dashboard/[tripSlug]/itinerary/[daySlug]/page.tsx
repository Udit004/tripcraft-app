// app/trips/[tripSlug]/itinerary/[daySlug]/page.tsx
"use client";
import React, { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IActivity, IActivityApiResponse, IActivityResponse, ICreateActivityRequest } from '@/types/activity';
import { IItineraryDay } from '@/types/itineraryDay';
import { getItineraryDayById, addActivityToItineraryDay, deleteActivity, updateActivity, updateActivityOrder, updateItineraryDay, deleteItineraryDay } from '@/services/tripService';
import { LoadingState } from '@/components/dashboard/dayActivity/LoadingState';
import { ErrorState } from '@/components/dashboard/dayActivity/ErrorState';
import ActivityListWithDnD from '@/components/dashboard/dayActivity/ActivityListWithDnD';
import EditItineraryDayModal from '@/components/dashboard/itineraryDay/EditItineraryDayModal';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import DayHeader from '@/components/dashboard/itineraryDay/DayHeader';
import { analyzeDay } from '@/utility/dayWarnings';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/lib/toast';
import { toast as sonnerToast } from 'sonner';
import UndoToast from '@/components/UndoToast';
import { GradientButton } from '@/components/ui/GradientButton';


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
  const [editingDay, setEditingDay] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Analyze day for warnings whenever activities change
  const dayWarnings = React.useMemo(() => {
    return analyzeDay(activityData);
  }, [activityData]);

  const fetchItineraryDayById = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const dayData = await getItineraryDayById(tripSlug, daySlug);
      
      if (dayData) {
        setItineraryData(dayData);
        setActivityData(dayData.activities || []);
      } else {
        const errorMsg = 'Itinerary day not found';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      const errorMsg = 'Failed to fetch itinerary day data';
      setError(errorMsg);
      toast.error(errorMsg);
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
      toast.success('Activity added successfully!');
      // Refresh the data
      await fetchItineraryDayById();
    } catch (error) {
      console.error('Error adding activity:', error);
      toast.error('Failed to add activity. Please try again.');
      throw error;
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    try {
      await deleteActivity(tripSlug, daySlug, activityId);
      toast.delete('Activity deleted successfully!');
      // Refresh the data
      await fetchItineraryDayById();
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('Failed to delete activity. Please try again.');
      throw error;
    }
  };

  const handleReorderActivities = async (activities: IActivity[]) => {
    try {
      const activityIds = activities.map(a => a._id?.toString()).filter(Boolean) as string[];
      await updateActivityOrder(tripSlug, daySlug, activityIds);
      // Update local state
      setActivityData(activities);
      toast.success('Activities reordered successfully!');
    } catch (error) {
      console.error('Error reordering activities:', error);
      toast.error('Failed to reorder activities. Please try again.');
      // Revert on error
      await fetchItineraryDayById();
      throw error;
    }
  };

const handleEditActivity = async (activityId: string, activityData: any) => {
    try {
      // Convert time strings to Date objects if provided, otherwise exclude them
      const formattedData: any = {  
        activityType: activityData.activityType,
        title: activityData.title,
        description: activityData.description,
        location: activityData.location,
      };  
      // Only include time fields if they have values
      if (activityData.startTime) {
        formattedData.startTime = new Date(`2000-01-01T${activityData.startTime}`);
      }
      if (activityData.endTime) {
        formattedData.endTime = new Date(`2000-01-01T${activityData.endTime}`);
      }
      await updateActivity(tripSlug, daySlug, activityId, formattedData);
      toast.success('Activity updated successfully!');
      // Refresh the data
      await fetchItineraryDayById();
    }
    catch (error) {
      console.error('Error updating activity:', error);
      toast.error('Failed to update activity. Please try again.');
      throw error;
    }
  };


  const handleUpdateActivity = async (activityId: string, activityData: any) => {
    try {
      // Convert time strings to Date objects if provided, otherwise exclude them
      const formattedData: any = {
        activityType: activityData.activityType,
        title: activityData.title,
        description: activityData.description,
        location: activityData.location,
      };

      // Only include time fields if they have values
      if (activityData.startTime) {
        formattedData.startTime = new Date(`2000-01-01T${activityData.startTime}`);
      }
      if (activityData.endTime) {
        formattedData.endTime = new Date(`2000-01-01T${activityData.endTime}`);
      }
      
      await updateActivity(tripSlug, daySlug, activityId, formattedData);
      toast.success('Activity updated successfully!');
      // Refresh the data
      await fetchItineraryDayById();
    } catch (error) {
      console.error('Error updating activity:', error);
      toast.error('Failed to update activity. Please try again.');
      throw error;
    }
  };

  const handleDeleteDay = async () => {
    if (!itineraryData) return;
    
    try {
      setDeleting(true);
      const result = await deleteItineraryDay(tripSlug, daySlug);
      
      if (result.success) {
        setShowDeleteConfirm(false);
        
        // Show undo toast with countdown
        if (result.deletionLogId) {
          const dayNumber = itineraryData.dayNumber;
          const dayDate = format(new Date(itineraryData.date), 'MMM d, yyyy');
          
          sonnerToast.custom(
            (t) => (
              <UndoToast
                message={`Day ${dayNumber} (${dayDate}) deleted`}
                deletionLogId={result.deletionLogId!}
                onUndo={() => {
                  sonnerToast.dismiss(t);
                  // Refetch the data instead of navigating back
                  fetchItineraryDayById();
                }}
                onExpire={() => {
                  sonnerToast.dismiss(t);
                  // Navigate back only after undo window expires
                  router.push(`/dashboard/${tripSlug}`);
                }}
                undoWindowSeconds={result.undoWindowSeconds || 10}
              />
            ),
            { duration: (result.undoWindowSeconds || 10) * 1000 }
          );
          
          // Don't navigate immediately, wait for undo window
          // Navigation happens in onExpire callback
        } else {
          toast.delete('Itinerary day deleted successfully!');
          router.push(`/dashboard/${tripSlug}`);
        }
      } else {
        toast.error('Failed to delete itinerary day');
      }
    } catch (error) {
      console.error('Error deleting itinerary day:', error);
      toast.error('Failed to delete itinerary day. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleblackDrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setEditingDay(false);
    } 
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
              className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Itinerary
            </button>
            
            <div className="flex items-center gap-2">
              <GradientButton
                variant='edit'
                onClick={() => setEditingDay(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-semibold cursor-pointer"
              >
                <Pencil className="w-5 h-5" />
                Edit
              </GradientButton>
              <GradientButton
                variant='delete'
                onClick={() => setShowDeleteConfirm(true)}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-5 h-5" />
                Delete
              </GradientButton>
            </div>
          </div>
          <DayHeader 
            dayNumber={itineraryData.dayNumber}
            dayName={itineraryData.dayName}
            date={itineraryData.date.toString()}
            warnings={dayWarnings}
          />
        </div>

        {/* Activities Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <ActivityListWithDnD
            tripId={tripSlug}
            dayId={daySlug}
            initialActivities={activityData}
            onActivityAdd={handleAddActivity}
            onActivityEdit={handleEditActivity}
            onActivityUpdate={handleUpdateActivity}
            onActivityDelete={handleDeleteActivity}
            onReorder={handleReorderActivities}
          />
        </div>
      </div>

      {/* Edit Itinerary Day Modal */}
      {editingDay && itineraryData && (
        <div 
        onClick={(e) => handleblackDrop(e)}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center pt-20 overflow-y-auto">
          <div className="relative max-w-xl w-full mx-4 my-8">
            <EditItineraryDayModal
              dayId={daySlug}
              tripId={tripSlug}
              initialDayData={itineraryData}
              onUpdateDay={updateItineraryDay}
              onClose={() => setEditingDay(false)}
              onSuccess={() => {
                setEditingDay(false);
                fetchItineraryDayById();
              }}
            />
            <button
              onClick={() => setEditingDay(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-50 bg-white rounded-full p-1 cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        isLoading={deleting}
        title="Delete Itinerary Day"
        message={`Are you sure you want to delete Day ${itineraryData?.dayNumber}?`}
        itemName={itineraryData ? format(new Date(itineraryData.date), 'EEEE, MMMM d, yyyy') : ''}
        onConfirm={handleDeleteDay}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText="Delete Day"
        cancelText="Keep It"
      />
    </div>
  );
}