// components/dashboard/ModalWrapper.tsx
import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { colors } from '@/constants/colors';

interface ModalWrapperProps {
  children: React.ReactNode;
  onClose: () => void;
}

const ModalWrapper = React.memo(({ children, onClose }: ModalWrapperProps) => {
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [handleEscape]);

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative max-w-xl w-full mt-40 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        
        <button
          onClick={onClose}
          className="absolute top-12 right-6 p-2 rounded-full transition-all duration-200 hover:scale-110 cursor-pointer"
          style={{ 
            backgroundColor: colors.surface,
            color: colors.textMuted
          }}
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
});

ModalWrapper.displayName = 'ModalWrapper';

export default ModalWrapper;