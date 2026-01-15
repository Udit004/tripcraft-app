'use client';

import { IActivityResponse } from '@/types/activity';
import { MapPin, Trash2, Calendar, GripVertical } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { activityColors, colors } from '@/constants/colors';
import { ACTIVITY_TYPE_METADATA, ActivityType } from '@/constants/activityTypes';
import { useState } from 'react';
import { toast } from 'sonner';
import { GradientButton } from '../ui/GradientButton';
import { useDrag } from '@/context/DragContext';

interface DraggablePoolActivityCardProps {
  activity: IActivityResponse;
  onRemove: (activityId: string) => Promise<boolean>;
  onAddToDay: (activity: IActivityResponse) => void;
}

export default function DraggablePoolActivityCard({ 
  activity, 
  onRemove, 
  onAddToDay 
}: DraggablePoolActivityCardProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const { setDraggedActivity, clearDragState, isDragging, draggedActivity } = useDrag();

  const activityTypeInfo = ACTIVITY_TYPE_METADATA[activity.activityType as ActivityType];
  const categoryColor = activityTypeInfo?.category && activityColors[activityTypeInfo.category as keyof typeof activityColors]
    ? activityColors[activityTypeInfo.category as keyof typeof activityColors]
    : activityColors.other || { bg: '#F1F5F9', text: '#64748B' };

  const isBeingDragged = isDragging && draggedActivity?._id === activity._id;

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // Set drag data
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('activityId', activity._id.toString());
    e.dataTransfer.setData('source', 'pool');
    
    // Set drag context
    setDraggedActivity(activity, 'pool');

    // Optional: Create custom drag image
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.opacity = '0.8';
    dragImage.style.transform = 'rotate(2deg)';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDragEnd = () => {
    clearDragState();
  };

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
    <Card 
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`
        hover:shadow-lg transition-all duration-200 h-full border-2 cursor-move
        ${isBeingDragged ? 'opacity-50 scale-95 shadow-2xl' : ''}
      `}
      style={{ 
        borderColor: colors.border, 
        backgroundColor: colors.background 
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          <div className="pt-1 cursor-grab active:cursor-grabbing" style={{ color: colors.textMuted }}>
            <GripVertical className="h-5 w-5" />
          </div>
          
          <div className="flex-1 min-w-0">
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
          </div>
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
