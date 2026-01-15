"use client"

import React, { useState } from 'react'
import { IItineraryDayResponse } from '@/types/itineraryDay'
import { Calendar, MapPin, Clock, AlertTriangle } from 'lucide-react'
import { format } from 'date-fns'
import SwipeableItem from '../SwipeableItem'
import { useDrag } from '@/context/DragContext'
import  { moveActivityToDay }  from '@/services/activityPoolService'
import { toast } from 'sonner'

interface ItineraryDayCardProps {
  day: IItineraryDayResponse
  index: number
  onClick?: (day: IItineraryDayResponse) => void
  onEdit?: () => void
  onDelete?: () => void
  exceedsTripDuration?: boolean
  tripDurationDays?: number
  onEditTrip?: () => void
  onActivityAdded?: () => void
  tripId: string
}

export const ItineraryDayCard: React.FC<ItineraryDayCardProps> = ({
  day,
  index,
  onClick,
  onEdit,
  onDelete,
  exceedsTripDuration = false,
  tripDurationDays = 0,
  onEditTrip,
  onActivityAdded,
  tripId
}) => {
  const formattedDate = format(new Date(day.date), 'EEEE, MMMM d, yyyy')
  const hasActivities = day.activitiesId && day.activitiesId.length > 0
  
  const { draggedActivity, dragSource, setDragOverDayId, clearDragState } = useDrag()
  const [isDragOver, setIsDragOver] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  // Handle drag over to show drop zone
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Only allow drops from pool
    const source = e.dataTransfer.types.includes('activityid') ? 'pool' : null
    if (source === 'pool' || dragSource === 'pool') {
      e.dataTransfer.dropEffect = 'move'
      setIsDragOver(true)
      if (day._id) {
        setDragOverDayId(day._id.toString())
      }
    }
  }

  // Handle drag leave
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    setDragOverDayId(null)
  }

  // Handle drop
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    setDragOverDayId(null)

    // Validate it's from pool
    if (dragSource !== 'pool' || !draggedActivity) {
      toast.error('Invalid drop source')
      clearDragState()
      return
    }

    try {
      setIsAdding(true)
      
      if (!day._id) {
        toast.error('Invalid day ID')
        return
      }

      const success = await moveActivityToDay(
        draggedActivity._id.toString(),
        tripId,
        day._id.toString()
      )

      if (success) {
        toast.success(`Added "${draggedActivity.title}" to Day ${day.dayNumber}`)
        onActivityAdded?.()
      } else {
        toast.error('Failed to add activity to day')
      }
    } catch (error) {
      console.error('Error adding activity to day:', error)
      toast.error('Failed to add activity to day')
    } finally {
      setIsAdding(false)
      clearDragState()
    }
  }

  return (
    <div className="relative">
      {/* Timeline connector */}
      {index > 0 && (
        <div className="absolute left-6 -top-6 w-0.5 h-6 bg-[#E5E7EB] z-0" />
      )}

      <SwipeableItem onEdit={onEdit} onDelete={onDelete}>
        <div 
          className={`
            flex gap-4 cursor-pointer
            ${isDragOver ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
          `}
          onClick={() => onClick?.(day)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Day number badge */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#0EA5A4] flex items-center justify-center text-white font-semibold text-lg shadow-md">
              {day.dayNumber}
            </div>
          </div>

          {/* Card content */}
          <div className={`
            flex-1 bg-white rounded-xl border p-6 transition-all duration-200
            ${isDragOver 
              ? 'border-blue-500 border-2 border-dashed shadow-xl bg-blue-50' 
              : 'border-[#E5E7EB] hover:shadow-lg'
            }
            ${isAdding ? 'opacity-50 pointer-events-none' : ''}
          `}>
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
              <div className={`
                flex items-center gap-3 p-4 rounded-lg border transition-colors
                ${isDragOver 
                  ? 'bg-blue-100 border-blue-400' 
                  : 'bg-[#FEF3C7] border-[#FCD34D]'
                }
              `}>
                <Clock className="w-5 h-5 text-[#F59E0B]" />
                <p className="text-sm text-[#92400E]">
                  {isDragOver 
                    ? 'Drop activity here to add to this day' 
                    : 'No activities planned yet. Add activities to complete your itinerary.'
                  }
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
