import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import DeletionLog from '@/models/DeletionLog';
import { Trip } from '@/models/Trip';
import ItineraryDayModel from '@/models/ItineraryDay';
import Activity from '@/models/Activity';
import { checkAuthentication } from '@/lib/verifyUser';

export async function POST(req: NextRequest) {
    const { isAuthenticated, user, error } = await checkAuthentication(req);
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
        await connectDB();
        const { deletionLogId } = await req.json();

        if (!deletionLogId) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Deletion log ID is required',
                },
                { status: 400 }
            );
        }

        const deletionLog = await DeletionLog.findById(deletionLogId);

        if (!deletionLog) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Deletion record not found or already restored',
                },
                { status: 404 }
            );
        }

        if (deletionLog.userId.toString() !== user._id.toString()) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Unauthorized access',
                },
                { status: 403 }
            );
        }

        if (new Date() > deletionLog.expiresAt) {
            await DeletionLog.findByIdAndDelete(deletionLogId);
            return NextResponse.json(
                {
                    success: false,
                    message: 'Undo window has expired',
                },
                { status: 410 }
            );
        }

        // Restore based on entity type
        if (deletionLog.entityType === 'itineraryDay') {
            // Restore related activities first
            if (deletionLog.relatedData?.activities && deletionLog.relatedData.activities.length > 0) {
                await Activity.insertMany(deletionLog.relatedData.activities);
            }

            // Restore itinerary day
            const restoredDay = await ItineraryDayModel.create(deletionLog.data);

            // Add back to trip's itinerary days array
            if (deletionLog.relatedData?.tripId) {
                await Trip.findByIdAndUpdate(
                    deletionLog.relatedData.tripId,
                    { $push: { itineraryDays: restoredDay._id } },
                    { new: true }
                );
            }
        } else if (deletionLog.entityType === 'activity') {
            // Restore activity
            const restoredActivity = await Activity.create(deletionLog.data);
            
            // Add back to itinerary day's activities array
            if (restoredActivity.itineraryDayId) {
                await ItineraryDayModel.findByIdAndUpdate(
                    restoredActivity.itineraryDayId,
                    { $push: { activitiesId: restoredActivity._id } },
                    { new: true }
                );
            }
        } else if (deletionLog.entityType === 'trip') {
            // Restore related itinerary days and activities
            if (deletionLog.relatedData?.itineraryDays) {
                for (const dayData of deletionLog.relatedData.itineraryDays) {
                    await ItineraryDayModel.create(dayData);
                }
            }
            
            if (deletionLog.relatedData?.activities) {
                await Activity.insertMany(deletionLog.relatedData.activities);
            }

            // Restore trip
            await Trip.create(deletionLog.data);
        }

        // Delete the deletion log after successful recovery
        await DeletionLog.findByIdAndDelete(deletionLogId);

        return NextResponse.json(
            {
                success: true,
                message: 'Item restored successfully',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error undoing deletion:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to restore item',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
