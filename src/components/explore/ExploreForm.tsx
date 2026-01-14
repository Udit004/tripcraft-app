'use client';

import { useState, FormEvent } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getButtonClasses } from '@/lib/buttonStyles';
import { colors } from '@/constants/colors';
import { GradientButton } from '../ui/GradientButton';

interface ExploreFormProps {
  onSearch: (destination: string) => void;
  isLoading: boolean;
}

/**
 * Search form component for exploring destinations
 */
export default function ExploreForm({ onSearch, isLoading }: ExploreFormProps) {
  const [destination, setDestination] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (destination.trim().length === 0) {
      return;
    }

    onSearch(destination.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: colors.textMuted }} />
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter a city or destination (e.g., London, Paris, Tokyo)"
            className="w-full pl-12 pr-4 py-3 rounded-lg border-2 transition-all"
            style={{
              borderColor: destination ? colors.primary : colors.border,
              backgroundColor: colors.surface,
              color: colors.textMain,
            }}
            disabled={isLoading}
          />
        </div>
        
        <GradientButton
          type="submit"
          disabled={isLoading || destination.trim().length === 0}
          className={getButtonClasses('primary', 'px-8 py-3 h-auto')}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" />
              Explore
            </>
          )}
        </GradientButton>
      </div>
      
      {/* Quick suggestions */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <span className="text-sm" style={{ color: colors.textMuted }}>Try:</span>
        {['London', 'Paris', 'Tokyo', 'New York', 'Dubai'].map((city) => (
          <Button
            key={city}
            type="button"
            onClick={() => {
              setDestination(city);
              onSearch(city);
            }}
            disabled={isLoading}
            className="text-sm px-3 py-1 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            style={{
              backgroundColor: colors.background,
              color: colors.primary,
              border: `1px solid ${colors.border}`,
            }}
          >
            {city}
          </Button>
        ))}
      </div>
    </form>
  );
}
