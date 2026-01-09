// components/dashboard/trip/TripCard.tsx
import React, { useMemo } from 'react';
import { ITripResponse } from '@/types/trip';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Edit2, Trash2 } from 'lucide-react';
import { colors } from '@/constants/colors';

interface TripCardProps {
  trip: ITripResponse;
  onEdit: (trip: ITripResponse) => void;
  onDelete: (trip: ITripResponse) => void;
  onView: (tripId: any) => void;
}

const TripCard = React.memo(({ trip, onEdit, onDelete, onView }: TripCardProps) => {
  const { formattedStartDate, formattedEndDate, duration } = useMemo(() => {
    const formatDate = (date: Date | string) => {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };

    const calculateDuration = (startDate: Date | string, endDate: Date | string) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    return {
      formattedStartDate: formatDate(trip.startDate),
      formattedEndDate: formatDate(trip.endDate),
      duration: calculateDuration(trip.startDate, trip.endDate)
    };
  }, [trip.startDate, trip.endDate]);

  const handleCardClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('button')) {
      onView(trip._id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(trip);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(trip);
  };

  return (
    <Card 
      onClick={handleCardClick}
      className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border"
      style={{ 
        backgroundColor: colors.surface,
        borderColor: colors.border
      }}
    >
      {/* Gradient Header */}
      <div 
        className="relative h-32 p-6 flex flex-col justify-between overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
        }}
      >
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white mb-1 truncate">
              {trip.tripName}
            </h3>
            <div className="flex items-center gap-1.5 text-white/90 text-sm">
              <MapPin size={14} className="flex-shrink-0" />
              <span className="truncate">{trip.destination}</span>
            </div>
          </div>
          
          {/* Duration Badge */}
          <div 
            className="px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex-shrink-0"
            style={{ 
              backgroundColor: colors.accent,
              color: colors.surface 
            }}
          >
            {duration} {duration === 1 ? 'day' : 'days'}
          </div>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-6 space-y-4">
        {/* Description */}
        {trip.tripDescription && (
          <p 
            className="text-sm line-clamp-2 leading-relaxed min-h-[2.5rem]"
            style={{ color: colors.textMuted }}
          >
            {trip.tripDescription}
          </p>
        )}

        {/* Date Info */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: colors.textMuted }}>
              Start Date
            </span>
            <div className="flex items-center gap-1.5" style={{ color: colors.textMain }}>
              <Calendar size={14} />
              <span className="text-sm font-semibold">{formattedStartDate}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: colors.textMuted }}>
              End Date
            </span>
            <div className="flex items-center gap-1.5" style={{ color: colors.textMain }}>
              <Calendar size={14} />
              <span className="text-sm font-semibold">{formattedEndDate}</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t pt-4" style={{ borderColor: colors.border }} />

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2 cursor-pointer transition-all duration-200"
            onClick={handleEdit}
            style={{ 
              borderColor: colors.border,
              color: colors.primary 
            }}
          >
            <Edit2 size={14} />
            <span className="font-medium">Edit</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2 cursor-pointer transition-all duration-200"
            onClick={handleDelete}
            style={{ 
              borderColor: colors.border,
              color: '#DC2626'
            }}
          >
            <Trash2 size={14} />
            <span className="font-medium">Delete</span>
          </Button>
        </div>
      </CardContent>

      {/* Hover Effect Overlay */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}03 0%, ${colors.secondary}03 100%)`
        }}
      />
    </Card>
  );
});

TripCard.displayName = 'TripCard';

export default TripCard;