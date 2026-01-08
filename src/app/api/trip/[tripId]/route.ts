import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Trip } from '@/models/Trip';
import { ICreateTripRequest, ITripResponse, ITripApiResponse, ITrip } from '@/types/trip';
import { checkAuthentication } from '@/lib/verifyUser';


// Get a specific trip by ID
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

// Update a specific trip by ID
export async function PUT(req: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
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
        console.log('Received tripId for update:', tripId);
        const tripData: ICreateTripRequest = await req.json();

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

        const updatedTrip = await Trip.findByIdAndUpdate(
            tripId,
            {
                tripName: tripData.tripName,
                tripDescription: tripData.tripDescription,
                destination: tripData.destination,
                startDate: tripData.startDate,
                endDate: tripData.endDate,
                updatedAt: new Date(),
            },
            { new: true }
        );

        const tripResponse: ITripResponse = {
            _id: updatedTrip._id.toString(),
            userId: updatedTrip.userId.toString(),
            tripName: updatedTrip.tripName,
            tripDescription: updatedTrip.tripDescription,
            destination: updatedTrip.destination,
            startDate: updatedTrip.startDate,
            endDate: updatedTrip.endDate,
            createdAt: updatedTrip.createdAt,
            updatedAt: updatedTrip.updatedAt,
        };

        return NextResponse.json(
            {
                success: true,
                message: 'Trip updated successfully',
                trip: tripResponse,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating trip:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal Server Error',
            },
            { status: 500 }
        );
    }
}


// Delete a specific trip by ID
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
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
        console.log('Received tripId for deletion:', tripId);

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
        await Trip.findByIdAndDelete(tripId);

        return NextResponse.json(
            {
                success: true,
                message: 'Trip deleted successfully',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting trip:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal Server Error',
            },
            { status: 500 }
        );
    }
}