import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (
  dateString: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Format time helper
export const formatTime = (
  dateString: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  });
};

// Extract HH:MM time format from ISO string for time input field
// Converts from UTC to IST by adding 5 hours 30 minutes
export const extractTimeFromISO = (isoString: string): string => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    // Add 5 hours 30 minutes to convert from UTC to IST
    const istDate = new Date(date.getTime() + (5 * 60 * 60 * 1000) + (30 * 60 * 1000));
    const hours = String(istDate.getUTCHours()).padStart(2, '0');
    const minutes = String(istDate.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch {
    return '';
  }
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

