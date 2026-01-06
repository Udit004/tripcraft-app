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