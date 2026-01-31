'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getPoolCount } from '@/services/activityPoolService';
import { useAuth } from '@/context/AuthContext';

interface ActivityPoolContextType {
  poolCount: number;
  refreshPoolCount: () => Promise<void>;
  incrementPoolCount: () => void;
  decrementPoolCount: () => void;
  setPoolCount: (count: number) => void;
}

const ActivityPoolContext = createContext<ActivityPoolContextType | undefined>(undefined);

export function ActivityPoolProvider({ children }: { children: React.ReactNode }) {
  const [poolCount, setPoolCount] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch initial pool count
  const refreshPoolCount = useCallback(async () => {
    if (!isAuthenticated) {
      setPoolCount(0);
      return;
    }
    
    try {
      const count = await getPoolCount();
      setPoolCount(count);
    } catch (error) {
      console.error('Error fetching pool count:', error);
      setPoolCount(0);
    }
  }, [isAuthenticated]);

  // Increment pool count (optimistic update)
  const incrementPoolCount = useCallback(() => {
    setPoolCount((prev) => prev + 1);
  }, []);

  // Decrement pool count (optimistic update)
  const decrementPoolCount = useCallback(() => {
    setPoolCount((prev) => Math.max(0, prev - 1));
  }, []);

  // Initialize pool count on mount or when authentication changes
  useEffect(() => {
    if (!isInitialized || isAuthenticated) {
      refreshPoolCount();
      setIsInitialized(true);
    } else if (!isAuthenticated) {
      // Reset pool count when user logs out
      setPoolCount(0);
    }
  }, [isAuthenticated, isInitialized, refreshPoolCount]);

  const value = {
    poolCount,
    refreshPoolCount,
    incrementPoolCount,
    decrementPoolCount,
    setPoolCount,
  };

  return (
    <ActivityPoolContext.Provider value={value}>
      {children}
    </ActivityPoolContext.Provider>
  );
}

export function useActivityPoolContext() {
  const context = useContext(ActivityPoolContext);
  if (context === undefined) {
    throw new Error('useActivityPoolContext must be used within an ActivityPoolProvider');
  }
  return context;
}
