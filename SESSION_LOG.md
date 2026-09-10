# Session log — security pass

**Date:** 2026-09-04 → 2026-09-05
**Branch:** `security/dependency-and-hardening-pass` (2 commits, not pushed)
**Scope:** security vulnerabilities only

## Result

| Gate | Before | After |
|---|---|---|
| `pnpm audit` total | 130 | **0** |
| — critical | 2 | **0** |
| — high | 68 | **0** |
| — moderate | 52 | **0** |
| — low | 8 | **0** |
| `tsc --noEmit` | 2 errors | **clean** |
| `next lint` | 1 parse error | **clean, 0 warnings** |
| Production build | green (gates off) | **green (gates on)** |

## Commits

| SHA | What |
|---|---|
| `c1a951b` | Dependency patches + auth/query hardening |
| `a611743` | Next 15 / React 19 / Clerk 6 migration |

## Dependency moves

| Package | From | To | Driver |
|---|---|---|---|
| next | 14.2.3 | 15.5.25 | CVE-2025-29927 (9.1) + 20 more; 14.x is EOL |
| react / react-dom | 18.2.0 | 19.2.8 | required by Next 15 App Router |
| drizzle-orm | 0.29.4 | 0.45.2 | SQL injection via unescaped identifiers |
| @clerk/nextjs | 5.0.0-beta.46 | 6.39.6 | off an unsupported beta; clerk-react auth bypass |
| @sentry/nextjs | 7.114.0 | 10.73.0 | Sentry 7 peer-caps next at ^14 |
| uploadthing | 6.10.0 | 7.7.4 | @uploadthing/react 6 caps react at ^18 |
| posthog-node | 4.0.1 | 4.18.0 | pulls axios 1.6 → 1.20 (SSRF/DoS) |
| `upstash` | 0.0.1 | **removed** | unused, unmaintained, adjacent to `@upstash/*` |
| lucide-react | 0.378.0 | **removed** | imported nowhere; React 19 peer blocker |

Plus `pnpm.overrides` pinning 22 transitive packages. The `effect` override
(3.22.1) sits inside `@effect/platform`'s own `^3.17.7` peer range — it is not
forced past uploadthing's stated compatibility.

## Hardening

| Fix | File |
|---|---|
| Deleted always-throwing unauthenticated Sentry demo route + page | `api/sentry-example-api`, `sentry-example-page` |
| Closed ID-enumeration oracle (one `notFound()` for missing *and* not-yours) | `server/queries.ts` |
| Ownership scoped into the query rather than fetch-then-compare | `server/queries.ts` |
| Delete verifies a row was hit before emitting analytics | `server/queries.ts` |
| Strict integer ID parsing (`Number()` accepted `0x0c`, `" 12 "`, `1e9`) | `queries.ts`, `full-page-image-view.tsx` |
| 6 security headers + CSP; `poweredByHeader: false` | `next.config.js` |
| Re-enabled TS/ESLint build gates (were masking drizzle's delete-with-where rule) | `next.config.js` |
| `outputFileTracingRoot` pinned (Next was inferring `$HOME` as workspace root) | `next.config.js` |
| Middleware protects `/img(.*)` (was guarding a `/dashboard` that never existed) | `middleware.ts` |
| PostHog init guarded; replay masking on; `sendDefaultPii: false` all runtimes | `analytics.ts`, `instrumentation-client.ts`, sentry configs |

## Next session picks up

1. **Signed-in smoke test** — nothing signed-in was verified; no Clerk credentials
   available in-session. Sign-in, grid, `/img/[id]` modal, upload, delete.
   Ownership checks: `/img/999999` and a second account hitting a first account's
   `/img/<n>` must both return **404 identically**.
2. **Flip CSP to enforcing** at `next.config.js:54` — only after a preview deploy
   shows no console violations on a signed-in session.
3. **Resolve the deployment target** — see PARKING_LOT.
4. **Push the branch / open a PR** — still local.

`UPLOADTHING_TOKEN` was set on 2026-09-05 and verified: `GET /api/uploadthing`
returns 200 with route config, no token errors.
