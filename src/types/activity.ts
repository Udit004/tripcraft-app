import mongoose from "mongoose";
import { ActivityType } from "@/constants/activityTypes";

export interface IActivity {
    _id: mongoose.Types.ObjectId | string;
    userId: mongoose.Types.ObjectId | string;
    itineraryDayId?: mongoose.Types.ObjectId | string; // Optional - undefined when in pool
    isInPool: boolean;
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
    userId: mongoose.Types.ObjectId | string;
    itineraryDayId?: mongoose.Types.ObjectId | string; // Optional - undefined when adding to pool
    isInPool?: boolean; // Optional - defaults to false
    activityType: ActivityType | string; // Allow string for backwards compatibility
    title: string;
    description: string;
    location: string;
    startTime?: string; // Optional for pool activities
    endTime?: string; // Optional for pool activities
}

export interface IActivityResponse {
    _id: mongoose.Types.ObjectId | string;
    userId: mongoose.Types.ObjectId | string;
    itineraryDayId?: mongoose.Types.ObjectId | string; // Optional - undefined when in pool
    isInPool: boolean;
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

// Explore API response type (from OpenStreetMap API)
export interface ExploreActivity {
    title: string;
    category: 'nature' | 'culture' | 'sightseeing' | 'general';
    location: string;
    description: string;
    confidence: 'high' | 'medium' | 'low';
}

// Request type for adding explore activity to pool
export interface IAddToPoolRequest {
    exploreActivity: ExploreActivity;
}