import mongoose from "mongoose";

export type TravelStyle = 'adventure' | 'leisure' | 'cultural' | 'budget' | 'luxury' | 'solo' | 'family' | 'business';
export type BudgetRange = 'budget' | 'moderate' | 'comfort' | 'luxury';

export interface IUser {
  _id?: mongoose.Types.ObjectId | string;
  username: string;
  email: string;
  password: string;
  // Profile fields (flattened)
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  phoneNumber?: string;
  // Location
  city?: string;
  country?: string;
  // Travel Preferences
  travelStyles?: TravelStyle[];
  budgetRange?: BudgetRange;
  interests?: string[];
  accessibility?: string[];
  // App Preferences
  currency?: string;
  language?: string;
  notifications?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserResponse {
  _id: mongoose.Types.ObjectId | string;
  username: string;
  email: string;
  // Profile fields
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  phoneNumber?: string;
  // Location
  city?: string;
  country?: string;
  // Travel Preferences
  travelStyles?: TravelStyle[];
  budgetRange?: BudgetRange;
  interests?: string[];
  accessibility?: string[];
  // App Preferences
  currency?: string;
  language?: string;
  notifications?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ISignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: IUserResponse;
}

export interface IProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  phoneNumber?: string;
  city?: string;
  country?: string;
  travelStyles?: TravelStyle[];
  budgetRange?: BudgetRange;
  interests?: string[];
  accessibility?: string[];
  currency?: string;
  language?: string;
  notifications?: boolean;
}
