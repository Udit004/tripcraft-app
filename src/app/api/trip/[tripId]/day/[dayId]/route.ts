import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Trip } from '@/models/Trip';
import ItineraryDayModel from '@/models/ItineraryDay';
import Activity from '@/models/Activity';
import { IItineraryDay, IItineraryDayApiResponse } from '@/types/itineraryDay';
import { checkAuthentication } from '@/lib/verifyUser';
import mongoose from 'mongoose';



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
            date: itineraryDay.date,
            activitiesId: itineraryDay.activitiesId.map((id: mongoose.Types.ObjectId) => id.toString()),
            createdAt: itineraryDay.createdAt,
            updatedAt: itineraryDay.updatedAt,
        };

        const activitiesResponse = activities.map(activity => ({
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
};