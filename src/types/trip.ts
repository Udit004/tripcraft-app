import mongoose from "mongoose";

export interface ITrip {
    _id?: mongoose.Types.ObjectId | string;
    userId?: mongoose.Types.ObjectId | string;
    tripName: string;
    tripDescription: string;
    destination: string;
    startDate: Date;
    endDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
}


export interface ITripResponse {
    _id: mongoose.Types.ObjectId | string;
    userId?: mongoose.Types.ObjectId | string;
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