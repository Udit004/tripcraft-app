// components/dashboard/TripGrid.tsx
import React from 'react';
import { ITripResponse } from '@/types/trip';
import TripCard from '@/components/dashboard/trip/TripCard';
import mongoose from 'mongoose';

interface TripGridProps {
  trips: ITripResponse[];
  onEdit: (trip: ITripResponse) => void;
  onDelete: (trip: ITripResponse) => void;
  onView: (tripId: mongoose.Types.ObjectId) => void;
}

const TripGrid = React.memo(({ trips, onEdit, onDelete, onView }: TripGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      {trips.map((trip) => (
        <TripCard
          key={trip._id}
          trip={trip}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
});

TripGrid.displayName = 'TripGrid';

export default TripGrid;