// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Routes that must never be reachable while signed out.
 *
 * NOTE: this is defence in depth, not the security boundary. Middleware can be
 * skipped (see CVE-2025-29927) and does not run on every rendering path, so every
 * data access in `src/server/queries.ts` re-checks `auth()` and ownership itself.
 * Never move an authorisation check up here and drop it from the query layer.
 *
 * `/` is deliberately left open: it renders its own signed-out state via Clerk's
 * <SignedOut> and reads no data until <SignedIn> gates it.
 */
const isProtectedRoute = createRouteMatcher(["/img(.*)", "/dashboard(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next internals and static files, but always run on API routes.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
