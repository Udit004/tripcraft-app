"use client"

import React, { useState, useEffect } from 'react'
import { IItineraryDayRequest, IItineraryDayResponse } from '@/types/itineraryDay'
import mongoose from 'mongoose'
import ItineraryDayForm from './ItineraryDayForm'

interface EditItineraryDayModalProps {
    dayId: string
    tripId: string | mongoose.Types.ObjectId
    initialDayData: IItineraryDayResponse
    onUpdateDay: (tripId: string, dayId: string, dayData: Omit<IItineraryDayRequest, 'tripId'>) => Promise<any>
    onClose?: () => void
    onSuccess?: () => void
}

export default function EditItineraryDayModal({
    dayId,
    tripId,
    initialDayData,
    onUpdateDay,
    onClose,
    onSuccess
}: EditItineraryDayModalProps) {
    const [dayDetails, setDayDetails] = useState<IItineraryDayRequest>({
        tripId: tripId,
        dayNumber: initialDayData.dayNumber,
        date: new Date(initialDayData.date),
        activitiesId: initialDayData.activitiesId || [],
    })
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setDayDetails({
            tripId: tripId,
            dayNumber: initialDayData.dayNumber,
            date: new Date(initialDayData.date),
            activitiesId: initialDayData.activitiesId || [],
        })
    }, [initialDayData, tripId])

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
            const updateData = {
                dayNumber: dayDetails.dayNumber,
                date: dayDetails.date,
                activitiesId: dayDetails.activitiesId,
            }
            await onUpdateDay(String(tripId), dayId, updateData)
            console.log('Itinerary day updated successfully')

            onSuccess?.()
            onClose?.()
        } catch (err) {
            setError('Failed to update itinerary day. Please try again.')
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
            buttonText="Update Day"
            headerTitle="Edit Day"
            headerSubtitle="Modify your itinerary day details"
            onClose={onClose}
        />
    )
}
