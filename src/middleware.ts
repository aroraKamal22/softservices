import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that don't require authentication
const publicRoutes = ["/login", "/forgot-password", "/reset-password", "/qr"];

// Routes that require specific permissions
const protectedRoutes: Record<string, string[]> = {
  "/settings": ["settings:read"],
  "/settings/users": ["users:manage"],
  "/settings/roles": ["roles:manage"],
};

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow API routes for auth
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Allow static files
  if (pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // Check authentication using JWT token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only",
  });

  if (!token) {
    // Redirect to login if not authenticated
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check permissions for protected routes
  for (const [route, requiredPermissions] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route)) {
      const userPermissions = (token.permissions as string[]) || [];
      const hasPermission = requiredPermissions.some((perm) =>
        userPermissions.includes(perm)
      );

      if (!hasPermission) {
        // Redirect to dashboard if no permission
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
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
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
