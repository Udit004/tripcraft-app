import { IActivity, IActivityId } from './activity';
import mongoose from 'mongoose';

export interface IItineraryDay {
    _id?: mongoose.Types.ObjectId | string;
    tripId: mongoose.Types.ObjectId | string; 
    dayNumber: number;
    date: Date;
    activitiesId: IActivityId[];
    createdAt: string;
    updatedAt: string;
}

export interface IItineraryDayId {
    _id: mongoose.Types.ObjectId | string;
}

export interface IItineraryDayRequest {
    tripId: mongoose.Types.ObjectId | string;
    dayNumber: number;
    date: Date;
    activitiesId?: string[];
}

export interface IItineraryDayResponse {
    _id?: mongoose.Types.ObjectId | string;
    tripId: mongoose.Types.ObjectId | string; 
    dayNumber: number;
    date: Date;
    activitiesId: IActivityId[];
    activities?: IActivity[];
    createdAt: string;
    updatedAt: string;
}

export interface IItineraryDayApiResponse {
    success: boolean;
    message: string;
    itineraryDay?: IItineraryDayResponse;
    itineraryDays?: IItineraryDayResponse[];
    activities?: IActivity[];
    error?: string;
}