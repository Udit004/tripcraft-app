// components/dashboard/DashboardStats.tsx
import React, { useMemo } from 'react';
import { ITripResponse } from '@/types/trip';
import { colors } from '@/constants/colors';
import { MapPin, Calendar, TrendingUp } from 'lucide-react';

interface DashboardStatsProps {
  trips: ITripResponse[];
}

const DashboardStats = React.memo(({ trips }: DashboardStatsProps) => {
  const stats = useMemo(() => {
    const totalTrips = trips.length;
    const uniqueDestinations = new Set(trips.map(t => t.destination)).size;
    
    // Calculate upcoming trips (trips with start date in the future)
    const upcomingTrips = trips.filter(
      t => new Date(t.startDate) > new Date()
    ).length;

    return { totalTrips, uniqueDestinations, upcomingTrips };
  }, [trips]);

  return (
    <div
      className="mb-8 p-6 rounded-xl border transition-all duration-300"
      style={{ 
        backgroundColor: colors.surface,
        borderColor: colors.border
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Trips */}
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${colors.primary}15` }}
          >
            <Calendar className="w-6 h-6" style={{ color: colors.primary }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: colors.textMuted }}>
              Total Trips
            </p>
            <p className="text-3xl font-bold" style={{ color: colors.primary }}>
              {stats.totalTrips}
            </p>
          </div>
        </div>

        {/* Destinations */}
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${colors.secondary}15` }}
          >
            <MapPin className="w-6 h-6" style={{ color: colors.secondary }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: colors.textMuted }}>
              Destinations
            </p>
            <p className="text-3xl font-bold" style={{ color: colors.secondary }}>
              {stats.uniqueDestinations}
            </p>
          </div>
        </div>

        {/* Upcoming */}
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${colors.accent}15` }}
          >
            <TrendingUp className="w-6 h-6" style={{ color: colors.accent }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: colors.textMuted }}>
              Upcoming
            </p>
            <p className="text-3xl font-bold" style={{ color: colors.accent }}>
              {stats.upcomingTrips}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

DashboardStats.displayName = 'DashboardStats';

export default DashboardStats;