"use client"

import React, { useState } from 'react'
import { ICreateTripRequest } from '@/types/trip'
import { createTrip } from '@/services'
import { useRouter } from 'next/navigation'


export default function CreateTripModal() {
    const router = useRouter();
    const [tripDetails, setTripDetails] = useState<ICreateTripRequest>({
        tripName: '',
        tripDescription: '',
        destination: '',
        startDate: new Date(),
        endDate: new Date(),
    })
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTripDetails(prevDetails => ({
            ...prevDetails,
            [name]: value,
        }));
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTripDetails(prevDetails => ({
            ...prevDetails,
            [name]: new Date(value),
        }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const newTrip = await createTrip(tripDetails);
            router.push(`/dashboard/${newTrip?._id}`);
            setTripDetails({
                tripName: '',
                tripDescription: '',
                destination: '',
                startDate: new Date(),
                endDate: new Date(),
            });
            console.log('Trip created successfully:', newTrip);
        } catch (err) {
            setError('Failed to create trip. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }   
    }



    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-teal-500 px-6 sm:px-8 py-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Create New Trip</h1>
                        <p className="text-indigo-100">Plan your next adventure</p>
                    </div>

                    {/* Form Content */}
                    <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-8 space-y-6">
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
                                onChange={handleInputChange}
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
                                onChange={handleInputChange}
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
                                onChange={handleInputChange}
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
                                    value={tripDetails.startDate.toISOString().split('T')[0]}
                                    onChange={handleDateChange}
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
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
                                    value={tripDetails.endDate.toISOString().split('T')[0]}
                                    onChange={handleDateChange}
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                                />
                            </div>
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
                                        Creating Trip...
                                    </span>
                                ) : (
                                    'Create Trip'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer Note */}
                <p className="text-center text-gray-600 text-sm mt-6">
                    Dont worry, you can edit these details anytime
                </p>
            </div>
        </div>
    )
}
