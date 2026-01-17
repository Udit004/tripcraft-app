'use client';

import { ACTIVITY_FILTERS, FilterId } from '@/constants/exploreFilters';
import { colors } from '@/constants/colors';
import { X } from 'lucide-react';

interface ActivityFiltersProps {
  activeFilters: Set<FilterId>;
  onChange: (filters: Set<FilterId>) => void;
}

/**
 * Horizontal chip-based filter component for activity types
 */
export function ActivityFilters({ activeFilters, onChange }: ActivityFiltersProps) {
  const toggleFilter = (filterId: FilterId) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(filterId)) {
      newFilters.delete(filterId);
    } else {
      newFilters.add(filterId);
    }
    onChange(newFilters);
  };

  const clearAll = () => {
    onChange(new Set());
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold" style={{ color: colors.textMain }}>
          Filter by Intent
        </h3>
        {activeFilters.size > 0 && (
          <button
            onClick={clearAll}
            className="text-sm px-3 py-1 rounded-full transition-all hover:bg-opacity-80"
            style={{
              color: colors.primary,
              backgroundColor: colors.primaryLight,
            }}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Horizontal scrollable chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {ACTIVITY_FILTERS.map((filter) => {
          const isActive = activeFilters.has(filter.id as FilterId);
          return (
            <button
              key={filter.id}
              onClick={() => toggleFilter(filter.id as FilterId)}
              className="flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap shadow-sm flex-shrink-0 cursor-pointer"
              style={{
                backgroundColor: isActive ? colors.primary : colors.surface,
                color: isActive ? '#ffffff' : colors.textMain,
                border: `2px solid ${isActive ? colors.primary : colors.border}`,
              }}
            >
              <span className="text-lg">{filter.icon}</span>
              <span className="text-sm font-medium">{filter.label}</span>
              {isActive && <X className="h-3 w-3 ml-1" />}
            </button>
          );
        })}
      </div>

      {/* Active filter count */}
      {activeFilters.size > 0 && (
        <div className="mt-2 text-xs" style={{ color: colors.textMuted }}>
          {activeFilters.size} {activeFilters.size === 1 ? 'filter' : 'filters'} active
        </div>
      )}
    </div>
  );
}
