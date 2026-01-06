// components/itinerary/ActivityCard.tsx
import React from 'react';
import { IActivity } from '@/types/activity';
import { Clock, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ActivityCardProps {
  activity: IActivity;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActivityTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      sightseeing: 'bg-[#0EA5A4] text-white',
      dining: 'bg-[#F59E0B] text-white',
      transportation: 'bg-[#1E3A8A] text-white',
      accommodation: 'bg-[#475569] text-white',
    };
    return colors[type] || 'bg-[#E5E7EB] text-[#0F172A]';
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border-[#E5E7EB]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-[#0F172A]">
            {activity.title}
          </CardTitle>
          <Badge className={`${getActivityTypeColor(activity.activityType)} capitalize`}>
            {activity.activityType}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {activity.description && (
          <p className="text-sm text-[#475569] leading-relaxed">
            {activity.description}
          </p>
        )}
        
        <div className="space-y-2">
          {activity.location && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-4 h-4 text-[#0EA5A4] mt-0.5 flex-shrink-0" />
              <span className="text-[#475569]">{activity.location}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-[#1E3A8A] flex-shrink-0" />
            <span className="text-[#475569]">
              {formatTime(activity.startTime)} - {formatTime(activity.endTime)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};