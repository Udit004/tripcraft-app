'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { ITripResponse } from '@/types/trip';

interface TripContextValue {
  trip: ITripResponse;
  tripSlug: string;
  refreshTrip?: () => void;
}

const TripContext = createContext<TripContextValue | undefined>(undefined);

export const TripProvider: React.FC<{ children: ReactNode; trip: ITripResponse; tripSlug: string; refreshTrip?: () => void }> = ({ 
  children, 
  trip, 
  tripSlug,
  refreshTrip 
}) => {
  return (
    <TripContext.Provider value={{ trip, tripSlug, refreshTrip }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
