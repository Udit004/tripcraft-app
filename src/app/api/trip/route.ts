import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Trip } from '@/models/Trip';
import { ICreateTripRequest, ITripResponse, ITripApiResponse, ITrip } from '@/types/trip';
import { checkAuthentication } from '@/lib/verifyUser';



export async function POST(req: NextRequest) {
    const { isAuthenticated, user, error } = await checkAuthentication(req);

    if (!isAuthenticated) {
        return error!;
    }
    try {
        await connectDB();

        const body: ICreateTripRequest = await req.json();
        const { tripName, tripDescription, destination, startDate, endDate } = body;

        // Validation
        if (!tripName || !destination || !startDate || !endDate) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Please provide tripName, destination, startDate, and endDate',
                } as ITripApiResponse,
                { status: 400 }
            );
        }

        // Create new trip
        const newTrip = await Trip.create({
            userId: user._id,
            tripName,
            tripDescription,
            destination,
            startDate,
            endDate,
        }); 

        // Return created trip
        const tripResponse: ITripResponse = {
            _id: newTrip._id.toString(),
            userId: newTrip.userId.toString(),
            tripName: newTrip.tripName,
            tripDescription: newTrip.tripDescription,
            destination: newTrip.destination,
            startDate: newTrip.startDate,
            endDate: newTrip.endDate,
            createdAt: newTrip.createdAt,
            updatedAt: newTrip.updatedAt,
        };

        return NextResponse.json(
            {
                success: true,
                message: 'Trip created successfully',
                trip: tripResponse,
            } as ITripApiResponse,
            { status: 201 }
        );

    } catch (error) {
        console.error('Error creating trip:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal Server Error',
            } as ITripApiResponse,
            { status: 500 }
        );
    }
}



export async function GET(req: NextRequest) {
    const { isAuthenticated, user, error } = await checkAuthentication(req);

    if (!isAuthenticated) {
        return error!;
    }

    try {
        const userId = user._id;
        await connectDB();
        const trips: ITrip[] = await Trip.find({ userId });

        const tripResponses: ITripResponse[] = trips.map((trip) => ({
            _id: trip._id?.toString(),
            userId: trip.userId?.toString(),
            tripName: trip.tripName,
            tripDescription: trip.tripDescription,
            destination: trip.destination,
            startDate: trip.startDate,
            endDate: trip.endDate,
            createdAt: trip.createdAt,
            updatedAt: trip.updatedAt,
        }));
        
        return NextResponse.json(
            {
                success: true,
                message: 'Trips fetched successfully',
                trips: tripResponses,
            } as ITripApiResponse,
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching trips:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal Server Error',
            } as ITripApiResponse,
            { status: 500 }
        );
    }
}