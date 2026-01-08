import mongoose, { Schema, model } from "mongoose";
import { IActivity } from "@/types/activity";

const ActivitySchema = new Schema<IActivity>(
  {
    itineraryDayId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ItineraryDay",
      required: true,
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

const ActivityModel =
  mongoose.models.Activity ||
  mongoose.model<IActivity>("Activity", ActivitySchema);

export default ActivityModel;
