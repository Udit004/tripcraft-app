"use client"

import React from 'react'
import { IItineraryDayResponse } from '@/types/itineraryDay'
import { Calendar, MapPin, Clock, AlertTriangle } from 'lucide-react'
import { format } from 'date-fns'
import SwipeableItem from '../SwipeableItem'

interface ItineraryDayCardProps {
  day: IItineraryDayResponse
  index: number
  onClick?: (day: IItineraryDayResponse) => void
  onEdit?: () => void
  onDelete?: () => void
  exceedsTripDuration?: boolean
  tripDurationDays?: number
  onEditTrip?: () => void
}

export const ItineraryDayCard: React.FC<ItineraryDayCardProps> = ({
  day,
  index,
  onClick,
  onEdit,
  onDelete,
  exceedsTripDuration = false,
  tripDurationDays = 0,
  onEditTrip
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
