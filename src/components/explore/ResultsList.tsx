'use client';

import { useState, useRef, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ExploreActivity } from '@/types/explore';
import { colors } from '@/constants/colors';
import { ArrowUpDown, Loader2 } from 'lucide-react';
import ActivityCard from './ActivityCard';

interface ResultsListProps {
  activities: ExploreActivity[];
  isLoading: boolean;
  onActivityHover: (activityId: string | null) => void;
  onActivityClick: (activityId: string) => void;
  onSaveActivity: (activityId: string) => void;
  scrollToActivityId?: string;
  className?: string;
}

type SortOption = 'relevance' | 'distance' | 'rating';

/**
 * Results list component with sorting and sync with map
 */
export function ResultsList({
  activities,
  isLoading,
  onActivityHover,
  onActivityClick,
  onSaveActivity,
  scrollToActivityId,
  className = '',
}: ResultsListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const parentRef = useRef<HTMLDivElement>(null);
  const activityRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Sort activities
  const sortedActivities = [...activities].sort((a, b) => {
    switch (sortBy) {
      case 'distance':
        return (a.distance || Infinity) - (b.distance || Infinity);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'relevance':
      default:
        return 0;
    }
  });

  // Virtual scrolling for performance
  const virtualizer = useVirtualizer({
    count: sortedActivities.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 350, // Estimated card height with spacing
    overscan: 5, // Render 5 items above/below viewport
    measureElement: (el) => el?.getBoundingClientRect().height ?? 350, // Measure actual height
  });

  // Scroll to activity when marker is clicked (only once per selection)
  const lastScrolledId = useRef<string | null>(null);
  
  useEffect(() => {
    if (scrollToActivityId && scrollToActivityId !== lastScrolledId.current) {
      const index = sortedActivities.findIndex(a => a.id === scrollToActivityId);
      if (index !== -1) {
        virtualizer.scrollToIndex(index, { align: 'center', behavior: 'smooth' });
        lastScrolledId.current = scrollToActivityId;
      }
    } else if (!scrollToActivityId) {
      lastScrolledId.current = null;
    }
  }, [scrollToActivityId, sortedActivities, virtualizer]);

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" style={{ color: colors.primary }} />
          <p style={{ color: colors.textMuted }}>Finding amazing places...</p>
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: colors.textMain }}>
          No results found
        </h3>
        <p style={{ color: colors.textMuted }}>
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Sort controls */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm" style={{ color: colors.textMuted }}>
          {activities.length} {activities.length === 1 ? 'place' : 'places'} found
        </p>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4" style={{ color: colors.textMuted }} />
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            className="text-sm px-3 py-1 rounded-lg border transition-colors"
            style={{
              backgroundColor: colors.surface,
              color: colors.textMain,
              borderColor: colors.border,
            }}
          >
            <option value="relevance">Relevance</option>
            <option value="distance">Distance</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {/* Activity cards with virtual scrolling */}
      <div
        ref={parentRef}
        className="overflow-y-auto  gap-16 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
          className='gap-8 space-y-8 mb-8 '
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const activity = sortedActivities[virtualRow.index];
            return (
              <div
                key={activity.id}
                data-index={virtualRow.index}
                ref={(el) => {
                  if (el) {
                    activityRefs.current.set(activity.id, el);
                    virtualizer.measureElement(el);
                  } else {
                    activityRefs.current.delete(activity.id);
                  }
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                  paddingBottom: '24px',
                }}
              >
                <ActivityCard
                  activity={activity}
                  onClick={() => onActivityClick(activity.id)}
                  onSave={async () => await onSaveActivity(activity.id)}
                  onHover={(isHovering) => onActivityHover(isHovering ? activity.id : null)}
                  isHighlighted={scrollToActivityId === activity.id}
                  isSaved={activity.saved}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
