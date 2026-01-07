"use client"

import React, { useState } from 'react'
import { IItineraryDayRequest } from '@/types/itineraryDay'
import { CreateItineraryDay } from '@/services/tripService'
import { useRouter } from 'next/navigation'
import mongoose from 'mongoose'

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
            setError('Failed to create itinerary day. Please try again.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-teal-500 px-6 sm:px-8 py-8">
                <h1 className="text-3xl font-bold text-white mb-2">Add Day to Itinerary</h1>
                <p className="text-indigo-100">Create a new day for your trip</p>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-8 space-y-6">
                {/* Error Alert */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <p className="text-red-700 font-medium text-sm">{error}</p>
                    </div>
                )}

                {/* Day Number */}
                <div>
                    <label htmlFor="dayNumber" className="block text-sm font-semibold text-gray-900 mb-2">
                        Day Number
                    </label>
                    <input
                        type="number"
                        id="dayNumber"
                        name="dayNumber"
                        value={dayDetails.dayNumber}
                        onChange={handleInputChange}
                        placeholder="e.g., 1"
                        min="1"
                        max="365"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">Which day of the trip is this?</p>
                </div>

                {/* Date */}
                <div>
                    <label htmlFor="date" className="block text-sm font-semibold text-gray-900 mb-2">
                        Date
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={dayDetails.date.toISOString().split('T')[0]}
                        onChange={handleDateChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">Select the date for this day</p>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        💡 <span className="font-semibold">Tip:</span> You can add activities to this day after creating it.
                    </p>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-teal-500 text-white font-bold py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Day...
                            </span>
                        ) : (
                            'Create Day'
                        )}
                    </button>
                </div>

                {/* Cancel Button */}
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        Cancel
                    </button>
                )}
            </form>
        </div>
    )
}
