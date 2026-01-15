// app/trip/[tripSlug]/page.tsx
"use client"

import { use } from "react";
import TripHeader from "@/components/dashboard/itineraryDay/TripHeader";
import TripItinerary from "@/components/dashboard/itineraryDay/TripItinerary";
import { useTrip } from "@/context/TripContext";


export default function TripPage({ params }: { params: Promise<{ tripSlug: string }> }) {
  const { tripSlug } = use(params);
  const { trip } = useTrip();

  return (
    <>
      <TripHeader trip={trip} />
      <div className="mt-6">
        <TripItinerary tripSlug={tripSlug} tripId={trip._id.toString()} />
      </div>
    </>
  );
}
