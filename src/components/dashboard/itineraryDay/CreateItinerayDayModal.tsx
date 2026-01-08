"use client"

import React, { useState } from 'react'
import { IItineraryDayRequest } from '@/types/itineraryDay'
import { CreateItineraryDay } from '@/services/tripService'
import { useRouter } from 'next/navigation'
import mongoose from 'mongoose'
import ItineraryDayForm from './ItineraryDayForm'
import { toast } from '@/lib/toast'

interface CreateItineraryDayModalProps {
    tripId: string | mongoose.Types.ObjectId
    onClose?: () => void
    onSuccess?: () => void
}

export default function CreateItineraryDayModal({ tripId, onClose, onSuccess }: CreateItineraryDayModalProps) {
    const router = useRouter()
    const [dayDetails, setDayDetails] = useState<IItineraryDayRequest>({
        tripId: tripId,
        dayNumber: 1,
        date: new Date(),
        activitiesId: [],
    })
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

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
        />
    )
}
