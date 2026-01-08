import { IItineraryDayApiResponse, IItineraryDayRequest, IItineraryDayResponse } from "@/types/itineraryDay";
import apiClient from "./apiClient";
import { ICreateTripRequest, ITripResponse, ITripApiResponse } from "@/types/trip";
import { IActivityResponse } from "@/types/activity";


export const createTrip = async (tripData: ICreateTripRequest): Promise<ITripResponse | null> => {
    try {
        const response = await apiClient.post<ITripApiResponse>('/trip', tripData);
        if (response.data.success && response.data.trip) {
            return response.data.trip;
        }
        return null;
    } catch (error) {
        console.error('Error creating trip:', error);
        throw error;
    }
}

export const getTrips = async (): Promise<ITripResponse[]> => {
    try {
        const response = await apiClient.get<ITripApiResponse>('/trip');
        if (response.data.success && response.data.trips) {
            return response.data.trips;
        }
        return [];
    } catch (error) {
        console.error('Error fetching trips:', error);
        throw error;
    }
};

export const getTripById = async (tripId: string): Promise<ITripResponse | null> => {
    try {
        const response = await apiClient.get<ITripApiResponse>(`/trip/${tripId}`);
        if (response.data.success && response.data.trip) {
            return response.data.trip;
        }
        return null;
    } catch (error) {
        console.error('Error fetching trip by ID:', error);
        throw error;
    }
}

export const updateTrip = async (tripId: string, tripData: ICreateTripRequest): Promise<ITripResponse | null> => {
    try {
        const response = await apiClient.put<ITripApiResponse>(`/trip/${tripId}`, tripData);
        if (response.data.success && response.data.trip) {
            return response.data.trip;
        }
        return null;
    } catch (error) {
        console.error('Error updating trip:', error);
        throw error;
    }
}

// delete trip
export const deleteTrip = async (tripId: string): Promise<{ success: boolean; message: string; deletionLogId: string; undoWindowSeconds: number } | false> => {
    try {
        const response = await apiClient.delete<ITripApiResponse>(`/trip/${tripId}`);
        if (response.data.success) {
            return {
                success: response.data.success,
                message: response.data.message,
                deletionLogId: (response.data as any).deletionLogId,
                undoWindowSeconds: (response.data as any).undoWindowSeconds,
            };
        }
        return false;
    } catch (error) {
        console.error('Error deleting trip:', error);
        throw error;
    }
}   


// Itinerary Day Services
export const CreateItineraryDay = async (dayData: IItineraryDayRequest): Promise<IItineraryDayResponse> => {
    try {
        const response = await apiClient.post<IItineraryDayApiResponse>(`/trip/${dayData.tripId}/day`, dayData);
        console.log('CreateItineraryDay response:', response.data);

        // API returns 'itinerary' not 'itineraryDay'
        const itineraryDay = response.data.itinerary;

        if (response.data.success && itineraryDay) {
            return itineraryDay as IItineraryDayResponse;
        }

        throw new Error(response.data.error || 'Failed to create itinerary day');
    } catch (error) {
        console.error('Error creating itinerary day:', error);
        throw error;
    }
}

export const getItineraryDays = async (tripId: string): Promise<IItineraryDayResponse[]> => {
    try {
        const response = await apiClient.get<IItineraryDayApiResponse>(`/trip/${tripId}/day`);
        if (response.data.success && response.data.itineraries) {
            return response.data.itineraries;
        }
        return [];
    } catch (error) {
        console.error('Error fetching itinerary days:', error);
        throw error;
    }
};

export const getItineraryDayById = async (tripId: string, dayId: string): Promise<IItineraryDayResponse | null> => {
    try {
        const response = await apiClient.get<IItineraryDayApiResponse>(`/trip/${tripId}/day/${dayId}`);
        if (response.data.success && response.data.itineraries) {
            const combineData = {
                ...response.data.itineraries[0],
                activities: response.data.activities || []
            }
            return combineData;
        }
        return null;
    } catch (error) {
        console.error('Error fetching itinerary day by ID:', error);
        throw error;
    }
};

