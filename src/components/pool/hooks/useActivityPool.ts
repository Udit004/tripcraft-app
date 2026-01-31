'use client';

import { useState, useEffect, useCallback } from 'react';
import { IActivityResponse } from '@/types/activity';
import { getPoolActivities, removeFromPool, moveActivityToDay } from '@/services/activityPoolService';
import { useActivityPoolContext } from '@/context/ActivityPoolContext';

export function useActivityPool() {
  const [activities, setActivities] = useState<IActivityResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { decrementPoolCount, refreshPoolCount } = useActivityPoolContext();

  const fetchPoolActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPoolActivities();
      setActivities(data);
    } catch (err) {
      console.error('Error fetching pool activities:', err);
      setError('Failed to fetch pool activities');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRemoveFromPool = useCallback(async (activityId: string) => {
    try {
      const success = await removeFromPool(activityId);
      if (success) {
        setActivities(prev => prev.filter(a => a._id.toString() !== activityId));
        // Update global pool count
        decrementPoolCount();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error removing from pool:', err);
      throw err;
    }
  }, [decrementPoolCount]);

  const handleMoveToDay = useCallback(async (
    activityId: string,
    tripId: string,
    dayId: string
  ) => {
    try {
      const result = await moveActivityToDay(activityId, tripId, dayId);
      if (result) {
        setActivities(prev => prev.filter(a => a._id.toString() !== activityId));
        // Update global pool count
        decrementPoolCount();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error moving activity to day:', err);
      throw err;
    }
  }, [decrementPoolCount]);

  const refreshPool = useCallback(() => {
    fetchPoolActivities();
    // Also refresh global pool count to ensure sync
    refreshPoolCount();
  }, [fetchPoolActivities, refreshPoolCount]);

  useEffect(() => {
    fetchPoolActivities();
  }, [fetchPoolActivities]);

  return {
    activities,
    loading,
    error,
    removeFromPool: handleRemoveFromPool,
    moveToDay: handleMoveToDay,
    refreshPool,
  };
}
