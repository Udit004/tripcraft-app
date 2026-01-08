// lib/toast.ts
import { toast as sonnerToast } from 'sonner';
import { colors } from '@/constants/colors';

export const toast = {
  success: (message: string) => {
    sonnerToast.success(message, {
      style: {
        background: colors.secondary,
        color: '#FFFFFF',
        border: 'none',
      },
    });
  },
  error: (message: string) => {
    sonnerToast.error(message, {
      style: {
        background: '#DC2626', // Red color for errors
        color: '#FFFFFF',
        border: 'none',
      },
    });
  },
  delete: (message: string) => {
    sonnerToast.success(message, {
      style: {
        background: '#DC2626', // Red color for delete actions
        color: '#FFFFFF',
        border: 'none',
      },
    });
  },
  info: (message: string) => {
    sonnerToast.info(message, {
      style: {
        background: colors.primary,
        color: '#FFFFFF',
        border: 'none',
      },
    });
  },
  warning: (message: string) => {
    sonnerToast.warning(message, {
      style: {
        background: colors.accent,
        color: '#FFFFFF',
        border: 'none',
      },
    });
  },
  loading: (message: string) => {
    return sonnerToast.loading(message, {
      style: {
        background: colors.textMuted,
        color: '#FFFFFF',
        border: 'none',
      },
    });
  },
};
