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
