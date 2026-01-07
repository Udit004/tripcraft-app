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


