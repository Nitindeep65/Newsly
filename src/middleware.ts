import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";
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
  "/api/newsletter/auto(.*)",  // Allow cron job access
]);

// Helper to get user email from Clerk
async function getUserEmail(userId: string): Promise<string | null> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return user.emailAddresses?.[0]?.emailAddress || null;
  } catch (error) {
    console.error("Error fetching user email:", error);
    return null;
  }
}

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  
  // Skip protection for public routes (like cron endpoints)
  if (isPublicRoute(req)) {
    return;
  }
  
  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  
  // Check if user is trying to access admin routes
  if (isAdminRoute(req) && userId) {
    const userEmail = await getUserEmail(userId);
    
    // If not admin, redirect to user dashboard
    if (userEmail !== ADMIN_EMAIL) {
      return NextResponse.redirect(new URL("/my-newsletters", req.url));
    }
  }
  
  // If admin user lands on /my-newsletters, redirect to admin panel
  if (req.nextUrl.pathname === "/my-newsletters" && userId) {
    const userEmail = await getUserEmail(userId);
    
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
