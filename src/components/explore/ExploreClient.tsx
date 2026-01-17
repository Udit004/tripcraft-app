'use client';

import Image from 'next/image';
import { colors } from '@/constants/colors';
import { ModeToggle } from './ModeToggle';
import { SearchBar } from './SearchBar';
import { ActivityFilters } from './ActivityFilters';
import { MapView } from './MapView';
import { ResultsList } from './ResultsList';
import { useExploreState } from './hooks/useExploreState';

/**
 * Main Explore page client component
 * Orchestrates all exploration modes and synchronizes map with results
 */
export default function ExploreClient() {
  const {
    mode,
    setMode,
    searchQuery,
    handleSearch,
    activeFilters,
    handleFiltersChange,
    activities,
    isLoadingActivities,
    viewport,
    setViewport,
    handleMapClick,
    hoveredActivityId,
    selectedActivityId,
    handleActivityClick,
    handleActivityHover,
    handleSaveActivity,
  } = useExploreState();

  const showMap = mode === 'map' || mode === 'combined';
  const showList = mode === 'search' || mode === 'combined';

  return (
    <div className="space-y-6">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden rounded-2xl min-h-[500px] flex items-center justify-center">

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
        <div className="relative z-10 px-6 py-20 md:py-28 text-center max-w-4xl mx-auto">

          {/* Header */}
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              background: `linear-gradient(to right, ${colors.background}, ${colors.background})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Explore the World
          </h1>

          <p
            className="text-lg max-w-2xl mx-auto mb-10"
            style={{ color: '#E5E7EB' }}
          >
            Discover amazing places, plan your perfect trip
          </p>

          {/* Mode Toggle */}
          <div className="mb-6">
            <ModeToggle mode={mode} onChange={setMode} />
          </div>

          {/* Search Bar */}
          <SearchBar
            onSearch={handleSearch}
            isLoading={isLoadingActivities}
            placeholder="Search city, place, or landmark..."
            sticky={false}
          />

        </div>
      </section>

      {/* Activity Filters */}
      {activities.length > 0 && (
        <div className="mt-6">
          <ActivityFilters
            activeFilters={activeFilters}
            onChange={handleFiltersChange}
          />
        </div>
      )}

      {/* Main Content - Map and Results */}
      {activities.length > 0 && (
        <div className="mt-8">
          {mode === 'combined' ? (
            // Combined mode: Side-by-side layout
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Map */}
              <div className="h-[600px] lg:sticky lg:top-24">
                <MapView
                  activities={activities}
                  viewport={viewport}
                  onViewportChange={setViewport}
                  onActivityClick={handleActivityClick}
                  onMapClick={handleMapClick}
                  highlightedActivityId={hoveredActivityId || undefined}
                  className="h-full"
                />
              </div>

              {/* Results */}
              <div>
                <ResultsList
                  activities={activities}
                  isLoading={isLoadingActivities}
                  onActivityHover={handleActivityHover}
                  onActivityClick={handleActivityClick}
                  onSaveActivity={handleSaveActivity}
                  scrollToActivityId={selectedActivityId || undefined}
                />
              </div>
            </div>
          ) : mode === 'map' ? (
            // Map-only mode
            <div className="h-[calc(100vh-300px)] min-h-[600px]">
              <MapView
                activities={activities}
                viewport={viewport}
                onViewportChange={setViewport}
                onActivityClick={handleActivityClick}
                onMapClick={handleMapClick}
                highlightedActivityId={hoveredActivityId || undefined}
                className="h-full"
              />
            </div>
          ) : (
            // Search-only mode
            <ResultsList
              activities={activities}
              isLoading={isLoadingActivities}
              onActivityHover={handleActivityHover}
              onActivityClick={handleActivityClick}
              onSaveActivity={handleSaveActivity}
              scrollToActivityId={selectedActivityId || undefined}
            />
          )}
        </div>
      )}

      {/* Empty state */}
      {!isLoadingActivities && activities.length === 0 && searchQuery && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-2xl font-semibold mb-2" style={{ color: colors.textMain }}>
            Ready to explore?
          </h3>
          <p style={{ color: colors.textMuted }}>
            Search for a destination above to discover amazing places
          </p>
        </div>
      )}

      {/* Initial state */}
      {!searchQuery && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">✨</div>
          <h3 className="text-2xl font-semibold mb-2" style={{ color: colors.textMain }}>
            Start Your Adventure
          </h3>
          <p className="mb-8" style={{ color: colors.textMuted }}>
            Search for any destination to begin exploring
          </p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <div className="p-6 rounded-lg" style={{ backgroundColor: colors.surface }}>
              <div className="text-4xl mb-3">🔍</div>
              <h4 className="font-semibold mb-2" style={{ color: colors.textMain }}>
                Smart Search
              </h4>
              <p className="text-sm" style={{ color: colors.textMuted }}>
                Find cities, landmarks, and hidden gems with intelligent autocomplete
              </p>
            </div>
            
            <div className="p-6 rounded-lg" style={{ backgroundColor: colors.surface }}>
              <div className="text-4xl mb-3">🗺️</div>
              <h4 className="font-semibold mb-2" style={{ color: colors.textMain }}>
                Interactive Map
              </h4>
              <p className="text-sm" style={{ color: colors.textMuted }}>
                Visualize locations and discover nearby attractions on the map
              </p>
            </div>
            
            <div className="p-6 rounded-lg" style={{ backgroundColor: colors.surface }}>
              <div className="text-4xl mb-3">🎯</div>
              <h4 className="font-semibold mb-2" style={{ color: colors.textMain }}>
                Intent Filters
              </h4>
              <p className="text-sm" style={{ color: colors.textMuted }}>
                Filter by what matters - food, nature, culture, and more
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
