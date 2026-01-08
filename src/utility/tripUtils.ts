/**
 * Calculate the duration of a trip in days
 * @param startDate - The start date of the trip (Date object or string)
 * @param endDate - The end date of the trip (Date object or string)
 * @returns The number of days in the trip (inclusive of both start and end dates)
 */
export const calculateTripDuration = (startDate: Date | string, endDate: Date | string): number => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
}

/**
 * Check if a day number exceeds the trip duration
 * @param dayNumber - The day number to check
 * @param tripDuration - The total duration of the trip in days
 * @returns true if the day number exceeds the trip duration, false otherwise
 */
export const exceedsTripDuration = (dayNumber: number, tripDuration: number): boolean => {
    return tripDuration > 0 && dayNumber > tripDuration
}
