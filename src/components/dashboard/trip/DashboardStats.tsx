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
      className="mb-8 p-6 rounded-xl transition-all duration-300"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Trips */}
        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-md">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${colors.background}` }}
          >
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-200">
              Total Trips
            </p>
            <p className="text-3xl font-bold text-gray-100">
              {stats.totalTrips}
            </p>
          </div>
        </div>

        {/* Destinations */}
        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-md">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${colors.background}` }}
          >
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-200">
              Destinations
            </p>
            <p className="text-3xl font-bold text-gray-100">
              {stats.uniqueDestinations}
            </p>
          </div>
        </div>

        {/* Upcoming */}
        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-md">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${colors.background}` }}
          >
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-200" >
              Upcoming
            </p>
            <p className="text-3xl font-bold text-gray-100">
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