# ADR-001: Migrate to Next 15 / React 19 / Clerk 6 to clear the dependency security backlog
Date: 2026-09-04 (backfilled)   Status: draft

## Context
`pnpm audit` reported 130 vulnerabilities (2 critical) on the pinned dependency
set, flagged by Chris via a Vercel vulnerability warning. The worst was
CVE-2025-29927, a 9.1 middleware auth-bypass in Next 14.x (EOL), compounded by
drizzle-orm 0.29's unescaped-identifier SQL-injection risk and an unsupported
Clerk 5 beta. Clearing it required a major-version jump, not a patch: Sentry 7
caps Next at `^14`, uploadthing 6 caps React at `^18` — nothing could move
independently.

## Decision
Bump next 14.2.3→15.5.25, react/react-dom 18.2.0→19.2.8, drizzle-orm
0.29.4→0.45.2, @clerk/nextjs 5.0.0-beta.46→6.39.6, @sentry/nextjs
7.114.0→10.73.0, uploadthing 6.10.0→7.7.4, posthog-node 4.0.1→4.18.0, and drop
the unused `upstash` and `lucide-react` packages, in one branch
(`security/dependency-and-hardening-pass`, commits c1a951b / a611743 /
3abf80a, merged at 967d549) rather than staggering across releases. Bundled
real hardening in the same pass: deleted the unauthenticated Sentry demo
route, closed an ID-enumeration oracle in `server/queries.ts` (missing vs.
not-yours now both 404 identically), scoped ownership into the query instead
of fetch-then-compare, strict integer ID parsing, 6 security headers + a CSP,
and re-enabled the TS/ESLint build gates `next.config.js` had turned off.
Follow-up `90e3d38` pinned `engines.node: "24.x"` in package.json to override
a stale Node 20.x Vercel project setting.

## Consequences
+ `pnpm audit` 130 → 0 (0 critical/high/moderate/low); CVE-2025-29927 and the
  drizzle SQL-injection path are closed.
+ Closed a real ID-enumeration oracle and removed an unauthenticated
  attack-surface route, not just version numbers.
- No signed-in smoke test was run (no Clerk test credentials in-session) —
  sign-in, upload, delete, and cross-account ownership 404s are unverified in
  production.
- CSP shipped in report-only/permissive mode, not enforcing — still exposed to
  the class of attack it exists to stop until flipped.
- Three frameworks and an ORM moved major versions in one merge; any
  regression has a large surface to bisect across.

## Alternatives rejected
1. Patch-level fixes only, stay on Next 14 — rejected: Sentry/uploadthing
   peer ranges and the unsupported Clerk 5 beta blocked forward movement, and
   14.x is EOL so the CVE itself would stay open.
2. Stagger the migration across separate releases — rejected: the
   peer-dependency lockstep (Sentry caps Next, uploadthing caps React) meant
   splitting would leave the repo in a broken installable state mid-sequence.

## Pre-mortem
It is six months later and this decision was a mistake. Most likely reason:
an untested signed-in flow broke silently in production — Clerk 6's
session/middleware API differs enough from the 5-beta that sign-in or the
`/img/(.*)` ownership check regressed, and because no smoke test caught it
before merge, it shipped straight to prod and stayed broken until a user
reported it. Early warning sign to watch for: a spike in Clerk-side auth
errors or 404s on `/img/[id]` for legitimate owners in Sentry/PostHog after
this deploy, or a metric that used to fire (upload/delete PostHog events)
going silent.
