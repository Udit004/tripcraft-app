// components/itinerary/LoadingState.tsx
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const LoadingState: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="flex items-center gap-3 mb-8">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      {/* Activities Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40 mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-[#E5E7EB] rounded-lg p-6 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
};

