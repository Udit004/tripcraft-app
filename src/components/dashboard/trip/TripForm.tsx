"use client"

import React from 'react'
import { ICreateTripRequest } from '@/types/trip'
import { GradientButton } from '@/components/ui/GradientButton'

interface TripFormProps {
    tripDetails: ICreateTripRequest
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onSubmit: (e: React.FormEvent) => void
    error: string | null
    loading: boolean
    buttonText?: string
    headerTitle?: string
    headerSubtitle?: string
    onClose?: () => void
}

export default function TripForm({
    tripDetails,
    onInputChange,
    onDateChange,
    onSubmit,
    error,
    loading,
    buttonText = 'Create Trip',
    headerTitle = 'Create New Trip',
    headerSubtitle = 'Plan your next adventure',
    onClose
}: TripFormProps) {
    // Helper function to safely format dates
    const formatDateForInput = (date: Date | string | undefined): string => {
        if (!date) return ''
        const dateObj = typeof date === 'string' ? new Date(date) : date
        return dateObj.toISOString().split('T')[0]
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-teal-500 px-6 sm:px-8 py-8">
                <h1 className="text-3xl font-bold text-white mb-2">{headerTitle}</h1>
                <p className="text-indigo-100">{headerSubtitle}</p>
            </div>

            {/* Form Content */}
            <form onSubmit={onSubmit} className="px-6 sm:px-8 py-8 space-y-6">
                {/* Error Alert */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <p className="text-red-700 font-medium text-sm">{error}</p>
                    </div>
                )}

                {/* Trip Name */}
                <div>
                    <label htmlFor="tripName" className="block text-sm font-semibold text-gray-900 mb-2">
                        Trip Name
                    </label>
                    <input
                        type="text"
                        id="tripName"
                        name="tripName"
                        value={tripDetails.tripName}
                        onChange={onInputChange}
                        placeholder="e.g., Summer Europe Adventure"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                </div>

                {/* Destination */}
                <div>
                    <label htmlFor="destination" className="block text-sm font-semibold text-gray-900 mb-2">
                        Destination
                    </label>
                    <input
                        type="text"
                        id="destination"
                        name="destination"
                        value={tripDetails.destination}
                        onChange={onInputChange}
                        placeholder="e.g., Paris, France"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="tripDescription" className="block text-sm font-semibold text-gray-900 mb-2">
                        Trip Description
                    </label>
                    <textarea
                        id="tripDescription"
                        name="tripDescription"
                        value={tripDetails.tripDescription}
                        onChange={onInputChange}
                        placeholder="Describe your trip, activities you plan, or any special notes..."
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                    />
                </div>

                {/* Dates Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Start Date */}
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-semibold text-gray-900 mb-2">
                            Start Date
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={formatDateForInput(tripDetails.startDate)}
                            onChange={onDateChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                        />
                    </div>

                    {/* End Date */}
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-semibold text-gray-900 mb-2">
                            End Date
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={formatDateForInput(tripDetails.endDate)}
                            onChange={onDateChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                        />
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        💡 <span className="font-semibold">Tip:</span> You can add itinerary days and activities after creating your trip.
                    </p>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <GradientButton
                        type="submit"
                        variant={buttonText === 'Create Trip' ? 'create' : 'edit'}
                        disabled={loading}
                        fullWidth
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {buttonText === 'Create Trip' ? 'Creating Trip...' : 'Updating Trip...'}
                            </span>
                        ) : (
                            buttonText
                        )}
                    </GradientButton>
                </div>

                {/* Cancel Button */}
                {onClose && (
                    <GradientButton
                        type="button"
                        variant="neutral"
                        onClick={onClose}
                        fullWidth
                    >
                        Cancel
                    </GradientButton>
                )}
            </form>
        </div>
    )
}
