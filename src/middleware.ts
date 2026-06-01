import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

// Public paths that do not require authentication
const PUBLIC_PATHS = ["/", "/login", "/signup", "/case-study"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Exclude API routes, next-assets, static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const tokenCookie = request.cookies.get("token");
  const token = tokenCookie?.value;

  let user = null;
  if (token) {
    user = await verifyToken(token);
  }

  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  // If user is authenticated and tries to visit auth pages, redirect to dashboard
  if (user && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user is NOT authenticated and tries to visit private pages, redirect to login
  if (!user && !isPublicPath) {
    const loginUrl = new URL("/login", request.url);
    // Remember past page for seamless UX redirect
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication APIs)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
