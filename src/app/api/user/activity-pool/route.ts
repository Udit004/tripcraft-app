import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Activity from "@/models/Activity";
import { IActivityApiResponse, IActivityResponse, IAddToPoolRequest } from "@/types/activity";
import { checkAuthentication } from "@/lib/verifyUser";
import { convertExploreActivityToPoolActivity } from "@/utility/poolHelpers";

/**
 * POST /api/user/activity-pool
 * Add an explore activity to user's activity pool
 */
export async function POST(req: NextRequest) {
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
        const body: IAddToPoolRequest = await req.json();
        
        // Support both old format (exploreActivity object) and new format (flat fields)
        let activityData: any;
        
        if (body.exploreActivity) {
            // Legacy format: { exploreActivity: { title, category, ... } }
            activityData = body.exploreActivity;
        } else {
            // New format: { name, type, category, ... }
            activityData = {
                name: body.name,
                type: body.type,
                description: body.description,
                location: body.location,
                category: body.category,
            };
        }
        
        // Validation - support both 'title' (old) and 'name' (new)
        const activityName = activityData.title || activityData.name;
        const activityCategory = activityData.category;
        
        if (!activityName || !activityCategory) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Please provide a valid activity with name/title and category',
                } as IActivityApiResponse,
                { status: 400 }
            );
        }

        // Convert to pool activity format (supports both old and new formats)
        const poolActivityData = convertExploreActivityToPoolActivity(
            activityData,
            user._id.toString()
        );

        // Check if activity with same title and location already exists in pool
        const existingActivity = await Activity.findOne({
            userId: user._id,
            isInPool: true,
            title: poolActivityData.title,
            location: poolActivityData.location,
        });

        if (existingActivity) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Activity already exists in your pool',
                } as IActivityApiResponse,
                { status: 409 }
            );
        }

        // Create pool activity
        const newActivity = await Activity.create(poolActivityData);

        // Return created activity
        const activityResponse: IActivityResponse = {
            _id: newActivity._id.toString(),
            userId: newActivity.userId.toString(),
            itineraryDayId: undefined,
            isInPool: newActivity.isInPool,
            activityType: newActivity.activityType,
            title: newActivity.title,
            description: newActivity.description,
            location: newActivity.location,
            startTime: newActivity.startTime || '',
            endTime: newActivity.endTime || '',
            createdAt: newActivity.createdAt,
            updatedAt: newActivity.updatedAt,
        };

        return NextResponse.json(
            {
                success: true,
                message: 'Activity added to pool successfully',
                activity: activityResponse,
            } as IActivityApiResponse,
            { status: 201 }
        );

    } catch (error) {
        console.error('Error adding activity to pool:', error);
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

/**
 * GET /api/user/activity-pool
 * Get all activities in user's pool
 */
export async function GET(req: NextRequest) {
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
        
        // Get all pool activities for the user (sorted by most recent first)
        const activities = await Activity.find({
            userId: user._id,
            isInPool: true,
        }).sort({ createdAt: -1 });
        
        const activitiesResponse: IActivityResponse[] = activities.map((activity) => ({
            _id: activity._id.toString(),
            userId: activity.userId.toString(),
            itineraryDayId: undefined,
            isInPool: activity.isInPool,
            activityType: activity.activityType,
            title: activity.title,
            description: activity.description,
            location: activity.location,
            startTime: activity.startTime || '',
            endTime: activity.endTime || '',
            createdAt: activity.createdAt,
            updatedAt: activity.updatedAt,
        }));

        return NextResponse.json(
            {
                success: true,
                message: 'Pool activities fetched successfully',
                activities: activitiesResponse,
            } as IActivityApiResponse,
            { status: 200 }
        );

    } catch (error) {
        console.error('Error fetching pool activities:', error);
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
