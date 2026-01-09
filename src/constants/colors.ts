// constants/colors.ts
export const colors = {
  primary: '#1E3A8A',      // Deep Indigo/Blue
  secondary: '#0EA5A4',    // Teal
  accent: '#F59E0B',       // Amber
  background: '#F8FAFC',   // Soft off-white
  surface: '#FFFFFF',      // White
  border: '#E5E7EB',       // Light gray
  textMain: '#0F172A',     // Dark blue-gray
  textMuted: '#475569',    // Medium gray
} as const;

export const buttonGradients = {
  primary: {
    from: '#1E3A8A',       // Deep Indigo
    to: '#0EA5A4',         // Teal
    hover: {
      from: '#1E40AF',     // Lighter Indigo
      to: '#0D9488',       // Darker Teal
    }
  },
  cta: {
    from: '#F59E0B',       // Amber
    to: '#D97706',         // Darker Amber
    hover: {
      from: '#D97706',     // Darker Amber
      to: '#B45309',       // Even Darker Amber
    }
  },
  secondary: {
    from: '#3B82F6',       // Blue
    to: '#0EA5A4',         // Teal
    hover: {
      from: '#2563EB',     // Darker Blue
      to: '#0D9488',       // Darker Teal
    }
  }
} as const;

export const activityColors = {
  sightseeing: {
    bg: colors.secondary,
    text: '#FFFFFF',
  },
  dining: {
    bg: colors.accent,
    text: '#FFFFFF',
  },
  transportation: {
    bg: colors.primary,
    text: '#FFFFFF',
  },
  accommodation: {
    bg: colors.textMuted,
    text: '#FFFFFF',
  },
} as const;