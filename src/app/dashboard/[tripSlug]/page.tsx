// app/trip/[tripSlug]/page.tsx
"use client"

import { getTripById } from "@/services/tripService";
import { use, useEffect, useState } from "react";
import { ITripResponse } from "@/types/trip";
import TripHeader from "@/components/dashboard/tripSlug/TripHeader";


export default function TripPage({ params }: { params: Promise<{ tripSlug: string }> }) {
  const { tripSlug } = use(params);  // Unwrap the Promise using React.use()
  const [trip, setTrip] = useState<ITripResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!tripSlug) {
        console.error('No tripSlug available!');
        setError('Invalid trip ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const tripData = await getTripById(tripSlug);
        setTrip(tripData);
      } catch (err) {
        console.error('Error fetching trip:', err);
        setError('Failed to load trip');
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripSlug]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!trip) return <div>Trip not found</div>;

  return (
    <div className="container mx-auto p-6">
      <TripHeader trip={trip} />
    </div>
  );
}
