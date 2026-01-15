import { ActivityType } from "@/constants/activityTypes";
import { ExploreActivity } from "@/types/activity";

/**
 * Maps explore API categories to activity types
 */
export function mapExploreCategoryToActivityType(
  category: ExploreActivity['category']
): ActivityType {
  const mapping: Record<ExploreActivity['category'], ActivityType> = {
    nature: 'nature',
    culture: 'cultural',
    sightseeing: 'sightseeing',
    general: 'other',
  };

  return mapping[category] || 'other';
}

/**
 * Converts an ExploreActivity to ICreateActivityRequest format for pool storage
 */
export function convertExploreActivityToPoolActivity(
  exploreActivity: ExploreActivity,
  userId: string
): {
  userId: string;
  activityType: ActivityType;
  title: string;
  description: string;
  location: string;
  isInPool: boolean;
} {
  return {
    userId,
    activityType: mapExploreCategoryToActivityType(exploreActivity.category),
    title: exploreActivity.title,
    description: exploreActivity.description,
    location: exploreActivity.location,
    isInPool: true,
  };
}
