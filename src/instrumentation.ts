import * as Sentry from "@sentry/nextjs";

/**
 * Sentry v8+ initialises the server and edge SDKs from here rather than from
 * auto-loaded sentry.{server,edge}.config.ts files.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
