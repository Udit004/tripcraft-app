import { NextRequest, NextResponse } from 'next/server';
import { checkAuthentication } from '@/lib/verifyUser';

export async function GET(req: NextRequest) {
  const { isAuthenticated, user, error } = await checkAuthentication(req);

  if (!isAuthenticated) {
    return error!;
  }

  const userResponse = {
    _id: user._id.toString(),
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return NextResponse.json(
    {
      success: true,
      message: 'User verified',
      user: userResponse,
    },
    { status: 200 }
  );
}
