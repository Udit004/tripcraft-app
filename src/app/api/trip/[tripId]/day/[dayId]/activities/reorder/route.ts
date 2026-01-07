import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ItineraryDay from '@/models/ItineraryDay';
import { checkAuthentication } from '@/lib/verifyUser';

// PUT - Reorder activities
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ tripId: string; dayId: string }> }
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
    const { dayId } = await params;
    
    await dbConnect();

    const body = await request.json();
    const { activityIds } = body;

    // Validation
    if (!activityIds || !Array.isArray(activityIds)) {
      return NextResponse.json(
        {
          success: false,
          message: 'activityIds must be an array',
          error: 'Invalid request format'
        },
        { status: 400 }
      );
    }

    // Update itinerary day with new activity order
    const updatedItinerary = await ItineraryDay.findByIdAndUpdate(
      dayId,
      { activitiesId: activityIds },
      { new: true }
    ).populate('activitiesId');

    if (!updatedItinerary) {
      return NextResponse.json(
        {
          success: false,
          message: 'Itinerary day not found',
          error: 'Invalid dayId'
        },
        { status: 404 }
      );
    }

    console.log('Activities reordered:', dayId, activityIds);

    return NextResponse.json(
      {
        success: true,
        message: 'Activities reordered successfully',
        itinerary: updatedItinerary,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error reordering activities:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to reorder activities',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
