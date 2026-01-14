'use client';

import { useExplore } from './hooks/useExplore';
import ExploreForm from './ExploreForm';
import ExploreResults from './ExploreResults';
import { AlertCircle, Compass } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { colors, buttonGradients } from '@/constants/colors';

/**
 * Main client component for the Explore page
 * Manages state and orchestrates child components
 */
export default function ExploreClient() {
  const { data, isLoading, error, search } = useExplore();

  return (
    <div className="space-y-8">
      {/* Search Form */}
      <ExploreForm onSearch={search} isLoading={isLoading} />

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Compass className="h-12 w-12 animate-spin" style={{ color: colors.primary }} />
          <p style={{ color: colors.textMuted }}>
            Exploring destinations...
          </p>
        </div>
      )}

      {/* Results */}
      {!isLoading && !error && data && (
        <ExploreResults data={data} />
      )}

      {/* Initial Empty State */}
      {!isLoading && !error && !data && (
        <div className="text-center py-12 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full" style={{
            background: `linear-gradient(135deg, ${buttonGradients.primary.from}, ${buttonGradients.primary.to})`,
          }}>
            <Compass className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold" style={{ color: colors.textMain }}>
              Start Your Exploration
            </h3>
            <p className="max-w-md mx-auto" style={{ color: colors.textMuted }}>
              Enter a destination above to discover amazing attractions, landmarks, 
              and places to visit around the world.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
