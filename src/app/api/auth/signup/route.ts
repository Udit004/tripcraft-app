import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword } from '@/lib/password';
import { generateToken } from '@/lib/jwt';
import { ISignupRequest, IAuthResponse } from '@/types/user';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body: ISignupRequest = await req.json();
    const { username, email, password } = body;

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide username, email, and password',
        } as IAuthResponse,
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: existingUser.email === email 
            ? 'Email already registered' 
            : 'Username already taken',
        } as IAuthResponse,
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = generateToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      username: newUser.username,
    });

    // Return user without password
    const userResponse = {
      _id: newUser._id.toString(),
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    // Create response with HttpOnly cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        user: userResponse,
      } as IAuthResponse,
      { status: 201 }
    );

    // Set HttpOnly cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Signup error:', error);
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        {
          success: false,
          message: messages.join(', '),
        } as IAuthResponse,
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred during signup',
      } as IAuthResponse,
      { status: 500 }
    );
  }
}
