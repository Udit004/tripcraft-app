/**
 * Detects if activities are ordered incorrectly based on their scheduled times.
 * The function checks if any activity's end time is after the next activity's start time,
 * which would indicate a time conflict in the sequence.
 * 
 * @param activities - Array of activities with startTime and endTime (order is array position)
 * @returns true if there's a mismatch between order and time sequence
 * 
 * @example
 * const activities = [
 *   { startTime: '2024-01-01T09:00:00', endTime: '2024-01-01T10:00:00' },
 *   { startTime: '2024-01-01T08:00:00', endTime: '2024-01-01T09:00:00' } // Earlier time but later in array
 * ];
 * hasOrderTimeMismatch(activities); // returns true
 */
export function hasOrderTimeMismatch(activities: {
  startTime?: string;
  endTime?: string;
}[]): boolean {
  // Activities array already represents the current order
  for (let i = 0; i < activities.length - 1; i++) {
    // Skip if either activity is missing time information
    if (!activities[i].endTime || !activities[i + 1].startTime) {
      continue;
    }

    const currentEnd = new Date(activities[i].endTime!);
    const nextStart = new Date(activities[i + 1].startTime!);

    // If current activity ends after the next one starts, there's a mismatch
    if (currentEnd > nextStart) {
      return true;
    }
  }

  return false;
}

/**
 * Automatically fixes activity order by sorting them based on their startTime.
 * Activities without startTime are placed at the end.
 * 
 * @param activities - Array of activities to reorder
 * @returns New array sorted by startTime
 * 
 * @example
 * const activities = [
 *   { _id: '2', startTime: '2024-01-01T10:00:00', ... },
 *   { _id: '1', startTime: '2024-01-01T09:00:00', ... }
 * ];
 * const sorted = autoFixActivityOrder(activities);
 * // Returns activities sorted chronologically by startTime
 */
export function autoFixActivityOrder<T extends { startTime?: string; [key: string]: any }>(
  activities: T[]
): T[] {
  // Separate activities with and without startTime
  const withTime = activities.filter(a => a.startTime);
  const withoutTime = activities.filter(a => !a.startTime);

  // Sort activities with time by startTime
  const sorted = [...withTime].sort((a, b) => {
    const timeA = new Date(a.startTime!).getTime();
    const timeB = new Date(b.startTime!).getTime();
    return timeA - timeB;
  });

  // Return sorted activities followed by those without time
  return [...sorted, ...withoutTime];
}
