'use client';

import { useState, useRef, useEffect } from 'react';
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
  const listRef = useRef<HTMLDivElement>(null);
  const activityRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Scroll to activity when marker is clicked
  useEffect(() => {
    if (scrollToActivityId && activityRefs.current.has(scrollToActivityId)) {
      const element = activityRefs.current.get(scrollToActivityId);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [scrollToActivityId]);

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

      {/* Activity cards */}
      <div
        ref={listRef}
        className="space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
        style={{ maxHeight: 'calc(100vh - 300px)' }}
      >
        {sortedActivities.map((activity) => (
          <div
            key={activity.id}
            ref={(el) => {
              if (el) {
                activityRefs.current.set(activity.id, el);
              } else {
                activityRefs.current.delete(activity.id);
              }
            }}
            className="transition-all duration-200"
          >
            <ActivityCard
              activity={activity}
              onClick={() => onActivityClick(activity.id)}
              onSave={() => onSaveActivity(activity.id)}
              onHover={(isHovering) => onActivityHover(isHovering ? activity.id : null)}
              isHighlighted={scrollToActivityId === activity.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
