// components/dashboard/EmptyState.tsx
import { Button } from '@/components/ui/button';
import { Plane, MapPin, Calendar, Compass } from 'lucide-react';
import { colors } from '@/constants/colors';

interface EmptyStateProps {
  onCreateTrip: () => void;
}

export default function EmptyState({ onCreateTrip }: EmptyStateProps) {
  return (
    <div 
      className="relative rounded-2xl p-12 text-center overflow-hidden"
      style={{ 
        backgroundColor: colors.surface,
        border: `2px dashed ${colors.border}`
      }}
    >
      {/* Floating Icons Background */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <Plane className="absolute top-10 left-10 w-16 h-16 animate-pulse" style={{ color: colors.primary }} />
        <MapPin className="absolute top-20 right-20 w-12 h-12 animate-pulse delay-300" style={{ color: colors.secondary }} />
        <Calendar className="absolute bottom-20 left-20 w-14 h-14 animate-pulse delay-500" style={{ color: colors.accent }} />
        <Compass className="absolute bottom-10 right-10 w-20 h-20 animate-pulse delay-700" style={{ color: colors.primary }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div 
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
          style={{ backgroundColor: `${colors.primary}15` }}
        >
          <Plane 
            size={40} 
            style={{ color: colors.primary }}
            className="transform rotate-45"
          />
        </div>
        
        <h2 
          className="text-3xl font-bold mb-3"
          style={{ color: colors.textMain }}
        >
          Your Journey Begins Here
        </h2>
        
        <p 
          className="text-base mb-8 max-w-md mx-auto"
          style={{ color: colors.textMuted }}
        >
          Create your first trip and start planning unforgettable adventures. Track destinations, manage itineraries, and make memories.
        </p>
        
        <Button 
          onClick={onCreateTrip}
          size="lg"
          className="gap-2 px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          style={{ 
            backgroundColor: colors.primary,
            color: colors.surface
          }}
        >
          <Plane size={20} />
          Create Your First Trip
        </Button>
      </div>
    </div>
  );
}