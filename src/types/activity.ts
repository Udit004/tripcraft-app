import mongoose from "mongoose";
import { ActivityType } from "@/constants/activityTypes";

export interface IActivity {
    _id: mongoose.Types.ObjectId | string;
    itineraryDayId: mongoose.Types.ObjectId | string;
    activityType: ActivityType | string; // Allow string for backwards compatibility
    title: string;
    description: string;
    location: string;
    startTime: string;
    endTime: string;
    createdAt: string;
    updatedAt: string;
}

export interface IActivityId {
    _id: mongoose.Types.ObjectId | string;
}


export interface ICreateActivityRequest {
    itineraryDayId: mongoose.Types.ObjectId | string;
    activityType: ActivityType | string; // Allow string for backwards compatibility
    title: string;
    description: string;
    location: string;
    startTime: string;
    endTime: string;
}

export interface IActivityResponse {
    _id: mongoose.Types.ObjectId | string;
    itineraryDayId: mongoose.Types.ObjectId | string;
    activityType: ActivityType | string; // Allow string for backwards compatibility
    title: string;
    description: string;
    location: string;
    startTime: string;
    endTime: string;
    createdAt: string;
    updatedAt: string;
}       


export interface IActivityApiResponse {
    success: boolean;
    message: string;
    activity?: IActivityResponse;
    activities?: IActivityResponse[];
    error?: string;
}