export const updateItineraryDay = async (tripId: string, dayId: string, dayData: Omit<IItineraryDayRequest, 'tripId'>): Promise<IItineraryDayResponse> => {
    try {
        const response = await apiClient.put<IItineraryDayApiResponse>(`/trip/${tripId}/day/${dayId}`, dayData);
        
        const itinerary = response.data.itinerary || response.data.itineraries?.[0];
        
        if (response.data.success && itinerary) {
            return itinerary as IItineraryDayResponse;
        }
        
        throw new Error(response.data.error || 'Failed to update itinerary day');
    } catch (error) {
        console.error('Error updating itinerary day:', error);
        throw error;
    }
}

export const deleteItineraryDay = async (tripId: string, dayId: string): Promise<{ success: boolean; deletionLogId?: string; undoWindowSeconds?: number }> => {
    try {
        const response = await apiClient.delete<IItineraryDayApiResponse>(`/trip/${tripId}/day/${dayId}`);
        return {
            success: response.data.success,
            deletionLogId: (response.data as any).deletionLogId,
            undoWindowSeconds: (response.data as any).undoWindowSeconds,
        };
    } catch (error) {
        console.error('Error deleting itinerary day:', error);
        throw error;
    }
}

// Undo deletion
export const undoDeletion = async (deletionLogId: string): Promise<boolean> => {
    try {
        const response = await apiClient.post<{ success: boolean; message: string }>('/undo', { deletionLogId });
        return response.data.success;
    } catch (error) {
        console.error('Error undoing deletion:', error);
        throw error;
    }
}
    


// activity services

export const addActivityToItineraryDay = async (tripId: string, dayId: string, activityData: IActivityResponse): Promise<IItineraryDayResponse> => {
    try {
        const response = await apiClient.post<IItineraryDayApiResponse>(`/trip/${tripId}/day/${dayId}/activity`, activityData);
        console.log('addActivityToItineraryDay response:', response.data);
        
        // Check different possible response structures
        const itinerary = response.data.itinerary || response.data.itineraries?.[0];
        
        if (response.data.success && itinerary) {
            return itinerary as IItineraryDayResponse;
        }
        
        // If success is true even without explicit itinerary, check if activity was returned
        if (response.status === 201 || response.status === 200) {
            console.log('Activity added successfully');
            // Return a minimal response if we have success
            return itinerary || response.data as unknown as IItineraryDayResponse;
        }
        
        throw new Error(response.data.error || 'Failed to add activity to itinerary day');
    } catch (error) {
        console.error('Error adding activity to itinerary day:', error);
        throw error;
    }
}

export const deleteActivity = async (tripId: string, dayId: string, activityId: string): Promise<boolean> => {
    try {
        const response = await apiClient.delete<IItineraryDayApiResponse>(`/trip/${tripId}/day/${dayId}/activity/${activityId}`);
        return response.data.success;
    } catch (error) {
        console.error('Error deleting activity:', error);
        throw error;
    }
}

export const updateActivity = async (tripId: string, dayId: string, activityId: string, data: any): Promise<boolean> => {
    try {
        const response = await apiClient.put<IItineraryDayApiResponse>(`/trip/${tripId}/day/${dayId}/activity/${activityId}`, data);
        return response.data.success;
    } catch (error) {
        console.error('Error updating activity:', error);
        throw error;
    }
}

export const updateActivityOrder = async (tripId: string, dayId: string, activityIds: string[]): Promise<IItineraryDayResponse> => {
    try {
        const response = await apiClient.put<IItineraryDayApiResponse>(
            `/trip/${tripId}/day/${dayId}/activities/reorder`, 
            { activityIds }
        );
        if (response.data.success && response.data.itinerary) {
            return response.data.itinerary;
        }
        throw new Error('Failed to update activity order');
    } catch (error) {
        console.error('Error updating activity order:', error);
        throw error;
    }
}


