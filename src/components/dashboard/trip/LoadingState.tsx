// components/dashboard/LoadingState.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';
import { colors } from '@/constants/colors';

const LoadingState = React.memo(() => {
  return (
    <div className="flex flex-col items-center justify-center py-24 animate-in fade-in duration-500">
      <Loader2
        size={48}
        className="animate-spin mb-4"
        style={{ color: colors.primary }}
      />
      <p className="text-base font-medium" style={{ color: colors.textMuted }}>
        Loading your trips...
      </p>
      <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
        This won't take long
      </p>
    </div>
  );
});

LoadingState.displayName = 'LoadingState';

export default LoadingState;