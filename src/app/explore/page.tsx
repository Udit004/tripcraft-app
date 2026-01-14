import { Metadata } from 'next';
import ExploreClient from '@/components/explore/ExploreClient';
import { colors, buttonGradients } from '@/constants/colors';

export const metadata: Metadata = {
  title: 'Explore Destinations | TripCraft',
  description: 'Discover amazing tourist attractions, landmarks, and activities around the world.',
};

/**
 * Server-side Explore page
 * Delegates all interactions to the client component
 */
export default function ExplorePage() {
  return (
    <div className="min-h-screen" style={{ 
      background: `linear-gradient(to bottom, ${colors.background}, ${colors.surface})`
    }}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{
            background: `linear-gradient(to right, ${buttonGradients.primary.from}, ${buttonGradients.primary.to})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Explore Destinations
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.textMuted }}>
            Search for any city or destination to discover popular attractions, 
            museums, parks, monuments, and cultural landmarks.
          </p>
        </header>

        {/* Client Component */}
        <ExploreClient />
      </div>
    </div>
  );
}
