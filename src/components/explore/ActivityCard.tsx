'use client';

import { ExploreActivity } from '@/types/activity';
import { MapPin, Star, Plus, Check } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { activityColors, colors } from '@/constants/colors';
import { addToPool } from '@/services/activityPoolService';
import { toast } from 'sonner';
import { useState } from 'react';
import { GradientButton,} from '../ui/GradientButton';

interface ActivityCardProps {
  activity: ExploreActivity;
  onAddToPool?: (activity: ExploreActivity) => void;
}

/**
 * Individual activity card component
 * Displays a single tourist attraction with details
 */
export default function ActivityCard({ activity, onAddToPool }: ActivityCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToPool = async () => {
    try {
      setIsAdding(true);
      await addToPool(activity);
      setIsAdded(true);
      toast.success('Added to your activity pool!');
      onAddToPool?.(activity);
      
      // Reset after 2 seconds
      setTimeout(() => setIsAdded(false), 2000);
    } catch (error: unknown) {
      console.error('Error adding to pool:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const responseError = error as { response?: { status?: number } };
        if (responseError.response?.status === 409) {
          toast.error('Activity already in your pool');
        } else {
          toast.error('Failed to add to pool. Please try again.');
        }
      } else {
        toast.error('Failed to add to pool. Please try again.');
      }
    } finally {
      setIsAdding(false);
    }
  };

  // Category colors mapping
  const categoryColorMap: Record<string, { bg: string; text: string }> = {
    nature: activityColors.nature,
    culture: activityColors.cultural,
    sightseeing: activityColors.sightseeing,
    general: activityColors.other,
  };

  // Confidence badge styling
  const confidenceStyles: Record<string, { bg: string; text: string; border: string }> = {
    high: { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
    medium: { bg: '#FEF3C7', text: '#78350F', border: '#FCD34D' },
    low: { bg: '#F3F4F6', text: '#4B5563', border: '#D1D5DB' },
  };

  const catColor = categoryColorMap[activity.category] || categoryColorMap.general;
  const confStyle = confidenceStyles[activity.confidence];

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 h-full border-2 flex flex-col" style={{ borderColor: colors.border }}>
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-lg line-clamp-2" style={{ color: colors.textMain }}>
            {activity.title}
          </h3>
          <Badge 
            variant="outline"
            className="shrink-0 text-xs font-medium flex items-center gap-1"
            style={{
              backgroundColor: confStyle.bg,
              color: confStyle.text,
              borderColor: confStyle.border,
            }}
          >
            <Star className="h-3 w-3" />
            {activity.confidence}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 flex-1 flex flex-col">
        {/* Content Area */}
        <div className="flex-1">
          {/* Description */}
          <p className="text-sm line-clamp-2" style={{ color: colors.textMuted }}>
            {activity.description}
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-2 flex-wrap mt-3">
            {/* Category */}
            <Badge
              className="text-xs font-medium"
              style={{
                backgroundColor: catColor.bg,
                color: catColor.text,
              }}
            >
              {activity.category}
            </Badge>

            {/* Location */}
            <div className="flex items-center gap-1 text-xs" style={{ color: colors.textMuted }}>
              <MapPin className="h-3 w-3" />
              <span>{activity.location}</span>
            </div>
          </div>
        </div>

        {/* Add to Pool Button - Always at Bottom */}
        <GradientButton
          onClick={handleAddToPool}
          disabled={isAdding || isAdded}
          className="w-full mt-4"
          variant={isAdded ? "primary" : "secondary"}
          size="sm"
        >
          {isAdded ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Added to Pool
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              {isAdding ? 'Adding...' : 'Add to Pool'}
            </>
          )}
        </GradientButton>
      </CardContent>
    </Card>
  );
}
