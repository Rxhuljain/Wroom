import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/sign-in', '/sign-up', '/login'];

export default clerkMiddleware(async (auth, request) => {
  try {
    // Safeguard against undefined nextUrl
    if (!request.nextUrl) {
      return NextResponse.next();
    }

    // Check if the current route is public
    const isPublicRoute = publicRoutes.some(route =>
      request.nextUrl.pathname.startsWith(route)
    );

    // Protect non-public routes
    if (!isPublicRoute) {
      await auth.protect();
    }
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.error();
  }
});

// Optional: Export the config to match only specific paths
export const config = {
  matcher: ['/((?!.*\\..*|_next).*)'], // Exclude static files and _next directory
};