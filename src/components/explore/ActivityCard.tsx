'use client';

import { ExploreActivity } from '@/services/exploreService';
import { MapPin, Star } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { activityColors, colors } from '@/constants/colors';

interface ActivityCardProps {
  activity: ExploreActivity;
}

/**
 * Individual activity card component
 * Displays a single tourist attraction with details
 */
export default function ActivityCard({ activity }: ActivityCardProps) {
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
    <Card className="hover:shadow-lg transition-shadow duration-200 h-full border-2" style={{ borderColor: colors.border }}>
      <CardHeader className="pb-3">
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
      
      <CardContent className="space-y-3">
        {/* Description */}
        <p className="text-sm line-clamp-2" style={{ color: colors.textMuted }}>
          {activity.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-2 flex-wrap">
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
      </CardContent>
    </Card>
  );
}
