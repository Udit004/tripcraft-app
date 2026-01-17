import { ActivityType } from "@/constants/activityTypes";
import { LegacyExploreActivity, NewExploreActivity } from "@/types/activity";

/**
 * Maps explore API categories to activity types
 */
export function mapExploreCategoryToActivityType(category: string): ActivityType {
  const mapping: Record<string, ActivityType> = {
    nature: 'nature',
    culture: 'cultural',
    cultural: 'cultural',
    sightseeing: 'sightseeing',
    general: 'other',
    accommodation: 'other',
    food: 'other',
    religious: 'cultural',
    attractions: 'sightseeing',
    transport: 'other',
    shopping: 'other',
  };

  return mapping[category] || 'other';
}

/**
 * Check if activity is legacy format
 */
function isLegacyActivity(activity: any): activity is LegacyExploreActivity {
  return 'title' in activity && 'confidence' in activity;
}

/**
 * Converts an ExploreActivity (legacy or new) to pool activity format
 */
export function convertExploreActivityToPoolActivity(
  exploreActivity: LegacyExploreActivity | NewExploreActivity | any,
  userId: string
): {
  userId: string;
  activityType: ActivityType;
  title: string;
  description: string;
  location: string;
  isInPool: boolean;
} {
  // Handle legacy format
  if (isLegacyActivity(exploreActivity)) {
    return {
      userId,
      activityType: mapExploreCategoryToActivityType(exploreActivity.category),
      title: exploreActivity.title,
      description: exploreActivity.description,
      location: exploreActivity.location,
      isInPool: true,
    };
  }
  
  // Handle new format (from new Explore page)
  return {
    userId,
    activityType: mapExploreCategoryToActivityType(exploreActivity.category || 'general'),
    title: exploreActivity.name || exploreActivity.title || 'Unnamed Place',
    description: exploreActivity.description || '',
    location: exploreActivity.location || exploreActivity.address || '',
    isInPool: true,
  };
}
