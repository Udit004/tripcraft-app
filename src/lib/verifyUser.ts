import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

/**
 * Verifies if the user is authenticated by checking the token from cookies
 * @param request - NextRequest object containing cookies
 * @returns Object with user data if authenticated, or error response if not
 */
export async function checkAuthentication(request: NextRequest): Promise<{
  isAuthenticated: boolean;
  user?: any;
  error?: NextResponse;
}> {
  try {
    let token = request.cookies.get('token')?.value;

    // Fall back to Authorization header (Postman/API clients)
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader) {
        // Extract token from "Bearer <token>"
        const parts = authHeader.split(' ');
        console.log('Auth header parts:', parts);
        if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
          token = parts[1];
          console.log('Token extracted from header. Token length:', token.length);
        }
      }
    }
    
    if (!token) {
      return {
        isAuthenticated: false,
        error: NextResponse.json(
          { success: false, message: 'No token provided' },
          { status: 401 }
        ),
      };
    }

    await connectDB();
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return {
        isAuthenticated: false,
        error: NextResponse.json(
          { success: false, message: 'Invalid or expired token' },
          { status: 401 }
        ),
      };
    }

    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return {
        isAuthenticated: false,
        error: NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        ),
      };
    }

    return {
      isAuthenticated: true,
      user,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      isAuthenticated: false,
      error: NextResponse.json(
        { success: false, message: 'An error occurred during verification' },
        { status: 500 }
      ),
    };
  }
}


