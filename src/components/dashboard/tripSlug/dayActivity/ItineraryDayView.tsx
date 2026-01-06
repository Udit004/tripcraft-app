// components/itinerary/ItineraryDayView.tsx
import React from 'react';
import { IItineraryDay } from '@/types/itineraryDay';
import { IActivity } from '@/types/activity';
import { ActivityCard } from './ActivityCard';
import { Calendar } from 'lucide-react';

interface ItineraryDayViewProps {
  itineraryDay: IItineraryDay;
  activities: IActivity[];
}

export const ItineraryDayView: React.FC<ItineraryDayViewProps> = ({
  itineraryDay,
  activities,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Day Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-[#1E3A8A] flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {itineraryDay.dayNumber}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">
              Day {itineraryDay.dayNumber}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 text-[#0EA5A4]" />
              <p className="text-[#475569]">
                {formatDate(itineraryDay.date)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activities Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[#0F172A] mb-4">
          Activities ({activities.length})
        </h2>
        
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <ActivityCard key={activity._id} activity={activity} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#F8FAFC] rounded-lg border border-[#E5E7EB]">
            <p className="text-[#475569]">No activities planned for this day</p>
          </div>
        )}
      </div>
    </div>
  );
};