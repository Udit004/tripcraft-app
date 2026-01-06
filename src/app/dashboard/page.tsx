"use client"
import ProtectRoutes from '@/components/ProtectRoutes'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getTrips } from '@/services/tripService'
import { ITripResponse } from '@/types/trip'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, FileText } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const router = useRouter();
  const [trips, setTrips] = useState<ITripResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const tripDataFetch = async() => {
    try {
      setLoading(true)
      const fetchedTrips = await getTrips()
      console.log('Fetched trips:', fetchedTrips)
      setTrips(fetchedTrips || [])
      setError(null)
    } catch (error) {
      console.error('Error fetching trips:', error)
      setError('Failed to load trips')
      setTrips([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    tripDataFetch()
  }, [])

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateDuration = (startDate: Date | string, endDate: Date | string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleTripRedirection = (tripId: string | undefined) => {
    if(tripId){
      router.push(`/dashboard/${tripId}`)
    }
  }

  return (
    <ProtectRoutes>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Trips</h1>
              <p className="text-gray-600">Plan and manage your adventures</p>
            </div>
            <Link href="/plan">
              <Button className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer">
                + New Trip
              </Button>
            </Link>
          </div>

          {/* Error State */}
          {error && (
            <Card className="bg-red-50 border-red-200 mb-6">
              <CardContent className="pt-6">
                <p className="text-red-700">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {/* Empty State */}
          {!loading && trips.length === 0 && !error && (
            <Card className="text-center py-12">
              <CardContent>
                <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips yet</h3>
                <p className="text-gray-600 mb-6">Start planning your next adventure!</p>
                <Link href="/plan">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer">
                    Create Your First Trip
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Trips Grid */}
          {!loading && trips.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <Card key={trip._id} onClick={() => handleTripRedirection(trip._id)} className="shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer">
                  {/* Card Header with Destination */}
                  <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-4 text-white">
                    <h2 className="text-xl font-bold truncate">{trip.tripName}</h2>
                    <div className="flex items-center mt-2 text-sm opacity-90">
                      <MapPin size={16} className="mr-1" />
                      {trip.destination}
                    </div>
                  </div>

                  {/* Card Content */}
                  <CardContent className="pt-4">
                    {/* Description */}
                    {trip.tripDescription && (
                      <div className="mb-4">
                        <div className="flex items-start gap-2">
                          <FileText size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {trip.tripDescription}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Date and Duration */}
                    <div className="space-y-3 mb-6 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Start Date:</span>
                        <div className="flex items-center gap-1 font-semibold text-gray-900">
                          <Calendar size={16} />
                          {formatDate(trip.startDate)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">End Date:</span>
                        <div className="flex items-center gap-1 font-semibold text-gray-900">
                          <Calendar size={16} />
                          {formatDate(trip.endDate)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm bg-indigo-50 p-2 rounded">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-bold text-indigo-600">
                          {calculateDuration(trip.startDate, trip.endDate)} days
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 text-sm cursor-pointer">
                        Edit
                      </Button>
                      <Button variant="outline" className="flex-1 text-sm text-red-600 hover:text-red-700 cursor-pointer">
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectRoutes>
  )
}
