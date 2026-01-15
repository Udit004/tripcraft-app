'use client';

import { use, useEffect, useState, ReactNode } from 'react';
import { getTripById } from '@/services/tripService';
import { ITripResponse } from '@/types/trip';
import { toast } from '@/lib/toast';
import PoolSidebar from '@/components/dashboard/PoolSidebar';
import { DragProvider } from '@/context/DragContext';
import { TripProvider } from '@/context/TripContext';
import Link from 'next/link';

export default function TripLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ tripSlug: string }>;
}) {
  const { tripSlug } = use(params);
  const [trip, setTrip] = useState<ITripResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrip = async () => {
    if (!tripSlug) {
      console.error('No tripSlug available!');
      const errorMsg = 'Invalid trip ID';
      setError(errorMsg);
      toast.error(errorMsg);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const tripData = await getTripById(tripSlug);
      setTrip(tripData);
      setError(null);
    } catch (err) {
      console.error('Error fetching trip:', err);
      const errorMsg = 'Failed to load trip';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [tripSlug]);

  const handleActivityMoved = () => {
    // Trigger refresh of itinerary data
    const event = new CustomEvent('activity-pool-changed');
    window.dispatchEvent(event);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Trip</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchTrip}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Trip not found
  if (!trip) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="text-gray-400 text-5xl mb-4">🗺️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Trip Not Found</h2>
          <p className="text-gray-600 mb-4">The trip you're looking for doesn't exist.</p>
          <Link
            href="/dashboard"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Main layout with split view
  return (
    <DragProvider>
      <TripProvider trip={trip} tripSlug={tripSlug} refreshTrip={fetchTrip}>
        <div className="flex min-h-screen">
          {/* Main Content Area - scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-6">
              {children}
            </div>
          </div>

          {/* Pool Sidebar - sticky */}
          <PoolSidebar tripId={trip._id.toString()} onActivityMoved={handleActivityMoved} />
        </div>
      </TripProvider>
    </DragProvider>
  );
}
