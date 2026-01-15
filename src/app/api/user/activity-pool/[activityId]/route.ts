import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Activity from "@/models/Activity";
import { IActivityApiResponse } from "@/types/activity";
import { checkAuthentication } from "@/lib/verifyUser";

/**
 * DELETE /api/user/activity-pool/[activityId]
 * Remove an activity from user's pool
 */
export async function DELETE(
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
        
        // Find and delete the activity (only if it belongs to the user and is in pool)
        const activity = await Activity.findOneAndDelete({
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

        return NextResponse.json(
            {
                success: true,
                message: 'Activity removed from pool successfully',
            } as IActivityApiResponse,
            { status: 200 }
        );

    } catch (error) {
        console.error('Error removing activity from pool:', error);
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
