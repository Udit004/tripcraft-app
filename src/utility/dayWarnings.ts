import { IActivity } from '@/types/activity';

export type DayWarning = {
  id: string;
  type: "packed" | "no-break" | "time-overload";
  severity: "info" | "warning";
  message: string;
};

/**
 * Analyzes activities for a day and returns warnings to help users plan better.
 * This is pure logic with no side effects.
 * 
 * @param activities - Array of activities for the day
 * @returns Array of warnings (empty if no issues detected)
 */
export function analyzeDay(activities: IActivity[]): DayWarning[] {
  const warnings: DayWarning[] = [];

  // Return empty array if no activities
  if (!activities || activities.length === 0) {
    return warnings;
  }

  // 1️⃣ TOO MANY ACTIVITIES WARNING
  // If more than 6 activities, the day might be too packed
  if (activities.length > 6) {
    warnings.push({
      id: 'packed-day',
      type: 'packed',
      severity: 'warning',
      message: 'This day looks quite packed. You may want to move one activity to another day.'
    });
  }

  // 2️⃣ NO BREAK / FOOD / REST WARNING
  // Check if there's at least one activity with type: food, rest, or break
  const hasBreakOrFood = activities.some(activity => {
    const type = activity.activityType.toLowerCase();
    return type === 'food' || type === 'rest' || type === 'break';
  });

  if (!hasBreakOrFood) {
    warnings.push({
      id: 'no-break',
      type: 'no-break',
      severity: 'info',
      message: 'No break or meal is planned for this day. Consider adding one.'
    });
  }

  // 3️⃣ TIME OVERLOAD WARNING (only if duration data exists)
  // Calculate total duration from startTime and endTime
  let totalDurationHours = 0;
  let hasAnyDuration = false;

  activities.forEach(activity => {
    if (activity.startTime && activity.endTime) {
      try {
        const start = new Date(activity.startTime);
        const end = new Date(activity.endTime);
        
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          const durationMs = end.getTime() - start.getTime();
          const durationHours = durationMs / (1000 * 60 * 60);
          
          if (durationHours > 0) {
            totalDurationHours += durationHours;
            hasAnyDuration = true;
          }
        }
      } catch {
        // Skip invalid dates silently
      }
    }
  });

  // Only show this warning if we have duration data and it exceeds 10 hours
  if (hasAnyDuration && totalDurationHours > 10) {
    warnings.push({
      id: 'time-overload',
      type: 'time-overload',
      severity: 'warning',
      message: 'Planned activities may exceed a comfortable day length.'
    });
  }
  
  return warnings;
}
