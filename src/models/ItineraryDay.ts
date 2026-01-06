import mongoose, { Schema, model } from "mongoose";
import { IItineraryDay } from "@/types/itineraryDay";

const ItineraryDaySchema = new Schema<IItineraryDay>({
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true,
    },
    dayNumber: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,     
        required: true,
    },
    activitiesId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
    }],
}, { timestamps: true })

const ItineraryDayModel = mongoose.models.ItineraryDay || mongoose.model<IItineraryDay>("ItineraryDay", ItineraryDaySchema);

export default ItineraryDayModel;