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

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

