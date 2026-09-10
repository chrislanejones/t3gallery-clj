import "server-only";

import { PostHog } from "posthog-node";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST;

/**
 * Minimal no-op stand-in used when PostHog is not configured. The previous
 * `new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!)` ran at module load, so a
 * missing/blank key took down every route that transitively imports queries.ts.
 * Analytics must never be able to break an authenticated request path.
 */
const noopClient = {
  capture: () => undefined,
  shutdown: async () => undefined,
} as unknown as PostHog;

function serverSideAnalytics(): PostHog {
  if (!POSTHOG_KEY) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[analytics] NEXT_PUBLIC_POSTHOG_KEY is not set — server-side events are disabled.",
      );
    }
    return noopClient;
  }

  return new PostHog(POSTHOG_KEY, {
    host: POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });
}

const analyticsServerClient = serverSideAnalytics();

export default analyticsServerClient;
