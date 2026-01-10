import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Trip } from '@/models/Trip';
import ItineraryDayModel from '@/models/ItineraryDay';
import Activity from '@/models/Activity';
import { IItineraryDay, IItineraryDayApiResponse } from '@/types/itineraryDay';
import { checkAuthentication } from '@/lib/verifyUser';
import mongoose from 'mongoose';
import { logDeletion } from '@/lib/deletionLog';



// Get a specific itinerary day by ID with its activities
export async function GET(req: NextRequest, { params }: { params: Promise<{ tripId: string; dayId: string }> }) {
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
        const resolvedParams = await params;
        const { tripId, dayId } = resolvedParams;
        const trip = await Trip.findById(tripId);

        if (!trip) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Trip not found',
                },
                { status: 404 }
            );
        }
        if (trip.userId.toString() !== user._id.toString()) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Unauthorized access to this trip',
                },
                { status: 403 }
            );
        }
        const itineraryDay = await ItineraryDayModel.findById(dayId);
        
        if (!itineraryDay) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Itinerary Day not found',
                },
                { status: 404 }
            );
        }

        // Fetch all activities related to this itinerary day
        const activities = await Activity.find({ itineraryDayId: dayId });
        
        const itineraryDayResponse: IItineraryDay = {
            _id: itineraryDay._id.toString(),
            tripId: itineraryDay.tripId.toString(),
            dayNumber: itineraryDay.dayNumber,
            dayName: itineraryDay.dayName || '',
            date: itineraryDay.date,
            activitiesId: itineraryDay.activitiesId.map((id: mongoose.Types.ObjectId) => id.toString()),
            createdAt: itineraryDay.createdAt,
            updatedAt: itineraryDay.updatedAt,
        };

        // Sort activities based on the order stored in activitiesId
        const activitiesIdOrder = itineraryDay.activitiesId.map((id: mongoose.Types.ObjectId) => id.toString());
        const activitiesMap = new Map(
            activities.map(activity => [activity._id.toString(), activity])
        );
        
        const sortedActivities = activitiesIdOrder
            .map((id: string) => activitiesMap.get(id))
            .filter((activity: any) => activity !== undefined);

        const activitiesResponse = sortedActivities.map((activity: any) => ({
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
                message: 'Itinerary Day fetched successfully',
                itineraries: [itineraryDayResponse],
                activities: activitiesResponse,
            } as IItineraryDayApiResponse,
            { status: 200 }
        );

    } catch (error) {
        console.error('Error fetching itinerary day:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal Server Error',
            } as IItineraryDayApiResponse,
            { status: 500 }
        );
    }
}

// Update a specific itinerary day
export async function PUT(req: NextRequest, { params }: { params: Promise<{ tripId: string; dayId: string }> }) {
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
        const resolvedParams = await params;
        const { tripId, dayId } = resolvedParams;
        const dayData = await req.json();

        const trip = await Trip.findById(tripId);

        if (!trip) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Trip not found',
                },
                { status: 404 }
            );
        }
        if (trip.userId.toString() !== user._id.toString()) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Unauthorized access to this trip',
                },
                { status: 403 }
            );
        }

        const itineraryDay = await ItineraryDayModel.findById(dayId);

        if (!itineraryDay) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Itinerary Day not found',
                },
                { status: 404 }
            );
        }

        const updatedItineraryDay = await ItineraryDayModel.findByIdAndUpdate(
            dayId,
            {
                dayNumber: dayData.dayNumber,
                dayName: dayData.dayName || '',
                date: dayData.date,
                updatedAt: new Date(),
            },
            { new: true }
        );

        const itineraryDayResponse: IItineraryDay = {
            _id: updatedItineraryDay._id.toString(),
            tripId: updatedItineraryDay.tripId.toString(),
            dayNumber: updatedItineraryDay.dayNumber,
            dayName: updatedItineraryDay.dayName || '',
            date: updatedItineraryDay.date,
            activitiesId: updatedItineraryDay.activitiesId.map((id: mongoose.Types.ObjectId) => id.toString()),
            createdAt: updatedItineraryDay.createdAt,
            updatedAt: updatedItineraryDay.updatedAt,
        };

        return NextResponse.json(
            {
                success: true,
                message: 'Itinerary Day updated successfully',
                itinerary: itineraryDayResponse,
            } as IItineraryDayApiResponse,
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating itinerary day:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal Server Error',
            } as IItineraryDayApiResponse,
            { status: 500 }
        );
    }
}

// Delete a specific itinerary day
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ tripId: string; dayId: string }> }) {
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
        const resolvedParams = await params;
        const { tripId, dayId } = resolvedParams;

        const trip = await Trip.findById(tripId);

        if (!trip) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Trip not found',
                },
                { status: 404 }
            );
        }
        if (trip.userId.toString() !== user._id.toString()) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Unauthorized access to this trip',
                },
                { status: 403 }
            );
        }

        const itineraryDay = await ItineraryDayModel.findById(dayId);

        if (!itineraryDay) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Itinerary Day not found',
                },
                { status: 404 }
            );
        }

        // Fetch all activities before deletion for undo feature
        const activities = await Activity.find({ itineraryDayId: dayId });

        // Log deletion for undo feature
        const deletionLogId = await logDeletion({
            userId: user._id.toString(),
            entityType: 'itineraryDay',
            entityId: dayId,
            data: itineraryDay.toObject(),
            relatedData: {
                tripId: tripId,
                activities: activities.map(a => a.toObject()),
            },
        });

        // Delete all activities associated with this itinerary day
        await Activity.deleteMany({ itineraryDayId: dayId });

        // Delete the itinerary day
        await ItineraryDayModel.findByIdAndDelete(dayId);

        // Remove the day from trip's itinerary days array if it exists
        await Trip.findByIdAndUpdate(
            tripId,
            { $pull: { itineraryDays: dayId } },
            { new: true }
        );

        return NextResponse.json(
            {
                success: true,
                message: 'Itinerary Day deleted successfully',
                deletionLogId: deletionLogId,
                undoWindowSeconds: 10,
            } as IItineraryDayApiResponse,
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting itinerary day:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal Server Error',
            } as IItineraryDayApiResponse,
            { status: 500 }
        );
    }
}

