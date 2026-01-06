"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IItineraryDayResponse } from '@/types/itineraryDay'
import { getItineraryDays } from '@/services'
import { Calendar, MapPin, Clock, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'

// Separate presentational component for better maintainability
const ItineraryDayCard = ({ day, index, onClick }: { day: IItineraryDayResponse; index: number; onClick?: (day: IItineraryDayResponse) => void }) => {
  const formattedDate = format(new Date(day.date), 'EEEE, MMMM d, yyyy')
  const hasActivities = day.activitiesId && day.activitiesId.length > 0

  return (
    <div className="relative cursor-pointer" onClick={() => onClick?.(day)}>
      {/* Timeline connector */}
      {index > 0 && (
        <div className="absolute left-6 -top-6 w-0.5 h-6 bg-[#E5E7EB]" />
      )}
      
      <div className="flex gap-4">
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
              <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                Day {day.dayNumber}
              </h3>
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
        </div>
      </div>
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
const EmptyState = () => (
  <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
    <div className="flex justify-center mb-4">
      <div className="w-20 h-20 rounded-full bg-[#F8FAFC] flex items-center justify-center">
        <Calendar className="w-10 h-10 text-[#0EA5A4]" />
      </div>
    </div>
    <h3 className="text-xl font-semibold text-[#0F172A] mb-2">No Itinerary Yet</h3>
    <p className="text-[#475569] max-w-md mx-auto">
      Your trip itinerary is empty. Start planning your adventure by adding days and activities.
    </p>
  </div>
)

// Main component
export default function TripItinerary({ tripSlug, onDayClick }: { tripSlug: string, onDayClick?: (day: IItineraryDayResponse) => void }) {
  const router = useRouter()
  const [itineraryData, setItineraryData] = useState<IItineraryDayResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItineraryDays = async () => {
    try {
      setLoading(true)
      setError(null)
      const days = await getItineraryDays(tripSlug)
      console.log('Fetched itinerary days:', days)
      setItineraryData(days)
    } catch (err) {
      console.error('Error fetching itinerary days:', err)
      setError(err instanceof Error ? err.message : 'Failed to load itinerary days')
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

  useEffect(() => {
    if (tripSlug) {
      fetchItineraryDays()
    }
  }, [tripSlug])

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Section header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#0F172A] mb-2">Trip Itinerary</h2>
        <p className="text-[#475569]">
          Your day-by-day travel plan
        </p>
      </div>

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
        <EmptyState />
      ) : (
        <div className="space-y-6">
          {itineraryData.map((day, index) => (
            <ItineraryDayCard key={day._id} day={day} index={index} onClick={handleDayClick} />
          ))}
        </div>
      )}
    </div>
  )
}