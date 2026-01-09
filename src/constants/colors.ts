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
  // Meals
  breakfast: {
    bg: '#FED7AA',
    text: '#C2410C',
  },
  lunch: {
    bg: '#FEF08A',
    text: '#A16207',
  },
  dinner: {
    bg: '#FDE68A',
    text: '#B45309',
  },
  snack: {
    bg: '#FFEDD5',
    text: '#EA580C',
  },
  
  // Rest & Breaks
  sleep: {
    bg: '#E9D5FF',
    text: '#7C3AED',
  },
  break: {
    bg: '#F3E8FF',
    text: '#9333EA',
  },
  relaxation: {
    bg: '#C7D2FE',
    text: '#4F46E5',
  },
  
  // Activities (existing + new)
  sightseeing: {
    bg: colors.secondary,
    text: '#FFFFFF',
  },
  dining: {
    bg: colors.accent,
    text: '#FFFFFF',
  },
  shopping: {
    bg: '#FBCFE8',
    text: '#BE185D',
  },
  entertainment: {
    bg: '#FECDD3',
    text: '#BE123C',
  },
  sports: {
    bg: '#BBF7D0',
    text: '#15803D',
  },
  cultural: {
    bg: '#BFDBFE',
    text: '#1D4ED8',
  },
  adventure: {
    bg: '#A7F3D0',
    text: '#047857',
  },
  nature: {
    bg: '#D9F99D',
    text: '#4D7C0F',
  },
  wellness: {
    bg: '#A5F3FC',
    text: '#0E7490',
  },
  business: {
    bg: '#CBD5E1',
    text: '#475569',
  },
  
  // Logistics (existing)
  transportation: {
    bg: colors.primary,
    text: '#FFFFFF',
  },
  accommodation: {
    bg: colors.textMuted,
    text: '#FFFFFF',
  },
  
  // Other
  other: {
    bg: '#F1F5F9',
    text: '#64748B',
  },
} as const;