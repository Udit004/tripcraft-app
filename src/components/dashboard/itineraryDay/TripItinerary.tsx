"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IItineraryDayResponse } from '@/types/itineraryDay'
import { getItineraryDays, updateItineraryDay, deleteItineraryDay, getTripById, updateTrip } from '@/services'
import { Calendar, MapPin, Clock, AlertCircle, AlertTriangle } from 'lucide-react'
import { ITripResponse } from '@/types/trip'
import { format } from 'date-fns'
import CreateItinerayDayModal from './CreateItinerayDayModal'
import EditItineraryDayModal from './EditItineraryDayModal'
import SwipeableItem from '../SwipeableItem'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog'
import { toast } from '@/lib/toast'
import { toast as sonnerToast } from 'sonner'
import UndoToast from '@/components/UndoToast'
import EditTripModal from '../trip/EditTripModal'
import { calculateTripDuration, exceedsTripDuration as checkExceedsTripDuration } from '@/utility/tripUtils'

// Separate presentational component for better maintainability
const ItineraryDayCard = ({
  day,
  index,
  onClick,
  onEdit,
  onDelete,
  exceedsTripDuration = false,
  tripDurationDays = 0,
  onEditTrip
}: {
  day: IItineraryDayResponse;
  index: number;
  onClick?: (day: IItineraryDayResponse) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  exceedsTripDuration?: boolean;
  tripDurationDays?: number;
  onEditTrip?: () => void;
}) => {
  const formattedDate = format(new Date(day.date), 'EEEE, MMMM d, yyyy')
  const hasActivities = day.activitiesId && day.activitiesId.length > 0

  return (
    <div className="relative">
      {/* Timeline connector */}
      {index > 0 && (
        <div className="absolute left-6 -top-6 w-0.5 h-6 bg-[#E5E7EB] z-0" />
      )}

      <SwipeableItem onEdit={onEdit} onDelete={onDelete}>
        <div className="flex gap-4 cursor-pointer" onClick={() => onClick?.(day)}>
          {/* Day number badge */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#0EA5A4] flex items-center justify-center text-white font-semibold text-lg shadow-md">
              {day.dayNumber}
            </div>
          </div>

          {/* Card content */}
          <div className="flex-1 bg-white rounded-xl border border-[#E5E7EB] p-6 hover:shadow-lg transition-shadow duration-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-[#0F172A]">
                    Day {day.dayNumber}
                  </h3>
                  {day.dayName && (
                    <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                      {day.dayName}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[#475569] text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{formattedDate}</span>
                </div>
              </div>

              {/* Activity count badge */}
              <div className="px-3 py-1 rounded-full bg-[#F8FAFC] border border-[#E5E7EB] text-sm text-[#475569]">
                {day.activitiesId.length} {day.activitiesId.length === 1 ? 'Activity' : 'Activities'}
              </div>
            </div>

            {/* Activities section */}
            {hasActivities ? (
              <div className="space-y-3">
                {/* Placeholder for activities - will be populated when activities are loaded */}
                <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg">
                  <MapPin className="w-4 h-4 text-[#0EA5A4]" />
                  <span className="text-sm text-[#0F172A]">Activities will appear here</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-[#FEF3C7] border border-[#FCD34D] rounded-lg">
                <Clock className="w-5 h-5 text-[#F59E0B]" />
                <p className="text-sm text-[#92400E]">
                  No activities planned yet. Add activities to complete your itinerary.
                </p>
              </div>
            )}

            {/* Trip Duration Warning */}
            {exceedsTripDuration && (
              <div className="mt-4 rounded-md border border-yellow-400 bg-yellow-50 px-3 py-2 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-700 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-xs text-yellow-800">
                  <p className="font-semibold">Exceeds trip duration</p>
                  <p className="mt-1">This day exceeds the {tripDurationDays}-day trip duration.</p>
                  {onEditTrip && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEditTrip()
                      }}
                      className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 hover:bg-yellow-200 rounded text-yellow-900 font-semibold transition-colors text-xs"
                    >
                      Edit Trip Dates →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </SwipeableItem>
    </div>
  )
}

// Loading skeleton component
const ItineraryDaySkeleton = () => (
  <div className="flex gap-4 animate-pulse">
    <div className="w-12 h-12 rounded-full bg-[#E5E7EB]" />
    <div className="flex-1 bg-white rounded-xl border border-[#E5E7EB] p-6">
      <div className="h-6 bg-[#E5E7EB] rounded w-1/4 mb-4" />
      <div className="h-4 bg-[#E5E7EB] rounded w-1/3 mb-4" />
      <div className="h-16 bg-[#F8FAFC] rounded" />
    </div>
  </div>
)

// Error state component
const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="bg-white rounded-xl border border-[#FCA5A5] p-8 text-center">
    <div className="flex justify-center mb-4">
      <div className="w-16 h-16 rounded-full bg-[#FEE2E2] flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-[#DC2626]" />
      </div>
    </div>
    <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Unable to Load Itinerary</h3>
    <p className="text-[#475569] mb-4">{message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1e3a8ae6] transition-colors"
    >
      Try Again
    </button>
  </div>
)

// Empty state component
const EmptyState = ({ onAddDay }: { onAddDay?: () => void }) => (
  <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
    <div className="flex justify-center mb-4">
      <div className="w-20 h-20 rounded-full bg-[#F8FAFC] flex items-center justify-center">
        <Calendar className="w-10 h-10 text-[#0EA5A4]" />
      </div>
    </div>
    <h3 className="text-xl font-semibold text-[#0F172A] mb-2">No Itinerary Yet</h3>
    <p className="text-[#475569] max-w-md mx-auto mb-6">
      Your trip itinerary is empty. Start planning your adventure by adding days and activities.
    </p>
    <button
      onClick={onAddDay}
      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-teal-500 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
    >
      <Calendar className="w-5 h-5" />
      Add First Day
    </button>
  </div>
)

// Main component
export default function TripItinerary({ tripSlug, onDayClick }: { tripSlug: string, onDayClick?: (day: IItineraryDayResponse) => void }) {
  const router = useRouter()
  const [itineraryData, setItineraryData] = useState<IItineraryDayResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openModal, setOpenModal] = useState(false)
  const [editingDay, setEditingDay] = useState<IItineraryDayResponse | null>(null)
  const [deletingDay, setDeletingDay] = useState<IItineraryDayResponse | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [trip, setTrip] = useState<ITripResponse | null>(null)
  const [tripDurationDays, setTripDurationDays] = useState<number>(0)
  const [editingTrip, setEditingTrip] = useState(false)

  // Calculate how many days exceed trip duration
  const daysExceedingDuration = itineraryData.filter(day => 
    checkExceedsTripDuration(day.dayNumber, tripDurationDays)
  ).length

  const fetchItineraryDays = async () => {
    try {
      setLoading(true)
      setError(null)
      const days = await getItineraryDays(tripSlug)
      console.log('Fetched itinerary days:', days)
      setItineraryData(days)

      // Fetch trip data to calculate duration
      const tripData = await getTripById(tripSlug)
      if (tripData) {
        setTrip(tripData)
        const duration = calculateTripDuration(tripData.startDate, tripData.endDate)
        setTripDurationDays(duration)
      }
    } catch (err) {
      console.error('Error fetching itinerary days:', err)
      const errorMsg = err instanceof Error ? err.message : 'Failed to load itinerary days';
      setError(errorMsg)
      toast.error(errorMsg);
      setItineraryData([])
    } finally {
      setLoading(false)
    }
  }

  const handleDayClick = (day: IItineraryDayResponse) => {
    if (onDayClick) {
      onDayClick(day)
    } else {
      // Default redirect to day details page
      router.push(`/dashboard/${tripSlug}/itinerary/${day._id}`)
    }
  }

  const handleEditDay = (day: IItineraryDayResponse) => {
    setEditingDay(day)
  }

  const handleDeleteDay = (day: IItineraryDayResponse) => {
    setDeletingDay(day)
  }

  const handleConfirmDelete = async () => {
    if (!deletingDay) return

    try {
      setIsDeleting(true)
      const result = await deleteItineraryDay(tripSlug, deletingDay._id)
      
      if (result.success) {
        setDeletingDay(null)
        setShowDeleteConfirm(false)
        
        // Show undo toast with countdown
        if (result.deletionLogId) {
          const dayNumber = deletingDay.dayNumber;
          const dayDate = format(new Date(deletingDay.date), 'MMM d, yyyy');
          
          sonnerToast.custom(
            (t) => (
              <UndoToast
                message={`Day ${dayNumber} (${dayDate}) deleted`}
                deletionLogId={result.deletionLogId!}
                onUndo={() => {
                  sonnerToast.dismiss(t);
                  fetchItineraryDays();
                }}
                onExpire={() => {
                  sonnerToast.dismiss(t);
                }}
                undoWindowSeconds={result.undoWindowSeconds || 10}
              />
            ),
            { duration: (result.undoWindowSeconds || 10) * 1000 }
          );
        } else {
          toast.delete('Itinerary day deleted successfully!');
        }
        
        // Refresh the itinerary list
        await fetchItineraryDays()
      } else {
        toast.error('Failed to delete itinerary day. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting itinerary day:', err)
      toast.error('Failed to delete itinerary day. Please try again.');
    } finally {
      setIsDeleting(false)
    }
  }

  useEffect(() => {
    if (tripSlug) {
      fetchItineraryDays()
    }
  }, [tripSlug])

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
        <button
          onClick={() => setOpenModal(true)}
          className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-teal-500 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
        >
          + Add Day
        </button>
      </div>

      {/* Trip Duration Warning Summary */}
      {!loading && daysExceedingDuration > 0 && (
        <div className="mb-6 rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-800">
                ⚠ Trip Duration Issue
              </p>
              <p className="mt-2 text-sm text-red-700">
                {daysExceedingDuration} {daysExceedingDuration === 1 ? 'day' : 'days'} in your itinerary exceed the {tripDurationDays}-day trip duration.
              </p>
              <p className="mt-2 text-xs text-red-700">
                Your trip is currently set from <strong>{trip ? format(new Date(trip.startDate), 'MMM d, yyyy') : ''}</strong> to <strong>{trip ? format(new Date(trip.endDate), 'MMM d, yyyy') : ''}</strong>.
              </p>
              {trip && (
                <button
                  onClick={() => setEditingTrip(true)}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-900 font-semibold transition-colors text-sm cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  Update Trip Dates Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <ItineraryDaySkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchItineraryDays} />
      ) : itineraryData.length === 0 ? (
        <EmptyState onAddDay={() => setOpenModal(true)} />
      ) : (
        <div className="space-y-6">
          {itineraryData.map((day, index) => {
            const exceedsDuration = checkExceedsTripDuration(day.dayNumber, tripDurationDays)
            return (
              <ItineraryDayCard
                key={day._id}
                day={day}
                index={index}
                onClick={handleDayClick}
                onEdit={() => handleEditDay(day)}
                onDelete={() => handleDeleteDay(day)}
                exceedsTripDuration={exceedsDuration}
                tripDurationDays={tripDurationDays}
                onEditTrip={() => setEditingTrip(true)}
              />
            )
          })}
        </div>
      )}

      {/* Create Itinerary Day Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center pt-20 overflow-y-auto">
          <div className="relative max-w-xl w-full mx-4 my-8">
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
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-50 bg-white rounded-full p-1"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center pt-20 overflow-y-auto">
          <div className="relative max-w-xl w-full mx-4 my-8">
            <EditItineraryDayModal
              dayId={editingDay._id}
              tripId={tripSlug}
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
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-50 bg-white rounded-full p-1"
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
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingDay(null)}
        confirmText="Delete Day"
        cancelText="Keep It"
      />

      {/* Edit Trip Modal */}
      {editingTrip && trip && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center pt-20 overflow-y-auto">
          <div className="relative max-w-xl w-full mx-4 my-8">
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