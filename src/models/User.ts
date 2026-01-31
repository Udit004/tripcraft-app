import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from '@/types/user';

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username must not exceed 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    // Profile fields (flattened for better MongoDB compatibility)
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    bio: { type: String, maxlength: [500, 'Bio must not exceed 500 characters'] },
    avatar: { type: String },
    phoneNumber: { type: String },
    // Location
    city: { type: String },
    country: { type: String },
    // Travel Preferences
    travelStyles: [{ type: String, enum: ['adventure', 'leisure', 'cultural', 'budget', 'luxury', 'solo', 'family', 'business'] }],
    budgetRange: { type: String, enum: ['budget', 'moderate', 'comfort', 'luxury'] },
    interests: [{ type: String }],
    accessibility: [{ type: String }],
    // App Preferences
    currency: { type: String, default: 'USD' },
    language: { type: String, default: 'en' },
    notifications: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation during development
const User: Model<IUser> = 
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
