"use client"

import React from 'react'
import { AlertCircle, Calendar } from 'lucide-react'
import { ITripResponse } from '@/types/trip'
import { format } from 'date-fns'

interface TripDurationWarningProps {
  daysExceedingDuration: number
  tripDurationDays: number
  trip: ITripResponse | null
  onEditTrip: () => void
}

export const TripDurationWarning: React.FC<TripDurationWarningProps> = ({
  daysExceedingDuration,
  tripDurationDays,
  trip,
  onEditTrip
}) => (
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
            onClick={onEditTrip}
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-900 font-semibold transition-colors text-sm cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            Update Trip Dates Now
          </button>
        )}
      </div>
    </div>
  </div>
)
