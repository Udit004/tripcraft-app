"use client"

import { useState } from 'react'
import { IItineraryDayResponse } from '@/types/itineraryDay'
import { deleteItineraryDay } from '@/services'
import { toast } from '@/lib/toast'

interface UseItineraryDeleteReturn {
  deletingDay: IItineraryDayResponse | null
  isDeleting: boolean
  setDeletingDay: (day: IItineraryDayResponse | null) => void
  handleConfirmDelete: (onSuccess: () => Promise<void>, onShowUndoToast: (data: any) => void) => Promise<void>
}

export const useItineraryDelete = (tripSlug: string): UseItineraryDeleteReturn => {
  const [deletingDay, setDeletingDay] = useState<IItineraryDayResponse | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirmDelete = async (onSuccess: () => Promise<void>, onShowUndoToast: (data: any) => void) => {
    if (!deletingDay) return

    try {
      setIsDeleting(true)
      const result = await deleteItineraryDay(tripSlug, deletingDay._id)

      if (result.success) {
        setDeletingDay(null)

        // Show undo toast via callback so component can handle JSX
        if (result.deletionLogId) {
          onShowUndoToast({
            deletionLogId: result.deletionLogId,
            dayNumber: deletingDay.dayNumber,
            dayDate: deletingDay.date,
            undoWindowSeconds: result.undoWindowSeconds || 10
          })
        } else {
          toast.delete('Itinerary day deleted successfully!')
        }

        // Refresh the itinerary list
        await onSuccess()
      } else {
        toast.error('Failed to delete itinerary day. Please try again.')
      }
    } catch (err) {
      console.error('Error deleting itinerary day:', err)
      toast.error('Failed to delete itinerary day. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    deletingDay,
    isDeleting,
    setDeletingDay,
    handleConfirmDelete
  }
}
