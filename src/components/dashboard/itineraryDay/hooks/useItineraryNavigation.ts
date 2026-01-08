"use client"

import { useRouter } from 'next/navigation'
import { IItineraryDayResponse } from '@/types/itineraryDay'

interface UseItineraryNavigationReturn {
  handleDayClick: (day: IItineraryDayResponse) => void
}

export const useItineraryNavigation = (
  tripSlug: string,
  onDayClick?: (day: IItineraryDayResponse) => void
): UseItineraryNavigationReturn => {
  const router = useRouter()

  const handleDayClick = (day: IItineraryDayResponse) => {
    if (onDayClick) {
      onDayClick(day)
    } else {
      // Default redirect to day details page
      router.push(`/dashboard/${tripSlug}/itinerary/${day._id}`)
    }
  }

  return { handleDayClick }
}
