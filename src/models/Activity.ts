import mongoose, { Schema } from "mongoose";
import { IActivity } from "@/types/activity";

const ActivitySchema = new Schema<IActivity>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    itineraryDayId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ItineraryDay",
      required: false, // Optional - null when activity is in pool
    },
    isInPool: {
      type: Boolean,
      default: false,
      index: true,
    },
    activityType: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
    startTime: {
      type: String,
      required: false,
    },
    endTime: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

// Compound index for efficient pool queries
ActivitySchema.index({ userId: 1, isInPool: 1 });

const ActivityModel =
  mongoose.models.Activity ||
  mongoose.model<IActivity>("Activity", ActivitySchema);

export default ActivityModel;
