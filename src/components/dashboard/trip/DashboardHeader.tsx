// components/dashboard/DashboardHeader.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { colors } from '@/constants/colors';
import { GradientButton } from '@/components/ui/GradientButton';

interface DashboardHeaderProps {
  onCreateTrip: () => void;
}

const DashboardHeader = React.memo(({ onCreateTrip }: DashboardHeaderProps) => {
  return (
    <header className="mb-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <h1
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
            }}
          >
            My Trips
          </h1>
          <p className="text-lg" style={{ color: colors.textMuted }}>
            Plan, organize, and track all your adventures in one place
          </p>
        </div>

        <GradientButton
          onClick={onCreateTrip}
          variant="secondary"
        >
          <Plus size={20} />
          New Trip
        </GradientButton>
      </div>
    </header>
  );
});

DashboardHeader.displayName = 'DashboardHeader';

export default DashboardHeader;