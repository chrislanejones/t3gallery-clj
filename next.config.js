/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

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
    remotePatterns: [{ hostname: "utfs.io" }],
  },
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

import { withSentryConfig } from "@sentry/nextjs";

const config = withSentryConfig(
  coreConfig,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "webjaxdrive",
    project: "t3gallery",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    // tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  },
);

export default config;
