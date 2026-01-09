import React from 'react';
import { gradientButtonClasses } from '@/lib/buttonStyles';

export type ButtonVariant = keyof typeof gradientButtonClasses;
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-10 py-5 text-xl',
};

export const GradientButton: React.FC<GradientButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  fullWidth = false,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`${baseClasses} ${gradientButtonClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

// Link version for Next.js
interface GradientLinkProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href: string;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const GradientLink: React.FC<GradientLinkProps> = ({
  variant = 'primary',
  size = 'md',
  href,
  children,
  className = '',
  fullWidth = false,
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer';
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <a
      href={href}
      className={`${baseClasses} ${gradientButtonClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`.trim()}
    >
      {children}
    </a>
  );
};
