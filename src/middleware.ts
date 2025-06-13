import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/payment(.*)",
  "/api(.*)",
  "/privacy-policy",
  "/terms-of-service",
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId, redirectToSignIn } = await auth();
  // Protect the root `/` route explicitly
  console.log('dashboard');
  if (!userId && !isPublicRoute(request)) {
    console.log('redirect to signin');

    await auth.protect();
    return redirectToSignIn();
  }

  // If user is logged in and trying to access "/" or "/dashboard", redirect to "/dashboard/approval"
  if (userId && ["/dashboard"].includes(request.nextUrl.pathname)) {
    console.log('redirect to appointment');

    return Response.redirect(
      new URL("/dashboard/appointment", request.nextUrl)
    );
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
