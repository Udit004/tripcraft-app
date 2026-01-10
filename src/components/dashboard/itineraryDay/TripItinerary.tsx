"use client"

import React, { useEffect } from 'react'
import { IItineraryDayResponse } from '@/types/itineraryDay'
import { updateItineraryDay, updateTrip } from '@/services'
import { Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { toast as sonnerToast } from 'sonner'
import CreateItinerayDayModal from './CreateItinerayDayModal'
import EditItineraryDayModal from './EditItineraryDayModal'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog'
import EditTripModal from '../trip/EditTripModal'
import UndoToast from '@/components/UndoToast'
import { GradientButton } from '@/components/ui/GradientButton'
import {
  useItinerary,
  useItineraryDelete,
  useItineraryModals,
  useItineraryNavigation
} from './hooks'
import { ItineraryDayCard } from './ItineraryDayCard'
import { ItineraryDaySkeleton } from './ItineraryDaySkeleton'
import { ItineraryErrorState } from './ItineraryErrorState'
import { ItineraryEmptyState } from './ItineraryEmptyState'
import { ItineraryDayList } from './ItineraryDayList'
import { TripDurationWarning } from './TripDurationWarning'
import { exceedsTripDuration as checkExceedsTripDuration } from '@/utility/tripUtils'

// Main component
export default function TripItinerary({ tripSlug, onDayClick }: { tripSlug: string, onDayClick?: (day: IItineraryDayResponse) => void }) {
  // Custom hooks
  const { itineraryData, trip, loading, error, tripDurationDays, daysExceedingDuration, fetchItineraryDays } = useItinerary(tripSlug)
  const { openModal, editingDay, editingTrip, setOpenModal, setEditingDay, setEditingTrip } = useItineraryModals()
  const { deletingDay, isDeleting, setDeletingDay, handleConfirmDelete } = useItineraryDelete(tripSlug)
  const { handleDayClick } = useItineraryNavigation(tripSlug, onDayClick)

  // Handle undo toast display
  const handleShowUndoToast = (data: { deletionLogId: string; dayNumber: number; dayDate: string; undoWindowSeconds: number }) => {
    const formattedDate = format(new Date(data.dayDate), 'MMM d, yyyy')

    sonnerToast.custom(
      (t) => (
        <UndoToast
          message={`Day ${data.dayNumber} (${formattedDate}) deleted`}
          deletionLogId={data.deletionLogId}
          onUndo={() => {
            sonnerToast.dismiss(t)
            fetchItineraryDays()
          }}
          onExpire={() => {
            sonnerToast.dismiss(t)
          }}
          undoWindowSeconds={data.undoWindowSeconds}
        />
      ),
      { duration: data.undoWindowSeconds * 1000 }
    )
  }

  const checkExceedsDuration = (dayNumber: number) => checkExceedsTripDuration(dayNumber, tripDurationDays)

  const handleEditDay = (day: IItineraryDayResponse) => {
    setEditingDay(day)
  }

  const handleDeleteDay = (day: IItineraryDayResponse) => {
    setDeletingDay(day)
  }

  const handleblackDrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setOpenModal(false)
      setEditingDay(null)
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Section header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-[#0F172A] mb-2">Trip Itinerary</h2>
          <p className="text-[#475569]">
            Your day-by-day travel plan
          </p>
        </div>
        <GradientButton
          variant="primary"
          size="md"
          onClick={() => setOpenModal(true)}
        >
          + Add Day
        </GradientButton>
      </div>

      {/* Trip Duration Warning Summary */}
      {!loading && daysExceedingDuration > 0 && (
        <TripDurationWarning
          daysExceedingDuration={daysExceedingDuration}
          tripDurationDays={tripDurationDays}
          trip={trip}
          onEditTrip={() => setEditingTrip(true)}
        />
      )}

      {/* Content */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <ItineraryDaySkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ItineraryErrorState message={error} onRetry={fetchItineraryDays} />
      ) : itineraryData.length === 0 ? (
        <ItineraryEmptyState onAddDay={() => setOpenModal(true)} />
      ) : (
        <ItineraryDayList
          days={itineraryData}
          tripDurationDays={tripDurationDays}
          onDayClick={handleDayClick}
          onEditDay={handleEditDay}
          onDeleteDay={handleDeleteDay}
          onEditTrip={() => setEditingTrip(true)}
          checkExceedsDuration={checkExceedsDuration}
        />
      )}

      {/* Create Itinerary Day Modal */}
      {openModal && (
        <div 
        onClick={(e) => handleblackDrop(e)}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center pt-20 overflow-y-auto">
          <div className="relative max-w-xl w-full mx-4 mt-40">
            <CreateItinerayDayModal
              tripId={tripSlug}
              onClose={() => setOpenModal(false)}
              onSuccess={() => {
                setOpenModal(false)
                fetchItineraryDays()
              }}
              onEditTrip={() => {
                setOpenModal(false)
                setEditingTrip(true)
              }}
            />
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-50 bg-white rounded-full p-1 cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Edit Itinerary Day Modal */}
      {editingDay && (
        <div
          onClick={(e) => handleblackDrop(e)}
         className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center pt-20 overflow-y-auto">
          <div className="relative max-w-xl w-full mx-4 mt-4">
            <EditItineraryDayModal
              dayId={editingDay._id?.toString()!}
              tripId={tripSlug.toString()}
              initialDayData={editingDay}
              onUpdateDay={updateItineraryDay}
              onClose={() => setEditingDay(null)}
              onSuccess={() => {
                setEditingDay(null)
                fetchItineraryDays()
              }}
            />
            <button
              onClick={() => setEditingDay(null)}
              className="absolute top-8 right-4 text-gray-500 hover:text-gray-700 z-50 bg-white rounded-full p-1 cursor-pointer"
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
        isOpen={deletingDay !== null}
        isLoading={isDeleting}
        title="Delete Itinerary Day"
        message={`Are you sure you want to delete Day ${deletingDay?.dayNumber}?`}
        itemName={deletingDay ? format(new Date(deletingDay.date), 'EEEE, MMMM d, yyyy') : ''}
        onConfirm={() => handleConfirmDelete(() => fetchItineraryDays(), handleShowUndoToast)}
        onCancel={() => setDeletingDay(null)}
        confirmText="Delete Day"
        cancelText="Keep It"
      />

      {/* Edit Trip Modal */}
      {editingTrip && trip && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center pt-20 overflow-y-auto">
          <div className="relative max-w-xl w-full mx-4 mt-60">
            <EditTripModal
              tripId={tripSlug}
              initialTripData={trip}
              onUpdateTrip={updateTrip}
              onClose={() => setEditingTrip(false)}
              onSuccess={() => {
                setEditingTrip(false)
                fetchItineraryDays()
              }}
            />
            <button
              onClick={() => setEditingTrip(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-50 bg-white rounded-full p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}