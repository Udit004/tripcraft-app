/**
 * Intent-based activity filter constants for Explore page
 */

export const ACTIVITY_FILTERS = [
  {
    id: 'accommodation',
    label: 'Accommodation',
    icon: '🏨',
    categories: ['hotel', 'hostel', 'resort', 'lodging', 'accommodation'],
  },
  {
    id: 'food',
    label: 'Food & Restaurants',
    icon: '🍽️',
    categories: ['restaurant', 'cafe', 'bar', 'food', 'bakery', 'meal_takeaway'],
  },
  {
    id: 'religious',
    label: 'Religious Places',
    icon: '🛕',
    categories: ['church', 'mosque', 'temple', 'synagogue', 'hindu_temple', 'place_of_worship'],
  },
  {
    id: 'nature',
    label: 'Parks & Nature',
    icon: '🌳',
    categories: ['park', 'natural_feature', 'campground', 'rv_park', 'zoo'],
  },
  {
    id: 'attractions',
    label: 'Attractions & Monuments',
    icon: '🏛️',
    categories: ['tourist_attraction', 'museum', 'art_gallery', 'aquarium', 'amusement_park', 'landmark'],
  },
  {
    id: 'transport',
    label: 'Transport',
    icon: '🚉',
    categories: ['airport', 'train_station', 'transit_station', 'bus_station', 'subway_station'],
  },
  {
    id: 'shopping',
    label: 'Shopping',
    icon: '🛍️',
    categories: ['shopping_mall', 'store', 'department_store', 'clothing_store'],
  },
] as const;

export type FilterId = typeof ACTIVITY_FILTERS[number]['id'];
