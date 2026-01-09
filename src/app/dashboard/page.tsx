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
      const result = await deleteTrip(deletingTrip._id!);

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

  return (
    <ProtectRoutes>
      <div className="min-h-screen py-8 px-4" style={{ backgroundColor: colors.background }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <DashboardHeader onCreateTrip={handleOpenCreateModal} />

          {/* Stats */}
          {!loading && trips.length > 0 && <DashboardStats trips={trips} />}

          {/* Error */}
          {error && <ErrorAlert message={error} />}

          {/* Content */}
          {loading ? (
            <LoadingState />
          ) : trips.length === 0 ? (
            <EmptyState onCreateTrip={handleOpenCreateModal} />
          ) : (
            <TripGrid
              trips={trips}
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