"use client"

import React from 'react'
import { IItineraryDayResponse } from '@/types/itineraryDay'
import { ITripResponse } from '@/types/trip'
import { ItineraryDayCard } from './ItineraryDayCard'

interface ItineraryDayListProps {
  days: IItineraryDayResponse[]
  tripId: string
  tripDurationDays: number
  onDayClick?: (day: IItineraryDayResponse) => void
  onEditDay: (day: IItineraryDayResponse) => void
  onDeleteDay: (day: IItineraryDayResponse) => void
  onEditTrip: () => void
  checkExceedsDuration: (dayNumber: number) => boolean
  onActivityAdded?: () => void
}

export const ItineraryDayList: React.FC<ItineraryDayListProps> = ({
  days,
  tripId,
  tripDurationDays,
  onDayClick,
  onEditDay,
  onDeleteDay,
  onEditTrip,
  checkExceedsDuration,
  onActivityAdded
}) => (
  <div className="space-y-6">
    {days.map((day, index) => {
      const exceedsDuration = checkExceedsDuration(day.dayNumber)
      return (
        <ItineraryDayCard
          key={day._id?.toString()}
          day={day}
          index={index}
          onClick={onDayClick}
          onEdit={() => onEditDay(day)}
          onDelete={() => onDeleteDay(day)}
          exceedsTripDuration={exceedsDuration}
          tripDurationDays={tripDurationDays}
          onEditTrip={onEditTrip}
          tripId={tripId}
          onActivityAdded={onActivityAdded}
        />
      )
    })}
  </div>
)
