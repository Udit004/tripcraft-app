'use client';

import { ExploreData } from '@/services/exploreService';
import ActivityCard from './ActivityCard';
import { MapPin, AlertCircle, Sparkles } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { colors, buttonGradients } from '@/constants/colors';

interface ExploreResultsProps {
  data: ExploreData;
}

/**
 * Results component displaying destination info and activities
 */
export default function ExploreResults({ data }: ExploreResultsProps) {
  const { destination, destinationInfo, activities } = data;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Destination Header */}
      <div className="text-center space-y-3 py-6 px-4 rounded-xl" style={{
        background: `linear-gradient(to right, ${buttonGradients.primary.from}, ${buttonGradients.primary.to})`,
      }}>
        <div className="flex items-center justify-center gap-2">
          <MapPin className="h-6 w-6 text-white" />
          <h2 className="text-3xl font-bold text-white">
            {destination}
          </h2>
        </div>
        <p className="text-white/90 max-w-2xl mx-auto">
          {destinationInfo}
        </p>
      </div>

      {/* Activities Grid */}
      {activities.length > 0 ? (
        <>
          <div className="flex items-center gap-2" style={{ color: colors.primary }}>
            <Sparkles className="h-5 w-5" style={{ color: colors.accent }} />
            <h3 className="text-xl font-semibold">
              Found {activities.length} {activities.length === 1 ? 'attraction' : 'attractions'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map((activity, index) => (
              <ActivityCard key={`${activity.name}-${index}`} activity={activity} />
            ))}
          </div>
        </>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No attractions found for {destination}. Try searching for a different destination or a larger city nearby.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
