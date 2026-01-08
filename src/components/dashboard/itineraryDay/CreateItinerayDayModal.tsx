"use client"

import React, { useState, useEffect } from 'react'
import { IItineraryDayRequest } from '@/types/itineraryDay'
import { CreateItineraryDay, getItineraryDays, getTripById } from '@/services/tripService'
import { useRouter } from 'next/navigation'
import mongoose from 'mongoose'
import ItineraryDayForm from './ItineraryDayForm'
import { toast } from '@/lib/toast'
import { ITripResponse } from '@/types/trip'
import { calculateTripDuration } from '@/utility/tripUtils'

interface CreateItineraryDayModalProps {
    tripId: string | mongoose.Types.ObjectId
    onClose?: () => void
    onSuccess?: () => void
    onEditTrip?: () => void
}

export default function CreateItineraryDayModal({ tripId, onClose, onSuccess, onEditTrip }: CreateItineraryDayModalProps) {
    const router = useRouter()
    const [dayDetails, setDayDetails] = useState<IItineraryDayRequest>({
        tripId: tripId,
        dayNumber: 1,
        dayName: '',
        date: new Date(),
        activitiesId: [],
    })
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [trip, setTrip] = useState<ITripResponse | null>(null)
    const [existingDaysCount, setExistingDaysCount] = useState<number>(0)
    const [tripDurationDays, setTripDurationDays] = useState<number>(0)
    const [loadingTrip, setLoadingTrip] = useState<boolean>(true)

    // Fetch trip data and existing days on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingTrip(true)
                const tripData = await getTripById(tripId.toString())
                if (tripData) {
                    setTrip(tripData)
                    const duration = calculateTripDuration(tripData.startDate, tripData.endDate)
                    setTripDurationDays(duration)
                }

                const daysData = await getItineraryDays(tripId.toString())
                setExistingDaysCount(daysData.length)
            } catch (err) {
                console.error('Error fetching trip data:', err)
                // Non-blocking error - continue without warning data
            } finally {
                setLoadingTrip(false)
            }
        }

        if (tripId) {
            fetchData()
        }
    }, [tripId])

    // Calculate if exceeds trip duration
    const exceedsTripDuration = tripDurationDays > 0 && existingDaysCount + 1 > tripDurationDays

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setDayDetails(prevDetails => ({
            ...prevDetails,
            [name]: name === 'dayNumber' ? parseInt(value) : value,
        }))
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setDayDetails(prevDetails => ({
            ...prevDetails,
            [name]: new Date(value),
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const newDay = await CreateItineraryDay(dayDetails)
            console.log('Itinerary day created successfully:', newDay)
            toast.success('Itinerary day created successfully!');
            router.push(`/dashboard/${tripId}/itinerary/${newDay._id}`)
            setDayDetails({
                tripId: tripId,
                dayNumber: 1,
                dayName: '',
                date: new Date(),
                activitiesId: [],
            })

            onSuccess?.()
            onClose?.()
        } catch (err) {
            const errorMsg = 'Failed to create itinerary day. Please try again.';
            setError(errorMsg)
            toast.error(errorMsg);
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <ItineraryDayForm
            dayDetails={dayDetails}
            onInputChange={handleInputChange}
            onDateChange={handleDateChange}
            onSubmit={handleSubmit}
            error={error}
            loading={loading}
            buttonText="Create Day"
            headerTitle="Add Day to Itinerary"
            headerSubtitle="Create a new day for your trip"
            onClose={onClose}
            exceedsTripDuration={exceedsTripDuration}
            tripDurationDays={tripDurationDays}
            existingDaysCount={existingDaysCount}
            onUpdateTripDates={onEditTrip}
        />
    )
}
