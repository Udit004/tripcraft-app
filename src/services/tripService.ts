import { IItineraryDayApiResponse, IItineraryDayRequest, IItineraryDayResponse } from "@/types/itineraryDay";
import apiClient from "./apiClient";
import { ICreateTripRequest, ITripResponse, ITripApiResponse } from "@/types/trip";


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
export const CreateItineraryDay = async (tripId: string, dayData: IItineraryDayRequest): Promise<IItineraryDayResponse> => {
    try {
        const response = await apiClient.post<IItineraryDayApiResponse>(`/trip/${tripId}/day`, dayData);
        if (response.data.success && response.data.itineraryDay) {
            return response.data.itineraryDay;
        }
        throw new Error('Failed to create itinerary day');
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
        if (response.data.success && response.data.itineraryDay) {
            const combineData = {
                ...response.data.itineraryDay,
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

    export const addActivityToItineraryDay = async (tripId: string, dayId: string, activityData: { activityName: string; activityDescription?: string; location?: string; startTime?: Date; endTime?: Date; }): Promise<IItineraryDayResponse> => {
        try {
            const response = await apiClient.post<IItineraryDayApiResponse>(`/trip/${tripId}/day/${dayId}/activity`, activityData);
            if (response.data.success && response.data.itineraryDay) {
                return response.data.itineraryDay;
            }
            throw new Error('Failed to add activity to itinerary day');
        } catch (error) {
            console.error('Error adding activity to itinerary day:', error);
            throw error;
        }
    }


