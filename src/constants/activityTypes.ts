/**
 * Activity Type Constants and Metadata
 * Central source of truth for all activity types in the application
 */

export const ACTIVITY_TYPES = {
  // Meals
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack',
  
  // Rest & Breaks
  SLEEP: 'sleep',
  BREAK: 'break',
  RELAXATION: 'relaxation',
  
  // Activities (existing)
  SIGHTSEEING: 'sightseeing',
  DINING: 'dining',
  
  // Logistics (existing)
  TRANSPORTATION: 'transportation',
  ACCOMMODATION: 'accommodation',
  
  // Additional common types
  SHOPPING: 'shopping',
  ENTERTAINMENT: 'entertainment',
  SPORTS: 'sports',
  CULTURAL: 'cultural',
  ADVENTURE: 'adventure',
  NATURE: 'nature',
  WELLNESS: 'wellness',
  BUSINESS: 'business',
  OTHER: 'other',
} as const;

// Type for activity type values
export type ActivityType = typeof ACTIVITY_TYPES[keyof typeof ACTIVITY_TYPES];

// Activity type metadata with emojis, labels, colors, and descriptions
export interface ActivityTypeMetadata {
  value: ActivityType;
  label: string;
  emoji: string;
  category: 'meals' | 'rest' | 'activities' | 'logistics' | 'other';
  description: string;
  colorClass: string; // Tailwind classes for consistent styling
}

