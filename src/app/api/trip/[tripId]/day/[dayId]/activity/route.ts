import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Activity from "@/models/Activity";
import { IActivityApiResponse, ICreateActivityRequest, IActivityResponse } from "@/types/activity";
import { checkAuthentication } from "@/lib/verifyUser";
import ItineraryDayModel from "@/models/ItineraryDay";
import { VALID_ACTIVITY_TYPES } from "@/constants/activityTypes";

// Create a new activity for a specific itinerary day
export async function POST(req: Request, { params }: { params: Promise<{ tripId: string; dayId: string }> }) {
    const { isAuthenticated, user, error } = await checkAuthentication(req);
    if (!isAuthenticated) {
        return NextResponse.json(
            {
                success: false,
                message: 'Authentication failed',
                error: error
            }
        )
    }

    try {
        await connectDB();
        const body: ICreateActivityRequest = await req.json();
        const { tripId, dayId } = await params;
        const { activityType, title, description, location, startTime, endTime } = body;
        
        // Validation
        if (!activityType || !title || !startTime || !endTime) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Please provide activityType, title, startTime, and endTime',
                } as IActivityApiResponse,
                { status: 400 }
            );
        }

        // Validate activity type
        if (!VALID_ACTIVITY_TYPES.includes(activityType)) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Invalid activity type. Must be one of: ${VALID_ACTIVITY_TYPES.join(', ')}`,
                } as IActivityApiResponse,
                { status: 400 }
            );
        }

        // Create new activity
        const newActivity = await Activity.create({
            itineraryDayId: dayId,
            activityType,
            title,
            description,
            location,
            startTime,
            endTime,
        });


        // Return created activity
        const activityResponse: IActivityResponse = {
            _id: newActivity._id.toString(),
            itineraryDayId: newActivity.itineraryDayId.toString(),
            activityType: newActivity.activityType,
            title: newActivity.title,
            description: newActivity.description,
            location: newActivity.location,
            startTime: newActivity.startTime,
            endTime: newActivity.endTime,
            createdAt: newActivity.createdAt,
            updatedAt: newActivity.updatedAt,
        };

        await ItineraryDayModel.findByIdAndUpdate(
            dayId,
            { $push: { activitiesId: newActivity._id } },
            { new: true }
        );  
        return NextResponse.json(
            {
                success: true,
                message: 'Activity created successfully',
                activity: activityResponse,
            } as IActivityApiResponse,
            { status: 201 }
        );

    } catch (error) {
        console.error('Error creating activity:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal Server Error',
            } as IActivityApiResponse,
            { status: 500 }
        );
    }
};


// Get all activities for a specific itinerary day
export async function GET(req: Request, { params }: { params: Promise<{ tripId: string; dayId: string }> }) {
    const { isAuthenticated, user, error } = await checkAuthentication(req);
    if (!isAuthenticated) {
        return NextResponse.json(
            {
                success: false,
                message: 'Authentication failed',
                error: error
            }
        )
    }

    try {
        await connectDB();
        const { tripId, dayId } = await params;
        
        // Get the itinerary day to access the ordered activitiesId array
        const itineraryDay = await ItineraryDayModel.findById(dayId);
        if (!itineraryDay) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Itinerary day not found',
                } as IActivityApiResponse,
                { status: 404 }
            );
        }
        
        const activities = await Activity.find({ itineraryDayId: dayId });
        
        // Sort activities based on the order stored in activitiesId
        const activitiesIdOrder = itineraryDay.activitiesId.map((id: any) => id.toString());
        const activitiesMap = new Map(
            activities.map(activity => [activity._id.toString(), activity])
        );
        
        const sortedActivities = activitiesIdOrder
            .map(id => activitiesMap.get(id))
            .filter(activity => activity !== undefined);
        
        const activitiesResponse: IActivityResponse[] = sortedActivities.map((activity) => ({
            _id: activity._id.toString(),
            itineraryDayId: activity.itineraryDayId.toString(),
            activityType: activity.activityType,    
            title: activity.title,
            description: activity.description,
            location: activity.location,
            startTime: activity.startTime,
            endTime: activity.endTime,
            createdAt: activity.createdAt,
            updatedAt: activity.updatedAt,
        }));

        return NextResponse.json(
            {
                success: true,
                message: 'Activities fetched successfully',
                activities: activitiesResponse,
            } as IActivityApiResponse,
            { status: 200 }
        );

    } catch (error) {
        console.error('Error fetching activities:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal Server Error',
            } as IActivityApiResponse,
            { status: 500 }
        );
    }
};
