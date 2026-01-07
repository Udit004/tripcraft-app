import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Trip } from '@/models/Trip';
import ItineraryDayModel from '@/models/ItineraryDay';
import { IItineraryDay, IItineraryDayApiResponse } from '@/types/itineraryDay';
import { checkAuthentication } from '@/lib/verifyUser';



// Add a new itinerary day to a specific trip
export async function POST(req: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
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
        const resolvedParams = await params;
        const tripId = resolvedParams.tripId;
        const body: IItineraryDay = await req.json();
        await connectDB();

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

        const newItinerary = await ItineraryDayModel.create({
            tripId: trip._id,
            dayNumber: body.dayNumber,
            date: body.date,
            activitiesId: body.activitiesId || [],
        });

        return NextResponse.json(  
            {
                success: true,
                message: 'Itinerary added successfully',    
                itinerary: newItinerary,
            } as IItineraryDayApiResponse,
            { status: 201 }
        );


    } catch (error) {
        console.error('Error adding itinerary day:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal Server Error',
            },
            { status: 500 }
        );
    }
}




// Get all itinerary days for a specific trip
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
        const resolvedParams = await params;
        const tripId = resolvedParams.tripId;
        await connectDB();  

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
        const itineraries = await ItineraryDayModel.find({ tripId: trip._id });

        return NextResponse.json(
            {
                success: true,
                message: 'Itineraries fetched successfully',
                itineraries: itineraries,
            } as IItineraryDayApiResponse,
            { status: 200 }
        );

    } catch (error) {
        console.error('Error fetching itinerary days:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal Server Error',
            },
            { status: 500 }
        );
    }
}