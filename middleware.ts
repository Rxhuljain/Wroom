import { clerkMiddleware } from '@clerk/nextjs/server';

// Define public routes
const publicRoutes = ['/sign-in', '/sign-up', '/login'];

export default clerkMiddleware((auth, request) => {
  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  // If the route is not public, enforce authentication
  if (!isPublicRoute) {
    auth.protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)'], // Exclude static files and _next directory
};