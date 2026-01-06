import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Trip } from '@/models/Trip';
import { ICreateTripRequest, ITripResponse, ITripApiResponse, ITrip } from '@/types/trip';
import { checkAuthentication } from '@/lib/verifyUser';



export async function GET(req: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
    const { isAuthenticated, user, error } = await checkAuthentication(req);
    if(!isAuthenticated){
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
        const tripId = resolvedParams.tripId;
        
        console.log('Resolved params:', resolvedParams);
        console.log('Received tripId:', tripId);
        
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

        const tripResponse: ITripResponse = {
            _id: trip._id.toString(),
            userId: trip.userId.toString(),
            tripName: trip.tripName,
            tripDescription: trip.tripDescription,
            destination: trip.destination,
            startDate: trip.startDate,
            endDate: trip.endDate,
            createdAt: trip.createdAt,
            updatedAt: trip.updatedAt,
        };

        return NextResponse.json(
            {
                success: true,
                message: 'Trip fetched successfully',
                trip: tripResponse,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching trip:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal Server Error',
            },
            { status: 500 }
        );
    }
    
}