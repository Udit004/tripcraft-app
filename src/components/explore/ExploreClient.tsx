'use client';

import Image from 'next/image';
import { useExplore } from './hooks/useExplore';
import ExploreForm from './ExploreForm';
import ExploreResults from './ExploreResults';
import { AlertCircle, Compass } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { colors, buttonGradients } from '@/constants/colors';

export default function ExploreClient() {
  const { data, isLoading, error, search } = useExplore();

  return (
    <div className="space-y-16">

      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden rounded-2xl">

        {/* Background Image */}
        <Image
          src="/images/explore/heroImage.png"
          alt="Explore destinations around the world"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Overlay for readability */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                180deg,
                rgba(30, 58, 138, 0.75),
                rgba(14, 165, 164, 0.75)
              )
            `,
          }}
        />

        {/* Content */}
        <div className="relative z-10 px-6 py-20 md:py-28 text-center">

          {/* Header */}
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              background: `linear-gradient(to right, ${colors.background}, ${colors.background})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Explore Destinations
          </h1>

          <p
            className="text-lg max-w-2xl mx-auto mb-10"
            style={{ color: '#E5E7EB' }}
          >
            Search for any city or destination to discover popular attractions,
            museums, parks, monuments, and cultural landmarks.
          </p>

          {/* Search Form */}
          <div className="max-w-3xl mx-auto">
            <ExploreForm onSearch={search} isLoading={isLoading} />
          </div>

        </div>
      </section>

      {/* ================= ERROR STATE ================= */}
      {error && (
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* ================= LOADING ================= */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Compass className="h-12 w-12 animate-spin" style={{ color: colors.primary }} />
          <p style={{ color: colors.textMuted }}>
            Exploring destinations...
          </p>
        </div>
      )}

      {/* ================= RESULTS ================= */}
      {!isLoading && !error && data && (
        <ExploreResults data={data} />
      )}

      {/* ================= EMPTY STATE ================= */}
      {!isLoading && !error && !data && (
        <div className="text-center py-12 space-y-4">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${buttonGradients.primary.from}, ${buttonGradients.primary.to})`,
            }}
          >
            <Compass className="h-8 w-8 text-white" />
          </div>

          <h3 className="text-xl font-semibold" style={{ color: colors.textMain }}>
            Start Your Exploration
          </h3>

          <p className="max-w-md mx-auto" style={{ color: colors.textMuted }}>
            Enter a destination above to discover amazing attractions,
            landmarks, and places to visit around the world.
          </p>
        </div>
      )}
    </div>
  );
}
