import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check for bearer token in Authorization header (for API routes)
  // For client-side routes, let the layout handle authentication
  // This prevents middleware from blocking navigation between profile pages
  
  // Only redirect public routes if we detect a session cookie
  // Since bearer tokens are in localStorage, we can't check them server-side
  // The client-side layout will handle authentication checks for profile routes
  
  // Allow all routes - authentication will be handled client-side by layouts
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
