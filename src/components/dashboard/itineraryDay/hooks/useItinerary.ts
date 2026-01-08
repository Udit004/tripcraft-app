"use client"

import { useEffect, useState } from 'react'
import { IItineraryDayResponse } from '@/types/itineraryDay'
import { ITripResponse } from '@/types/trip'
import { getItineraryDays, getTripById } from '@/services'
import { calculateTripDuration, exceedsTripDuration as checkExceedsTripDuration } from '@/utility/tripUtils'
import { toast } from '@/lib/toast'

interface UseItineraryReturn {
  itineraryData: IItineraryDayResponse[]
  trip: ITripResponse | null
  loading: boolean
  error: string | null
  tripDurationDays: number
  daysExceedingDuration: number
  fetchItineraryDays: () => Promise<void>
}

export const useItinerary = (tripSlug: string): UseItineraryReturn => {
  const [itineraryData, setItineraryData] = useState<IItineraryDayResponse[]>([])
  const [trip, setTrip] = useState<ITripResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tripDurationDays, setTripDurationDays] = useState<number>(0)

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
      const errorMsg = err instanceof Error ? err.message : 'Failed to load itinerary days'
      setError(errorMsg)
      toast.error(errorMsg)
      setItineraryData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (tripSlug) {
      fetchItineraryDays()
    }
  }, [tripSlug])

  return {
    itineraryData,
    trip,
    loading,
    error,
    tripDurationDays,
    daysExceedingDuration,
    fetchItineraryDays
  }
}
