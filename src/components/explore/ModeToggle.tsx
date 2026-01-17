'use client';

import { Search, Map, Layers } from 'lucide-react';
import { ExploreMode } from '@/types/explore';
import { colors } from '@/constants/colors';
import { GradientButton } from '../ui/GradientButton';
import { Button } from '../ui/button';

interface ModeToggleProps {
  mode: ExploreMode;
  onChange: (mode: ExploreMode) => void;
}

/**
 * Toggle component to switch between Search, Map, and Combined modes
 */
export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  const modes: { value: ExploreMode; label: string; icon: typeof Search }[] = [
    { value: 'search', label: 'Search', icon: Search },
    { value: 'map', label: 'Map', icon: Map },
    { value: 'combined', label: 'Combined', icon: Layers },
  ];

  return (
    <div className="flex items-center justify-center mb-6">
      <div 
        className="inline-flex rounded-lg p-1 shadow-sm"
        style={{ backgroundColor: colors.surface }}
      >
        {modes.map(({ value, label, icon: Icon }) => (
          <Button
            key={value}
            onClick={() => onChange(value)}
            className="flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium cursor-pointer"
            style={{
              backgroundColor: mode === value ? colors.primary : 'transparent',
              color: mode === value ? '#ffffff' : colors.textMuted,
            }}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
