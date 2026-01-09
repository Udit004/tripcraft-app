// components/dashboard/trip/EmptyState.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Plus, Compass } from 'lucide-react';
import { colors } from '@/constants/colors';

interface EmptyStateProps {
  onCreateTrip: () => void;
}

const EmptyState = React.memo(({ onCreateTrip }: EmptyStateProps) => {
  return (
    <div 
      className="rounded-2xl p-12 text-center border animate-in fade-in zoom-in-95 duration-500"
      style={{ 
        backgroundColor: colors.surface,
        borderColor: colors.border
      }}
    >
      {/* Icon */}
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 relative">
        <div 
          className="absolute inset-0 rounded-full animate-pulse"
          style={{ 
            backgroundColor: `${colors.primary}10`
          }}
        />
        <div 
          className="relative w-16 h-16 rounded-full flex items-center justify-center"
          style={{ 
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
          }}
        >
          <Compass className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Content */}
      <h3 
        className="text-2xl font-bold mb-3"
        style={{ color: colors.textMain }}
      >
        No trips yet
      </h3>
      <p 
        className="text-base mb-8 max-w-md mx-auto leading-relaxed"
        style={{ color: colors.textMuted }}
      >
        Start planning your next adventure! Create your first trip and organize 
        every detail of your journey.
      </p>

      {/* CTA Button */}
      <Button
        onClick={onCreateTrip}
        size="lg"
        className="gap-2 px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
        style={{
          backgroundColor: colors.primary,
          color: colors.surface
        }}
      >
        <Plus size={20} />
        Create Your First Trip
      </Button>

      {/* Features List */}
      <div className="mt-12 pt-8 border-t grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
        style={{ borderColor: colors.border }}
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${colors.primary}15` }}
            >
              <MapPin className="w-4 h-4" style={{ color: colors.primary }} />
            </div>
            <h4 className="font-semibold text-sm" style={{ color: colors.textMain }}>
              Organize Itineraries
            </h4>
          </div>
          <p className="text-xs" style={{ color: colors.textMuted }}>
            Plan day-by-day activities and schedules
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${colors.secondary}15` }}
            >
              <svg className="w-4 h-4" style={{ color: colors.secondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-sm" style={{ color: colors.textMain }}>
              Track Budgets
            </h4>
          </div>
          <p className="text-xs" style={{ color: colors.textMuted }}>
            Manage expenses and stay on budget
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${colors.accent}15` }}
            >
              <svg className="w-4 h-4" style={{ color: colors.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="font-semibold text-sm" style={{ color: colors.textMain }}>
              Save Details
            </h4>
          </div>
          <p className="text-xs" style={{ color: colors.textMuted }}>
            Store bookings and important information
          </p>
        </div>
      </div>
    </div>
  );
});

EmptyState.displayName = 'EmptyState';

export default EmptyState;