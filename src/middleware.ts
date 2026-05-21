import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Middleware for route protection.
 *
 * Uses getToken() (JWT-based, edge-compatible) instead of auth()
 * which imports Prisma and cannot run in the Edge runtime.
 */

// Routes that require authentication
const protectedRoutes = ["/(dashboard)", "/hc-service", "/self-service", "/employee", "/company-hierarchy", "/resign-report"];

// Routes that only guests can access (redirect if already logged in)
const guestOnlyRoutes = ["/login", "/register"];

// API routes that need authentication
const protectedApiPrefixes = ["/api/employees", "/api/leave", "/api/attendance", "/api/overtime", "/api/resign"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Get JWT token (edge-compatible, doesn't need Prisma)
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const isLoggedIn = !!token;
  const userRole = token?.role as string | undefined;

  // Check if path starts with any protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if path is guest only
  const isGuestOnlyRoute = guestOnlyRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if API route needs protection
  const isProtectedApi = protectedApiPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // Redirect logged-in users away from guest-only pages
  if (isLoggedIn && isGuestOnlyRoute && pathname !== "/") {
    const redirectUrl = new URL("/(dashboard)", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect guests to login
  if (!isLoggedIn && isProtectedRoute) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // API routes without auth return 401
  if (isProtectedApi && !isLoggedIn) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Role-based route protection for HC Service
  if (pathname.startsWith("/hc-service") && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Admin-only routes check
  const adminOnlyRoutes = [
    "/hc-service/parameter",
    "/hc-service/leave-admin",
    "/hc-service/resign-claim",
    "/hc-service/user-locked",
  ];

  const isAdminRoute = adminOnlyRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isAdminRoute && userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
    // Redirect non-admins trying to access admin routes
    const dashboardUrl = new URL("/(dashboard)", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/auth (NextAuth routes)
     * - login and register pages
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/auth|login|register|$).*)",
  ],
};