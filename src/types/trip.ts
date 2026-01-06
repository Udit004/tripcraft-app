export interface ITrip {
    _id?: string;
    userId?: string;
    tripName: string;
    tripDescription: string;
    destination: string;
    startDate: Date;
    endDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
}


export interface ITripResponse {
    _id: string;
    userId?: string;
    tripName: string;
    tripDescription: string;
    destination: string;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateTripRequest {
    tripName: string;
    tripDescription: string;
    destination: string;
    startDate: Date;
    endDate: Date;
}

export interface ITripApiResponse {
    success: boolean;
    message: string;
    trip?: ITripResponse;
    trips?: ITripResponse[];
}