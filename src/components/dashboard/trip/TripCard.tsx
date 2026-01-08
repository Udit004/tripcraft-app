// components/dashboard/TripCard.tsx
import { ITripResponse } from '@/types/trip';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Clock, Edit2, Trash2 } from 'lucide-react';
import { colors } from '@/constants/colors';

interface TripCardProps {
  trip: ITripResponse;
  onEdit: (trip: ITripResponse) => void;
  onDelete: (trip: ITripResponse) => void;
  onView: (tripId: any) => void;
}

export default function TripCard({ trip, onEdit, onDelete, onView }: TripCardProps) {
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

  const duration = calculateDuration(trip.startDate, trip.endDate);

  return (
    <Card 
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest('button')) {
          onView(trip._id);
        }
      }}
      className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0"
      style={{ backgroundColor: colors.surface }}
    >
      {/* Gradient Header */}
      <div 
        className="relative h-32 p-6 flex flex-col justify-between"
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
        }}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">
              {trip.tripName}
            </h3>
            <div className="flex items-center gap-1.5 text-white/90 text-sm">
              <MapPin size={14} />
              <span className="line-clamp-1">{trip.destination}</span>
            </div>
          </div>
          
          {/* Duration Badge */}
          <div 
            className="px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg"
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
            className="text-sm line-clamp-2 leading-relaxed"
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
              <span className="text-sm font-semibold">{formatDate(trip.startDate)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: colors.textMuted }}>
              End Date
            </span>
            <div className="flex items-center gap-1.5" style={{ color: colors.textMain }}>
              <Calendar size={14} />
              <span className="text-sm font-semibold">{formatDate(trip.endDate)}</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t" style={{ borderColor: colors.border }} />

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2 cursor-pointer hover:bg-blue-50"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(trip);
            }}
            style={{ 
              borderColor: colors.border,
              color: colors.primary 
            }}
          >
            <Edit2 size={14} />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2 cursor-pointer hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(trip);
            }}
            style={{ 
              borderColor: colors.border,
              color: '#DC2626'
            }}
          >
            <Trash2 size={14} />
            Delete
          </Button>
        </div>
      </CardContent>

      {/* Hover Effect Overlay */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}05 0%, ${colors.secondary}05 100%)`
        }}
      />
    </Card>
  );
}