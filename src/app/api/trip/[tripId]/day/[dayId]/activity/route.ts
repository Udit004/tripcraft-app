import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Activity from "@/models/Activity";
import { IActivityApiResponse, ICreateActivityRequest, IActivityResponse } from "@/types/activity";
import { checkAuthentication } from "@/lib/verifyUser";
import ItineraryDayModel from "@/models/ItineraryDay";


export async function POST(req: Request, { params }: { params: { tripId: string; dayId: string } }) {
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



export async function GET(req: Request, { params }: { params: { tripId: string; dayId: string } }) {
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
        const activities = await Activity.find({ itineraryDayId: dayId });
        const activitiesResponse: IActivityResponse[] = activities.map((activity) => ({
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
