"use client"
import ProtectRoutes from '@/components/ProtectRoutes';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getTrips, updateTrip, deleteTrip } from '@/services/tripService';
import { ITripResponse, ICreateTripRequest } from '@/types/trip';
import CreateTripModal from '@/components/dashboard/trip/CreateTripModal';
import EditTripModal from '@/components/dashboard/trip/EditTripModal';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import DashboardHeader from '@/components/dashboard/trip/DashboardHeader';
import DashboardStats from '@/components/dashboard/trip/DashboardStats';
import TripGrid from '@/components/dashboard/trip/TripGrid';
import EmptyState from '@/components/dashboard/trip/EmptyState';
import ErrorAlert from '@/components/dashboard/trip/ErrorAlert';
import LoadingState from '@/components/dashboard/trip/LoadingState';
import ModalWrapper from '@/components/dashboard/trip/ModalWrapper';
import { colors } from '@/constants/colors';
import mongoose from 'mongoose';
import { toast } from '@/lib/toast';
import { toast as sonnerToast } from 'sonner';
import UndoToast from '@/components/UndoToast';
import Image from 'next/image';

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
  const [showPastTrips, setShowPastTrips] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTrips = await getTrips();
      setTrips(fetchedTrips || []);
    } catch (error) {
      console.error('Error fetching trips:', error);
      const errorMsg = 'Failed to load trips. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const handleTripView = useCallback((tripId: mongoose.Types.ObjectId) => {
    if (tripId) {
      router.push(`/dashboard/${tripId}`);
    }
  }, [router]);

  const handleEditTrip = useCallback((trip: ITripResponse) => {
    setSelectedTrip(trip);
    setOpenEditModal(true);
  }, []);

  const handleUpdateTrip = useCallback(async (tripId: string, tripData: ICreateTripRequest) => {
    try {
      const result = await updateTrip(tripId, tripData);
      setOpenEditModal(false);
      toast.success('Trip updated successfully!');
      await fetchTrips();
      return result;
    } catch (error) {
      console.error('Error updating trip:', error);
      toast.error('Failed to update trip. Please try again.');
      throw error;
    }
  }, [fetchTrips]);

  const handleDeleteTrip = useCallback((trip: ITripResponse) => {
    setDeletingTrip(trip);
    setShowDeleteConfirm(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingTrip) return;

    try {
      setIsDeleting(true);
      const result = await deleteTrip(deletingTrip._id?.toString()!);

      if (result && result.success) {
        setTrips(prevTrips => prevTrips.filter(trip => trip._id !== deletingTrip._id));

        sonnerToast.custom(
          (id) => (
            <UndoToast
              message={`"${deletingTrip.tripName}" deleted`}
              deletionLogId={result.deletionLogId}
              undoWindowSeconds={result.undoWindowSeconds}
              onUndo={() => {
                sonnerToast.dismiss(id);
                fetchTrips();
              }}
              onExpire={() => {
                sonnerToast.dismiss(id);
              }}
            />
          )
        );

        setShowDeleteConfirm(false);
        setDeletingTrip(null);
      } else {
        const errorMsg = 'Failed to delete trip. Please try again.';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error: unknown) {
      console.error('Error deleting trip:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete trip. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  }, [deletingTrip, fetchTrips]);

  const handleCloseCreateModal = useCallback(() => setOpenCreateModal(false), []);
  const handleCloseEditModal = useCallback(() => setOpenEditModal(false), []);
  const handleOpenCreateModal = useCallback(() => setOpenCreateModal(true), []);
  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
    setDeletingTrip(null);
  }, []);

  // Filter trips based on showPastTrips state and search query
  const filteredTrips = React.useMemo(() => {
    let filtered = trips;
    
    // Filter by date
    if (!showPastTrips) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter(trip => {
        const endDate = new Date(trip.endDate);
        endDate.setHours(0, 0, 0, 0);
        return endDate >= today;
      });
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(trip => 
        trip.tripName.toLowerCase().includes(query) ||
        trip.destination.toLowerCase().includes(query) ||
        trip.tripDescription?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [trips, showPastTrips, searchQuery]);

  const pastTripsCount = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return trips.filter(trip => {
      const endDate = new Date(trip.endDate);
      endDate.setHours(0, 0, 0, 0);
      return endDate < today;
    }).length;
  }, [trips]);

  return (
    <ProtectRoutes>
      <div className="min-h-screen py-4 sm:py-8 px-3 sm:px-4" style={{ backgroundColor: colors.background }}>
        <div className="max-w-7xl mx-auto">
          {/* ================= HERO SECTION ================= */}
          <section className="relative mb-8 sm:mb-12 overflow-hidden rounded-xl sm:rounded-2xl shadow-lg">

            {/* Background Image */}
            <Image
              src="/images/dashboard/heroImage.png"
              alt="Travel dashboard background"
              fill
              priority
              className="object-cover object-center"
            />

            {/* Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  linear-gradient(
                    135deg,
                    rgba(30, 58, 138, 0.88),
                    rgba(14, 165, 164, 0.88)
                  )
                `,
              }}
            />

            {/* Content */}
            <div className="relative z-10 px-4 sm:px-6 py-8 sm:py-10 md:py-14">

              {/* Header */}
              <DashboardHeader onCreateTrip={handleOpenCreateModal} />

              {/* Stats */}
              {!loading && trips.length > 0 && (
                <DashboardStats trips={trips} />
              )}

            </div>
          </section>

          {/* Error */}
          {error && <ErrorAlert message={error} />}

          {/* Search and Filter Section */}
          {!loading && trips.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Search Bar - Left */}
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search trips by name, destination, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                      aria-label="Clear search"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Filter Toggle - Right */}
                <div className="flex items-center justify-between lg:justify-end gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowPastTrips(false)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                        !showPastTrips
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Active Trips ({trips.length - pastTripsCount})
                    </button>
                    <button
                      onClick={() => setShowPastTrips(true)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                        showPastTrips
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      All Trips ({trips.length})
                    </button>
                  </div>
                  {!showPastTrips && pastTripsCount > 0 && (
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {pastTripsCount} past trip{pastTripsCount !== 1 ? 's' : ''} hidden
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          {loading ? (
            <LoadingState />
          ) : trips.length === 0 ? (
            <EmptyState onCreateTrip={handleOpenCreateModal} />
          ) : filteredTrips.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 mb-4">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-500 text-base sm:text-lg mb-4">
                {searchQuery.trim() 
                  ? `No trips found matching "${searchQuery}"` 
                  : 'No active trips found'}
              </p>
              {searchQuery.trim() ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors text-sm sm:text-base cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear search
                </button>
              ) : (
                <button
                  onClick={() => setShowPastTrips(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors text-sm sm:text-base cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View all trips
                </button>
              )}
            </div>
          ) : (
            <TripGrid
              trips={filteredTrips}
              onEdit={handleEditTrip}
              onDelete={handleDeleteTrip}
              onView={handleTripView}
            />
          )}
        </div>

        {/* Create Modal */}
        {openCreateModal && (
          <ModalWrapper onClose={handleCloseCreateModal}>
            <CreateTripModal />
          </ModalWrapper>
        )}

        {/* Edit Modal */}
        {openEditModal && selectedTrip && (
          <ModalWrapper onClose={handleCloseEditModal}>
            <EditTripModal
              tripId={selectedTrip._id?.toString()!}
              initialTripData={{
                tripName: selectedTrip.tripName,
                tripDescription: selectedTrip.tripDescription,
                destination: selectedTrip.destination,
                startDate: new Date(selectedTrip.startDate),
                endDate: new Date(selectedTrip.endDate),
              }}
              onUpdateTrip={handleUpdateTrip}
            />
          </ModalWrapper>
        )}

        {/* Delete Dialog */}
        <DeleteConfirmDialog
          isOpen={showDeleteConfirm}
          isLoading={isDeleting}
          title="Delete Trip"
          message="Are you sure you want to delete this trip? You will have 10 seconds to undo this action."
          itemName={deletingTrip?.tripName}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          confirmText="Delete Trip"
          cancelText="Cancel"
        />
      </div>
    </ProtectRoutes>
  );
}