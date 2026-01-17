'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { Search, Loader2, MapPin, X } from 'lucide-react';
import { colors } from '@/constants/colors';
import { SearchSuggestion } from '@/types/explore';

interface SearchBarProps {
  onSearch: (query: string, coordinates?: { lat: number; lng: number }) => void;
  isLoading: boolean;
  placeholder?: string;
  sticky?: boolean;
}

/**
 * Enhanced search bar with autocomplete suggestions
 */
export function SearchBar({ onSearch, isLoading, placeholder, sticky = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch autocomplete suggestions
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        // Using Nominatim for free geocoding
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
        );
        const data = await response.json();
        
        const formattedSuggestions: SearchSuggestion[] = data.map((item: any) => ({
          name: item.name || item.display_name.split(',')[0],
          address: item.display_name,
          coordinates: {
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
          },
        }));
        
        setSuggestions(formattedSuggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.name);
    onSearch(suggestion.name, suggestion.coordinates);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault();
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className={`w-full max-w-3xl mx-auto ${sticky ? 'sticky top-4 z-20' : ''}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none" 
            style={{ color: colors.textMuted }} 
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || 'Search city, place, or landmark...'}
            className="w-full pl-12 pr-12 py-4 rounded-xl border-2 transition-all shadow-lg focus:shadow-xl text-lg"
            style={{
              borderColor: query ? colors.primary : colors.border,
              backgroundColor: colors.surface,
              color: colors.textMain,
            }}
            disabled={isLoading}
          />
          {query && !isLoading && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setShowSuggestions(false);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="h-4 w-4" style={{ color: colors.textMuted }} />
            </button>
          )}
          {isLoading && (
            <Loader2 
              className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin" 
              style={{ color: colors.primary }} 
            />
          )}
        </div>

        {/* Autocomplete suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute w-full mt-2 rounded-lg shadow-xl overflow-hidden z-30"
            style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}` }}
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left flex items-start gap-3 transition-colors"
                style={{
                  backgroundColor: index === selectedIndex ? colors.primaryLight : 'transparent',
                  color: colors.textMain,
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: colors.primary }} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{suggestion.name}</div>
                  <div className="text-sm truncate" style={{ color: colors.textMuted }}>
                    {suggestion.address}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Quick suggestions */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <span className="text-sm text-gray-100">Popular:</span>
        {['Mumbai', 'Delhi', 'Jaipur', 'Goa', 'Agra'].map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => {
              setQuery(city);
              onSearch(city);
            }}
            disabled={isLoading}
            className="text-sm px-3 py-1 rounded-full transition-all duration-200 hover:scale-105 disabled:opacity-50"
            style={{
              backgroundColor: colors.background,
              color: colors.primary,
              border: `1px solid ${colors.border}`,
            }}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}
