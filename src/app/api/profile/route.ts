import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { checkAuthentication } from '@/lib/verifyUser';

/**
 * GET /api/profile
 * Fetch the current user's profile
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Verify user from token
    const authResult = await checkAuthentication(req);
    if (!authResult.isAuthenticated || authResult.error) {
      return authResult.error || NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user with profile data
    const user = await User.findById(authResult.user._id).select('-password').lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }


    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/profile
 * Update the current user's profile
 */
export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    // Verify user from token
    const authResult = await checkAuthentication(req);
    if (!authResult.isAuthenticated || authResult.error) {
      return authResult.error || NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = authResult.user._id;

    // Parse request body
    const body = await req.json();

    // Prevent updating sensitive fields
    if (body.email || body.password || body.username || body._id) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Cannot update email, password, username, or _id from profile' 
        },
        { status: 400 }
      );
    }

    // Update user with new data
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: body },
      { new: true, runValidators: true }
    ).select('-password').lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
