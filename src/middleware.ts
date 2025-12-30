import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Admin email - only this user can access admin panel
const ADMIN_EMAIL = "nitindeep65@gmail.com";

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/my-newsletters(.*)",
  "/admin-panel(.*)",
  "/api/subscribers(.*)",
  "/api/newsletter(.*)",
]);

// Define admin-only routes
const isAdminRoute = createRouteMatcher([
  "/admin-panel(.*)",
]);

// Define public routes that should bypass auth
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/subscribe(.*)",
  "/pricing(.*)",
  "/tools(.*)",
  "/api/tools(.*)",
  "/api/phonepe/webhook(.*)",
  "/api/cron(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  
  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  
  // Check if user is trying to access admin routes
  if (isAdminRoute(req) && userId) {
    const userEmail = sessionClaims?.email as string | undefined;
    
    // If not admin, redirect to user dashboard
    if (userEmail !== ADMIN_EMAIL) {
      return NextResponse.redirect(new URL("/my-newsletters", req.url));
    }
  }
  
  // If admin user lands on /my-newsletters, redirect to admin panel
  if (req.nextUrl.pathname === "/my-newsletters" && userId) {
    const userEmail = sessionClaims?.email as string | undefined;
    
    if (userEmail === ADMIN_EMAIL) {
      return NextResponse.redirect(new URL("/admin-panel", req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
