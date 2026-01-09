import { buttonGradients } from '@/constants/colors';

/**
 * Get gradient background style for buttons
 * @param variant - The gradient variant to use
 * @param isHover - Whether to use hover gradient
 */
export function getGradientStyle(
  variant: keyof typeof buttonGradients = 'primary',
  isHover: boolean = false
): React.CSSProperties {
  const gradient = buttonGradients[variant];
  const colors = isHover ? gradient.hover : gradient;
  
  return {
    background: `linear-gradient(to right, ${colors.from}, ${colors.to})`,
  };
}

/**
 * Get Tailwind CSS classes for gradient buttons
 */
export const gradientButtonClasses = {
  primary: 'bg-gradient-to-r from-[#1E3A8A] to-[#0EA5A4] hover:from-[#1E40AF] hover:to-[#0D9488]',
  cta: 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309]',
  secondary: 'bg-gradient-to-r from-[#3B82F6] to-[#0EA5A4] hover:from-[#2563EB] hover:to-[#0D9488]',
  create: 'bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857]',
  edit: 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8]',
  delete: 'bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#B91C1C]',
  success: 'bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857]',
  danger: 'bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#B91C1C]',
  warning: 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309]',
  info: 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8]',
  ghost: 'bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20',
  outline: 'bg-transparent border-2 border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white',
  neutral: 'bg-gradient-to-r from-[#6B7280] to-[#4B5563] hover:from-[#4B5563] hover:to-[#374151]',
} as const;

/**
 * Get full button class string with gradient and common styles
 */
export function getButtonClasses(
  variant: keyof typeof gradientButtonClasses = 'primary',
  additionalClasses: string = ''
): string {
  const baseClasses = 'inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer';
  return `${baseClasses} ${gradientButtonClasses[variant]} ${additionalClasses}`.trim();
}
