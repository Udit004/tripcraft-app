'use client';

import { LegacyExploreActivity as OldExploreActivity } from '@/types/activity';
import { ExploreActivity } from '@/types/explore';
import { MapPin, Star, Plus, Check, Navigation } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { activityColors, colors } from '@/constants/colors';
import { addToPool } from '@/services/activityPoolService';
import { toast } from 'sonner';
import { useState } from 'react';
import { GradientButton } from '../ui/GradientButton';
import { Button } from '../ui/button';
import Image from 'next/image';

interface ActivityCardProps {
  activity: ExploreActivity | OldExploreActivity;
  onAddToPool?: (activity: ExploreActivity | OldExploreActivity) => void;
  onClick?: () => void;
  onSave?: () => void;
  onHover?: (isHovering: boolean) => void;
  isHighlighted?: boolean;
  isSaved?: boolean;
}

/**
 * Individual activity card component
 * Displays a single tourist attraction with details
 * Enhanced version supporting both old and new explore activity types
 */
export default function ActivityCard({ 
  activity, 
  onAddToPool, 
  onClick, 
  onSave,
  onHover,
  isHighlighted = false,
  isSaved = false
}: ActivityCardProps) {
  const [isAdding, setIsAdding] = useState(false);

  // Check if this is the new ExploreActivity type
  const isNewType = 'location' in activity && typeof activity.location === 'object';

  const handleAddToPool = async () => {
    // Don't add if already saved
    if (isSaved) {
      toast.info('Already saved to your pool');
      return;
    }

    try {
      setIsAdding(true);
      
      // Handle both old and new types
      if (onSave) {
        // onSave will handle incrementing pool count via useExploreState
        await onSave();
      } else {
        // Direct add to pool (old type) - needs manual increment
        await addToPool(activity as OldExploreActivity);
      }
      
      toast.success('Activity added to your pool');
      onAddToPool?.(activity);
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

  const handleViewOnMap = () => {
    if (onClick) {
      onClick();
    }
  };

  // Category colors mapping
  const categoryColorMap: Record<string, { bg: string; text: string }> = {
    nature: activityColors.nature,
    culture: activityColors.cultural,
    sightseeing: activityColors.sightseeing,
    general: activityColors.other,
    accommodation: { bg: '#DBEAFE', text: '#1E40AF' },
    food: { bg: '#FEF3C7', text: '#92400E' },
    religious: { bg: '#E9D5FF', text: '#6B21A8' },
    attractions: { bg: '#FCE7F3', text: '#9F1239' },
    transport: { bg: '#D1FAE5', text: '#065F46' },
    shopping: { bg: '#FFE4E6', text: '#9F1239' },
  };

  // Confidence badge styling - handle both types
  const confidenceStyles: Record<string, { bg: string; text: string; border: string }> = {
    high: { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
    medium: { bg: '#FEF3C7', text: '#78350F', border: '#FCD34D' },
    low: { bg: '#F3F4F6', text: '#4B5563', border: '#D1D5DB' },
  };

  // Get values based on activity type
  const activityName = isNewType ? (activity as ExploreActivity).name : (activity as OldExploreActivity).title;
  const activityDescription = isNewType 
    ? (activity as ExploreActivity).description 
    : (activity as OldExploreActivity).description;
  const activityCategory = activity.category;
  const activityRating = isNewType ? (activity as ExploreActivity).rating : undefined;
  const activityConfidence = !isNewType ? (activity as OldExploreActivity).confidence : undefined;
  const activityLocation = isNewType 
    ? (activity as ExploreActivity).address 
    : (activity as OldExploreActivity).location;
  const activityDistance = isNewType ? (activity as ExploreActivity).distance : undefined;
  const activityImage = isNewType ? (activity as ExploreActivity).imageUrl : undefined;

  const catColor = categoryColorMap[activityCategory] || categoryColorMap.general;
  const confStyle = activityConfidence ? confidenceStyles[activityConfidence] : null;

  return (
    <Card 
      className="hover:shadow-lg transition-all duration-200 h-full border-2 flex flex-col mb-0"
      style={{ 
        borderColor: isHighlighted ? colors.primary : colors.border,
        backgroundColor: isHighlighted ? colors.primaryLight : colors.surface,
      }}
    >
      {activityImage && (
        <div className="w-full h-40 overflow-hidden rounded-t-lg">
          <Image 
            src={activityImage} 
            alt={activityName}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-lg line-clamp-2" style={{ color: colors.textMain }}>
            {activityName}
          </h3>
          {activityRating && (
            <Badge 
              variant="outline"
              className="shrink-0 text-xs font-medium flex items-center gap-1"
              style={{
                backgroundColor: '#FEF3C7',
                color: '#92400E',
                borderColor: '#FCD34D',
              }}
            >
              <Star className="h-3 w-3 fill-current" />
              {activityRating.toFixed(1)}
            </Badge>
          )}
          {activityConfidence && confStyle && (
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
              {activityConfidence}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 flex-1 flex flex-col">
        {/* Content Area */}
        <div className="flex-1">
          {/* Description */}
          {activityDescription && (
            <p className="text-sm line-clamp-2" style={{ color: colors.textMuted }}>
              {activityDescription}
            </p>
          )}

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
              {activityCategory}
            </Badge>

            {/* Location */}
            {activityLocation && (
              <div className="flex items-center gap-1 text-xs" style={{ color: colors.textMuted }}>
                <MapPin className="h-3 w-3" />
                <span className="line-clamp-1">{activityLocation}</span>
              </div>
            )}

            {/* Distance */}
            {activityDistance && (
              <div className="flex items-center gap-1 text-xs" style={{ color: colors.textMuted }}>
                <Navigation className="h-3 w-3" />
                <span>{activityDistance.toFixed(1)} km</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          {/* View on Map Button (for new type) */}
          {isNewType && onClick && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleViewOnMap();
              }}
              variant="outline"
              size="sm"
              className="flex-1 cursor-pointer"
              style={{
                borderColor: colors.border,
                color: colors.primary,
              }}
            >
              <MapPin className="h-4 w-4 mr-2" />
              View on Map
            </Button>
          )}

          {/* Add to Pool Button */}
          <GradientButton
            onClick={(e) => {
              e.stopPropagation();
              handleAddToPool();
            }}
            disabled={isAdding || isSaved}
            className={`${isNewType && onClick ? 'flex-1' : 'w-full'} cursor-pointer`}
            variant={isSaved ? "primary" : "secondary"}
            size="sm"
          >
            {isSaved ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Saved
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                {isAdding ? 'Saving...' : 'Save to Pool'}
              </>
            )}
          </GradientButton>
        </div>
      </CardContent>
    </Card>
  );
}
