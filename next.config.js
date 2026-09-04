/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

import path from "node:path";
import { fileURLToPath } from "node:url";

// Pin build file-tracing to this project. Next otherwise walks up and infers the
// home directory as the workspace root (there is a stray lockfile there), which
// scopes dependency tracing over files that have no business in the deployment.
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const isDev = process.env.NODE_ENV === "development";

/**
 * Third-party origins this app legitimately talks to. Keep this list tight — every
 * entry is an origin allowed to run script in, or receive data from, a signed-in session.
 */
const CLERK = "https://*.clerk.accounts.dev https://*.clerk.com https://clerk.com";
const POSTHOG = "https://*.posthog.com https://*.i.posthog.com";
const SENTRY = "https://*.ingest.us.sentry.io https://*.ingest.sentry.io";
const UPLOADTHING =
  "https://*.uploadthing.com https://uploadthing.com https://*.ufs.sh https://utfs.io";

/**
 * Reported-only for now: flipping this to enforcing without a preview-deploy check
 * risks silently breaking Clerk/PostHog/UploadThing at runtime. Verify in a preview
 * (devtools console shows every violation), then rename the header to
 * "Content-Security-Policy" to enforce it.
 */
const csp = [
  `default-src 'self'`,
  // 'unsafe-inline' is required by Next's inline bootstrap/flight scripts; 'unsafe-eval'
  // is dev-only (React Refresh).
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval' " : ""}${CLERK} ${POSTHOG}`,
  `worker-src 'self' blob:`,
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  `font-src 'self' https://fonts.gstatic.com data:`,
  `img-src 'self' blob: data: https://utfs.io https://*.ufs.sh ${CLERK}`,
  `media-src 'self' blob: data:`,
  `connect-src 'self' ${CLERK} ${POSTHOG} ${SENTRY} ${UPLOADTHING}`,
  `frame-src 'self' ${CLERK} https://challenges.cloudflare.com`,
  // Clickjacking: nothing may frame this app.
  `frame-ancestors 'none'`,
  `form-action 'self' ${CLERK}`,
  `base-uri 'self'`,
  `object-src 'none'`,
  ...(isDev ? [] : [`upgrade-insecure-requests`]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy-Report-Only", value: csp },
  // Redundant with frame-ancestors above, but covers browsers/proxies that ignore CSP.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

/** @type {import("next").NextConfig} */
const coreConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "*.ufs.sh" },
    ],
  },
  outputFileTracingRoot: projectRoot,
  // Never let a Next version leak in response headers.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // These gates stay ON. `eslint-plugin-drizzle` is configured with
  // enforce-delete-with-where / enforce-update-with-where as errors — turning
  // ignoreDuringBuilds back on would let an unscoped `db.delete()` ship.
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

import { withSentryConfig } from "@sentry/nextjs/config";

// Sentry v8+ takes a single options object; `transpileClientSDK` and
// `hideSourceMaps` were removed (source maps are now deleted after upload).
const config = withSentryConfig(coreConfig, {
  org: "webjaxdrive",
  project: "t3gallery",

  // Suppresses source map uploading logs during build
  silent: true,

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  sourcemaps: {
    // Do not leave source maps sitting in the deployed bundle after upload.
    deleteSourcemapsAfterUpload: true,
  },

  webpack: {
    // Tree-shake Sentry logger statements to reduce bundle size.
    treeshake: { removeDebugLogging: true },
    // Automatic instrumentation of Vercel Cron Monitors.
    automaticVercelMonitors: true,
  },
});

export default config;
