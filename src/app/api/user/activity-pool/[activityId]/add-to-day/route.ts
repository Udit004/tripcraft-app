import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Activity from "@/models/Activity";
import ItineraryDayModel from "@/models/ItineraryDay";
import { Trip } from "@/models/Trip";
import { IActivityApiResponse, IActivityResponse } from "@/types/activity";
import { checkAuthentication } from "@/lib/verifyUser";

interface AddToDayRequest {
    tripId: string;
    dayId: string;
}

/**
 * POST /api/user/activity-pool/[activityId]/add-to-day
 * Move a pool activity to a specific itinerary day
 */
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ activityId: string }> }
) {
    const { isAuthenticated, user, error } = await checkAuthentication(req);
    if (!isAuthenticated || !user) {
        return NextResponse.json(
            {
                success: false,
                message: 'Authentication failed',
                error: error
            } as IActivityApiResponse,
            { status: 401 }
        );
    }

    try {
        await connectDB();
        const { activityId } = await params;
        const body: AddToDayRequest = await req.json();
        const { tripId, dayId } = body;
        
        // Validation
        if (!tripId || !dayId) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Please provide tripId and dayId',
                } as IActivityApiResponse,
                { status: 400 }
            );
        }

        // Verify the pool activity exists and belongs to the user
        const activity = await Activity.findOne({
            _id: activityId,
            userId: user._id,
            isInPool: true,
        });

        if (!activity) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Activity not found in pool or unauthorized',
                } as IActivityApiResponse,
                { status: 404 }
            );
        }

        // Verify the trip exists and belongs to the user
        const trip = await Trip.findOne({
            _id: tripId,
            userId: user._id,
        });

        if (!trip) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Trip not found or unauthorized',
                } as IActivityApiResponse,
                { status: 404 }
            );
        }

        // Verify the itinerary day exists and belongs to the trip
        const itineraryDay = await ItineraryDayModel.findOne({
            _id: dayId,
            tripId: tripId,
        });

        if (!itineraryDay) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Itinerary day not found or does not belong to the trip',
                } as IActivityApiResponse,
                { status: 404 }
            );
        }

        // Update the activity: assign to day and remove from pool
        activity.itineraryDayId = dayId;
        activity.isInPool = false;
        await activity.save();

        // Add activity to the itinerary day's activitiesId array
        await ItineraryDayModel.findByIdAndUpdate(
            dayId,
            { $push: { activitiesId: activity._id } },
            { new: true }
        );

        // Return updated activity
        const activityResponse: IActivityResponse = {
            _id: activity._id.toString(),
            userId: activity.userId.toString(),
            itineraryDayId: activity.itineraryDayId?.toString(),
            isInPool: activity.isInPool,
            activityType: activity.activityType,
            title: activity.title,
            description: activity.description,
            location: activity.location,
            startTime: activity.startTime || '',
            endTime: activity.endTime || '',
            createdAt: activity.createdAt,
            updatedAt: activity.updatedAt,
        };

        return NextResponse.json(
            {
                success: true,
                message: 'Activity added to itinerary day successfully',
                activity: activityResponse,
            } as IActivityApiResponse,
            { status: 200 }
        );

    } catch (error) {
        console.error('Error adding activity to day:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal Server Error',
                error: error instanceof Error ? error.message : 'Unknown error',
            } as IActivityApiResponse,
            { status: 500 }
        );
    }
}
