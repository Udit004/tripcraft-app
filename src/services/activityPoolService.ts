import apiClient from "./apiClient";
import { IActivityApiResponse, IActivityResponse, ExploreActivity } from "@/types/activity";

/**
 * Add an explore activity to user's activity pool
 */
export const addToPool = async (exploreActivity: ExploreActivity): Promise<IActivityResponse | null> => {
    try {
        const response = await apiClient.post<IActivityApiResponse>('/user/activity-pool', {
            exploreActivity
        });
        
        if (response.data.success && response.data.activity) {
            return response.data.activity;
        }
        return null;
    } catch (error) {
        console.error('Error adding activity to pool:', error);
        throw error;
    }
};

/**
 * Get all activities in user's pool
 */
export const getPoolActivities = async (): Promise<IActivityResponse[]> => {
    try {
        const response = await apiClient.get<IActivityApiResponse>('/user/activity-pool');
        
        if (response.data.success && response.data.activities) {
            return response.data.activities;
        }
        return [];
    } catch (error) {
        console.error('Error fetching pool activities:', error);
        throw error;
    }
};

/**
 * Remove an activity from the pool
 */
export const removeFromPool = async (activityId: string): Promise<boolean> => {
    try {
        const response = await apiClient.delete<IActivityApiResponse>(
            `/user/activity-pool/${activityId}`
        );
        
        return response.data.success;
    } catch (error) {
        console.error('Error removing activity from pool:', error);
        throw error;
    }
};

/**
 * Move a pool activity to an itinerary day
 */
export const moveActivityToDay = async (
    activityId: string,
    tripId: string,
    dayId: string
): Promise<IActivityResponse | null> => {
    try {
        const response = await apiClient.post<IActivityApiResponse>(
            `/user/activity-pool/${activityId}/add-to-day`,
            { tripId, dayId }
        );
        
        if (response.data.success && response.data.activity) {
            return response.data.activity;
        }
        return null;
    } catch (error) {
        console.error('Error moving activity to day:', error);
        throw error;
    }
};

/**
 * Get the count of activities in user's pool
 */
export const getPoolCount = async (): Promise<number> => {
    try {
        const activities = await getPoolActivities();
        return activities.length;
    } catch (error) {
        console.error('Error getting pool count:', error);
        return 0;
    }
};
