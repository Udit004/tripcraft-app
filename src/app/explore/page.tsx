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
        {/* Client Component */}
        <ExploreClient />
      </div>
    </div>
  );
}
