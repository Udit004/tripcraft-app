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
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,

      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ActivityModel =
  mongoose.models.Activity ||
  mongoose.model<IActivity>("Activity", ActivitySchema);

export default ActivityModel;
