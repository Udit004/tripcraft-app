import mongoose from "mongoose";

export interface IUser {
  _id?: mongoose.Types.ObjectId | string;
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserResponse {
  _id: mongoose.Types.ObjectId | string;
  username: string;
  email: string;
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
