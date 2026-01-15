'use client';

import { IActivityResponse } from '@/types/activity';
import { MapPin, Trash2, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { activityColors, colors } from '@/constants/colors';
import { ACTIVITY_TYPES, ActivityType } from '@/constants/activityTypes';
import { useState } from 'react';
import { toast } from 'sonner';
import { GradientButton } from '../ui/GradientButton';

interface ActivityPoolCardProps {
  activity: IActivityResponse;
  onRemove: (activityId: string) => Promise<boolean>;
  onAddToDay: (activity: IActivityResponse) => void;
}

export default function ActivityPoolCard({ activity, onRemove, onAddToDay }: ActivityPoolCardProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const activityTypeInfo = ACTIVITY_TYPES[activity.activityType as ActivityType];
  const categoryColor = activityTypeInfo && activityTypeInfo.category
    ? activityColors[activityTypeInfo.category as keyof typeof activityColors]
    : activityColors.other;

  const handleRemove = async () => {
    try {
      setIsRemoving(true);
      const success = await onRemove(activity._id.toString());
      if (success) {
        toast.success('Removed from pool');
      }
    } catch (error) {
      console.error('Error removing activity:', error);
      toast.error('Failed to remove activity');
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 h-full border-2" style={{ borderColor: colors.border, backgroundColor: colors.background }}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-lg line-clamp-2" style={{ color: colors.textMain }}>
            {activity.title}
          </h3>
          <Badge
            className="shrink-0 text-xs font-medium flex items-center gap-1"
            style={{
              backgroundColor: categoryColor.bg,
              color: categoryColor.text,
            }}
          >
            {activityTypeInfo?.emoji} {activityTypeInfo?.label || activity.activityType}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Description */}
        {activity.description && (
          <p className="text-sm line-clamp-2" style={{ color: colors.textMuted }}>
            {activity.description}
          </p>
        )}

        {/* Location */}
        {activity.location && (
          <div className="flex items-center gap-1 text-xs" style={{ color: colors.textMuted }}>
            <MapPin className="h-3 w-3" />
            <span>{activity.location}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <GradientButton
            onClick={() => onAddToDay(activity)}
            className="flex-1"
            size="sm"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Add to Day
          </GradientButton>
          <GradientButton
            onClick={handleRemove}
            disabled={isRemoving}
            variant="delete"
            size="sm"
            className="text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </GradientButton>
        </div>
      </CardContent>
    </Card>
  );
}
