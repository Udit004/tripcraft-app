"use client"
import ProtectRoutes from '@/components/ProtectRoutes';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTrips, updateTrip, deleteTrip } from '@/services/tripService';
import { ITripResponse, ICreateTripRequest } from '@/types/trip';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle, Loader2 } from 'lucide-react';
import CreateTripModal from '@/components/dashboard/trip/CreateTripModal';
import EditTripModal from '@/components/dashboard/trip/EditTripModal';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import TripCard from '@/components/dashboard/trip/TripCard';
import EmptyState from '@/components/dashboard/trip/EmptyState';
import { colors } from '@/constants/colors';
import mongoose from 'mongoose';

export default function Dashboard() {
  const router = useRouter();
  const [trips, setTrips] = useState<ITripResponse[]>([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<ITripResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingTrip, setDeletingTrip] = useState<ITripResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTrips = await getTrips();
      setTrips(fetchedTrips || []);
    } catch (error) {
      console.error('Error fetching trips:', error);
      setError('Failed to load trips. Please try again.');
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleTripView = (tripId: mongoose.Types.ObjectId) => {
    if (tripId) {
      router.push(`/dashboard/${tripId}`);
    }
  };

  const handleEditTrip = (trip: ITripResponse) => {
    setSelectedTrip(trip);
    setOpenEditModal(true);
  };

  const handleUpdateTrip = async (tripId: string, tripData: ICreateTripRequest) => {
    const result = await updateTrip(tripId, tripData);
    setOpenEditModal(false);
    await fetchTrips();
    return result;
  };

  const handleDeleteTrip = (trip: ITripResponse) => {
    setDeletingTrip(trip);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingTrip) return;

    try {
      setIsDeleting(true);
      const success = await deleteTrip(deletingTrip._id!);
      if (success) {
        setTrips(prevTrips => prevTrips.filter(trip => trip._id !== deletingTrip._id));
        setShowDeleteConfirm(false);
        setDeletingTrip(null);
      } else {
        setError('Failed to delete trip. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting trip:', error);
      setError('Failed to delete trip. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ProtectRoutes>
      <div 
        className="min-h-screen py-8 px-4"
        style={{ backgroundColor: colors.background }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <header className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 
                  className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                  }}
                >
                  My Trips
                </h1>
                <p style={{ color: colors.textMuted }} className="text-lg">
                  Plan, organize, and track all your adventures in one place
                </p>
              </div>
              
              <Button 
                onClick={() => setOpenCreateModal(true)}
                size="lg"
                className="gap-2 px-6 py-6 shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap cursor-pointer"
                style={{ 
                  backgroundColor: colors.primary,
                  color: colors.surface
                }}
              >
                <Plus size={20} />
                New Trip
              </Button>
            </div>

            {/* Stats Bar */}
            {!loading && trips.length > 0 && (
              <div 
                className="mt-8 p-6 rounded-xl"
                style={{ backgroundColor: colors.surface }}
              >
                <div className="flex flex-wrap gap-8">
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.textMuted }}>
                      Total Trips
                    </p>
                    <p className="text-3xl font-bold" style={{ color: colors.primary }}>
                      {trips.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.textMuted }}>
                      Destinations
                    </p>
                    <p className="text-3xl font-bold" style={{ color: colors.secondary }}>
                      {new Set(trips.map(t => t.destination)).size}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </header>

          {/* Error Alert */}
          {error && (
            <div 
              className="mb-6 p-4 rounded-lg flex items-start gap-3"
              style={{ 
                backgroundColor: '#FEE2E2',
                borderLeft: `4px solid #DC2626`
              }}
            >
              <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-800">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Content Area */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 
                size={48} 
                className="animate-spin mb-4" 
                style={{ color: colors.primary }}
              />
              <p style={{ color: colors.textMuted }}>Loading your trips...</p>
            </div>
          ) : trips.length === 0 ? (
            <EmptyState onCreateTrip={() => setOpenCreateModal(true)} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <TripCard
                  key={trip._id}
                  trip={trip}
                  onEdit={handleEditTrip}
                  onDelete={handleDeleteTrip}
                  onView={handleTripView}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modals */}
        {openCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative max-w-xl w-full mt-60">
              <CreateTripModal />
              <button
                onClick={() => setOpenCreateModal(false)}
                className="absolute top-8 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-50 cursor-pointer"
                style={{ backgroundColor: colors.surface }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {openEditModal && selectedTrip && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-25 flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative max-w-xl w-full mt-60">
              <EditTripModal
                tripId={selectedTrip._id!}
                initialTripData={{
                  tripName: selectedTrip.tripName,
                  tripDescription: selectedTrip.tripDescription,
                  destination: selectedTrip.destination,
                  startDate: new Date(selectedTrip.startDate),
                  endDate: new Date(selectedTrip.endDate),
                }}
                onUpdateTrip={handleUpdateTrip}
              />
              <button
                onClick={() => setOpenEditModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-50 cursor-pointer"
                style={{ backgroundColor: colors.surface }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <DeleteConfirmDialog
          isOpen={showDeleteConfirm}
          isLoading={isDeleting}
          title="Delete Trip"
          message="Are you sure you want to delete this trip? This action cannot be undone."
          itemName={deletingTrip?.tripName}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setDeletingTrip(null);
          }}
          confirmText="Delete Trip"
          cancelText="Cancel"
        />
      </div>
    </ProtectRoutes>
  );
}