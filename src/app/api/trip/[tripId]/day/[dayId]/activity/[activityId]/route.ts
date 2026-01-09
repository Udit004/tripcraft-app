import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Activity from '@/models/Activity';
import ItineraryDay from '@/models/ItineraryDay';
import { checkAuthentication } from '@/lib/verifyUser';
import { VALID_ACTIVITY_TYPES } from '@/constants/activityTypes';

// DELETE - Remove activity
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ tripId: string; dayId: string; activityId: string }> }
) {
    const { isAuthenticated, user, error } = await checkAuthentication(request);
    if (!isAuthenticated) {
        return NextResponse.json(
            {
                success: false,
                message: 'Authentication failed',
                error: error
            },
            { status: 401 }
        );
    }

    try {
        const { dayId, activityId } = await params;

        await dbConnect();

        // Find and delete activity
        const deletedActivity = await Activity.findByIdAndDelete(activityId);

        if (!deletedActivity) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Activity not found',
                    error: 'Invalid activityId'
                },
                { status: 404 }
            );
        }

        // Remove activity from itinerary day
        await ItineraryDay.findByIdAndUpdate(
            dayId,
            { $pull: { activitiesId: activityId } },
            { new: true }
        );

        console.log('Activity deleted:', activityId);

        return NextResponse.json(
            {
                success: true,
                message: 'Activity deleted successfully',
                activity: deletedActivity,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting activity:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to delete activity',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

// PUT - Update activity
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ tripId: string; dayId: string; activityId: string }> }
) {
    const { isAuthenticated, user, error } = await checkAuthentication(request);
    if (!isAuthenticated) {
        return NextResponse.json(
            {
                success: false,
                message: 'Authentication failed',
                error: error
            },
            { status: 401 }
        );
    }

    try {
        const { activityId } = await params;

        await dbConnect();

        const body = await request.json();

        // Validate activity type if provided in update
        if (body.activityType && !VALID_ACTIVITY_TYPES.includes(body.activityType)) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Invalid activity type. Must be one of: ${VALID_ACTIVITY_TYPES.join(', ')}`,
                },
                { status: 400 }
            );
        }

        // Update activity
        const updatedActivity = await Activity.findByIdAndUpdate(
            activityId,
            body,
            { new: true, runValidators: true }
        );

        if (!updatedActivity) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Activity not found',
                    error: 'Invalid activityId'
                },
                { status: 404 }
            );
        }

        console.log('Activity updated:', activityId);

        return NextResponse.json(
            {
                success: true,
                message: 'Activity updated successfully',
                activity: updatedActivity,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating activity:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to update activity',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
