"use client"

import { ITripResponse, ICreateTripRequest } from "@/types/trip";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Edit2, Trash2, FileText, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateTrip, deleteTrip } from "@/services/tripService";
import EditTripModal from "../trip/EditTripModal";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { colors } from "@/constants/colors";
import { toast } from '@/lib/toast'

interface TripHeaderProps {
  trip: ITripResponse;
}

export default function TripHeader({ trip }: TripHeaderProps) {
  const router = useRouter();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDuration = (): number => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleEditTrip = async (tripId: string, tripData: ICreateTripRequest) => {
    try {
      await updateTrip(tripId, tripData);
      setOpenEditModal(false);
      router.refresh();
    } catch (err) {
      setError('Failed to update trip. Please try again.');
      console.error('Update trip error:', err);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setError(null);
    
    try {
      await deleteTrip(trip._id!);
      toast.delete('Trip deleted successfully!');
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to delete trip. Please try again.');
      console.error('Delete trip error:', err);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setError(null);
  };

  return (
    <>
      <Card 
        className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
        style={{ borderColor: colors.border }}
      >
        {/* Header Section with Gradient */}
        <div 
          className="px-6 py-8 text-white"
          style={{
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
          }}
        >
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard')}
            className="mb-4 flex items-center gap-2 text-white hover:bg-white/10 -ml-2 cursor-pointer transition-all"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back to Dashboard</span>
          </Button>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold mb-2 break-words">{trip.tripName}</h1>
              
              {trip.tripDescription && (
                <div className="flex items-start gap-2 mt-3 text-white/90">
                  <FileText className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p className="text-base leading-relaxed">{trip.tripDescription}</p>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpenEditModal(true)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border-white/30 text-white backdrop-blur-sm transition-all cursor-pointer"
              >
                <Edit2 className="h-4 w-4" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
                className="flex items-center gap-2 bg-red-600/80 hover:bg-red-700 border-red-500/30 text-white backdrop-blur-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="pt-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
              <p className="text-red-700 font-medium text-sm">{error}</p>
            </div>
          )}

          {/* Trip Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Destination */}
            <div 
              className="flex items-center gap-3 p-4 rounded-lg"
              style={{ 
                backgroundColor: `${colors.primary}10`,
                borderLeft: `4px solid ${colors.primary}`
              }}
            >
              <div 
                className="p-2 rounded-full"
                style={{ backgroundColor: colors.primary }}
              >
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Destination</p>
                <p 
                  className="text-lg font-semibold mt-0.5"
                  style={{ color: colors.textMain }}
                >
                  {trip.destination}
                </p>
              </div>
            </div>

            {/* Duration */}
            <div 
              className="flex items-center gap-3 p-4 rounded-lg"
              style={{ 
                backgroundColor: `${colors.accent}10`,
                borderLeft: `4px solid ${colors.accent}`
              }}
            >
              <div 
                className="p-2 rounded-full"
                style={{ backgroundColor: colors.accent }}
              >
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Duration</p>
                <p 
                  className="text-lg font-semibold mt-0.5"
                  style={{ color: colors.textMain }}
                >
                  {calculateDuration()} {calculateDuration() === 1 ? 'Day' : 'Days'}
                </p>
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div 
            className="mt-6 p-4 rounded-lg"
            style={{ backgroundColor: colors.background }}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Calendar 
                  className="h-5 w-5"
                  style={{ color: colors.secondary }}
                />
                <div>
                  <p className="text-xs font-medium text-gray-500">Start Date</p>
                  <p 
                    className="text-sm font-semibold mt-0.5"
                    style={{ color: colors.textMain }}
                  >
                    {formatDate(trip.startDate)}
                  </p>
                </div>
              </div>

              <div 
                className="hidden sm:block h-12 w-px"
                style={{ backgroundColor: colors.border }}
              />

              <div className="flex items-center gap-2">
                <Calendar 
                  className="h-5 w-5"
                  style={{ color: colors.secondary }}
                />
                <div>
                  <p className="text-xs font-medium text-gray-500">End Date</p>
                  <p 
                    className="text-sm font-semibold mt-0.5"
                    style={{ color: colors.textMain }}
                  >
                    {formatDate(trip.endDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Trip Modal */}
      {openEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center pt-20 overflow-y-auto">
          <div className="relative max-w-xl w-full mx-4 my-8 top-28">
            <EditTripModal
              tripId={trip._id!}
              initialTripData={{
                tripName: trip.tripName,
                tripDescription: trip.tripDescription,
                destination: trip.destination,
                startDate: new Date(trip.startDate),
                endDate: new Date(trip.endDate),
              }}
              onUpdateTrip={handleEditTrip}
            />
            <button
              onClick={() => setOpenEditModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-50 bg-white rounded-full p-1 shadow-lg transition-colors"
              aria-label="Close modal"
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
        isLoading={isDeleting}
        title="Delete Trip"
        message="Are you sure you want to delete this trip? This action cannot be undone and will permanently remove all associated activities and itineraries."
        itemName={trip.tripName}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Delete Trip"
        cancelText="Keep Trip"
      />
    </>
  );
}