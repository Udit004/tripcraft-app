import mongoose, { Schema, model} from "mongoose";
import { ITrip } from "@/types/trip";

const TripSchema = new Schema<ITrip>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tripName: {
        type: String,
        required: true,
    },
    tripDescription: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
}, { timestamps: true })

// Prevent model recompilation during development
export const Trip = mongoose.models.Trip || model<ITrip>('Trip', TripSchema);