import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define protected paths (pages that require authentication)
  const protectedPaths = ["/moods", "/logmood", "/profile"];

  // Define public paths (pages that don't require authentication)
  const publicPaths = ["/", "/login", "/signup"];

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some((protectedPath) =>
    path.startsWith(protectedPath)
  );

  // Get the token from cookies (matches your login route cookie name)
  const token = request.cookies.get("token")?.value;

  // If it's a protected path and no token exists, redirect to login
  if (isProtectedPath && !token) {
    console.log(`Redirecting unauthenticated user from ${path} to /login`);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is logged in and tries to access login/signup, redirect to home
  if (token && (path === "/login" || path === "/signup")) {
    console.log(`Redirecting authenticated user from ${path} to /`);
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure which paths this middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
