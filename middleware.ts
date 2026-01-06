import { NextRequest, NextResponse } from 'next/server';
import { checkAuthentication } from '@/lib/verifyUser';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value; // Adjust cookie name if different
  
  // Check if user is authenticated
  let isAuthenticated = false;
  if (token) {
    try {
      await checkAuthentication(token);
      isAuthenticated = true;
    } catch (error) {
      isAuthenticated = false;
    }
  }

  const pathname = request.nextUrl.pathname;

  // If user is logged in and tries to access login/signup, redirect to dashboard
  if (isAuthenticated && (pathname === '/login' || pathname === '/signup' || pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is NOT logged in and tries to access protected pages, redirect to login
  if (!isAuthenticated && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Define which routes to apply middleware to
export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/dashboard/:path*',
    '/((?!api|_next/static|_next/image|public).*)',
  ],
};