export const ACTIVITY_TYPE_METADATA: Record<ActivityType, ActivityTypeMetadata> = {
  // Meals
  [ACTIVITY_TYPES.BREAKFAST]: {
    value: ACTIVITY_TYPES.BREAKFAST,
    label: 'Breakfast',
    emoji: '🍳',
    category: 'meals',
    description: 'Morning meal',
    colorClass: 'bg-orange-100 text-orange-700 border-orange-200',
  },
  [ACTIVITY_TYPES.LUNCH]: {
    value: ACTIVITY_TYPES.LUNCH,
    label: 'Lunch',
    emoji: '🍱',
    category: 'meals',
    description: 'Midday meal',
    colorClass: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  },
  [ACTIVITY_TYPES.DINNER]: {
    value: ACTIVITY_TYPES.DINNER,
    label: 'Dinner',
    emoji: '🍽️',
    category: 'meals',
    description: 'Evening meal',
    colorClass: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  [ACTIVITY_TYPES.SNACK]: {
    value: ACTIVITY_TYPES.SNACK,
    label: 'Snack',
    emoji: '🍿',
    category: 'meals',
    description: 'Light refreshment',
    colorClass: 'bg-orange-50 text-orange-600 border-orange-100',
  },
  
  // Rest & Breaks
  [ACTIVITY_TYPES.SLEEP]: {
    value: ACTIVITY_TYPES.SLEEP,
    label: 'Sleep / Rest',
    emoji: '😴',
    category: 'rest',
    description: 'Sleep or overnight rest',
    colorClass: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  [ACTIVITY_TYPES.BREAK]: {
    value: ACTIVITY_TYPES.BREAK,
    label: 'Break',
    emoji: '☕',
    category: 'rest',
    description: 'Short break or coffee',
    colorClass: 'bg-purple-50 text-purple-600 border-purple-100',
  },
  [ACTIVITY_TYPES.RELAXATION]: {
    value: ACTIVITY_TYPES.RELAXATION,
    label: 'Relaxation',
    emoji: '🧘',
    category: 'rest',
    description: 'Leisure and relaxation time',
    colorClass: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  },
  
  // Activities
  [ACTIVITY_TYPES.SIGHTSEEING]: {
    value: ACTIVITY_TYPES.SIGHTSEEING,
    label: 'Sightseeing',
    emoji: '🗺️',
    category: 'activities',
    description: 'Tourist attractions and landmarks',
    colorClass: 'bg-teal-100 text-teal-700 border-teal-200',
  },
  [ACTIVITY_TYPES.DINING]: {
    value: ACTIVITY_TYPES.DINING,
    label: 'Dining',
    emoji: '🍴',
    category: 'activities',
    description: 'Restaurant or dining experience',
    colorClass: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  [ACTIVITY_TYPES.SHOPPING]: {
    value: ACTIVITY_TYPES.SHOPPING,
    label: 'Shopping',
    emoji: '🛍️',
    category: 'activities',
    description: 'Shopping and markets',
    colorClass: 'bg-pink-100 text-pink-700 border-pink-200',
  },
  [ACTIVITY_TYPES.ENTERTAINMENT]: {
    value: ACTIVITY_TYPES.ENTERTAINMENT,
    label: 'Entertainment',
    emoji: '🎭',
    category: 'activities',
    description: 'Shows, concerts, events',
    colorClass: 'bg-rose-100 text-rose-700 border-rose-200',
  },
  [ACTIVITY_TYPES.SPORTS]: {
    value: ACTIVITY_TYPES.SPORTS,
    label: 'Sports',
    emoji: '⚽',
    category: 'activities',
    description: 'Sports and physical activities',
    colorClass: 'bg-green-100 text-green-700 border-green-200',
  },
  [ACTIVITY_TYPES.CULTURAL]: {
    value: ACTIVITY_TYPES.CULTURAL,
    label: 'Cultural',
    emoji: '🏛️',
    category: 'activities',
    description: 'Museums, galleries, cultural sites',
    colorClass: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  [ACTIVITY_TYPES.ADVENTURE]: {
    value: ACTIVITY_TYPES.ADVENTURE,
    label: 'Adventure',
    emoji: '🏔️',
    category: 'activities',
    description: 'Adventure and outdoor activities',
    colorClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  [ACTIVITY_TYPES.NATURE]: {
    value: ACTIVITY_TYPES.NATURE,
    label: 'Nature',
    emoji: '🌳',
    category: 'activities',
    description: 'Parks, nature, and wildlife',
    colorClass: 'bg-lime-100 text-lime-700 border-lime-200',
  },
  [ACTIVITY_TYPES.WELLNESS]: {
    value: ACTIVITY_TYPES.WELLNESS,
    label: 'Wellness',
    emoji: '💆',
    category: 'activities',
    description: 'Spa, massage, wellness',
    colorClass: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  },
  [ACTIVITY_TYPES.BUSINESS]: {
    value: ACTIVITY_TYPES.BUSINESS,
    label: 'Business',
    emoji: '💼',
    category: 'other',
    description: 'Business meetings and work',
    colorClass: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  
  // Logistics
  [ACTIVITY_TYPES.TRANSPORTATION]: {
    value: ACTIVITY_TYPES.TRANSPORTATION,
    label: 'Transportation',
    emoji: '🚗',
    category: 'logistics',
    description: 'Travel between locations',
    colorClass: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  },
  [ACTIVITY_TYPES.ACCOMMODATION]: {
    value: ACTIVITY_TYPES.ACCOMMODATION,
    label: 'Accommodation',
    emoji: '🏨',
    category: 'logistics',
    description: 'Hotel check-in/check-out',
    colorClass: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  
  // Other
  [ACTIVITY_TYPES.OTHER]: {
    value: ACTIVITY_TYPES.OTHER,
    label: 'Other',
    emoji: '📌',
    category: 'other',
    description: 'Other activities',
    colorClass: 'bg-gray-50 text-gray-600 border-gray-100',
  },
};

// Grouped activity types for better UX
export const ACTIVITY_TYPE_GROUPS = {
  meals: {
    label: 'Meals & Food',
    types: [
      ACTIVITY_TYPES.BREAKFAST,
      ACTIVITY_TYPES.LUNCH,
      ACTIVITY_TYPES.DINNER,
      ACTIVITY_TYPES.SNACK,
      ACTIVITY_TYPES.DINING,
    ],
  },
  rest: {
    label: 'Rest & Breaks',
    types: [
      ACTIVITY_TYPES.SLEEP,
      ACTIVITY_TYPES.BREAK,
      ACTIVITY_TYPES.RELAXATION,
    ],
  },
  activities: {
    label: 'Activities',
    types: [
      ACTIVITY_TYPES.SIGHTSEEING,
      ACTIVITY_TYPES.SHOPPING,
      ACTIVITY_TYPES.ENTERTAINMENT,
      ACTIVITY_TYPES.SPORTS,
      ACTIVITY_TYPES.CULTURAL,
      ACTIVITY_TYPES.ADVENTURE,
      ACTIVITY_TYPES.NATURE,
      ACTIVITY_TYPES.WELLNESS,
    ],
  },
  logistics: {
    label: 'Logistics',
    types: [
      ACTIVITY_TYPES.TRANSPORTATION,
      ACTIVITY_TYPES.ACCOMMODATION,
    ],
  },
  other: {
    label: 'Other',
    types: [
      ACTIVITY_TYPES.BUSINESS,
      ACTIVITY_TYPES.OTHER,
    ],
  },
} as const;

// Helper to check if an activity type is a meal
export function isMealType(activityType: string): boolean {
  const mealTypes = ACTIVITY_TYPE_GROUPS.meals.types;
  return mealTypes.includes(activityType as ActivityType);
}

// Helper to check if an activity type is a rest/break
export function isRestType(activityType: string): boolean {
  const restTypes = ACTIVITY_TYPE_GROUPS.rest.types;
  return restTypes.includes(activityType as ActivityType);
}

// Helper to get metadata for a specific activity type
export function getActivityTypeMetadata(activityType: string): ActivityTypeMetadata | null {
  return ACTIVITY_TYPE_METADATA[activityType as ActivityType] || null;
}

// Get all valid activity type values as an array
export const VALID_ACTIVITY_TYPES = Object.values(ACTIVITY_TYPES);
