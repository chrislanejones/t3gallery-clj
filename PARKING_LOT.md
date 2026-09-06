# Parking lot

Adjacent problems found but deliberately kept out of the diff.

| Item | Found | Detail |
|---|---|---|
| No Vercel project for t3gallery | 2026-09-04 | No project under `chrislanejones-projects` (only scope, 21 projects), no `.vercel` link. Repo looks deploy-ready but is not deployed anywhere known. Deployment target unresolved. |
| `@vercel/postgres` deprecated | 2026-09-04 | Upstream deprecation notice on install: Vercel Postgres migrated to Neon; wants you on Neon's SDK. Currently on 0.10.0. Data-layer change — Vivek's lane. |
| No rate limiting | 2026-09-04 | Removed in `816cb73`. `@upstash/ratelimit` still installed but unwired. Upload route is gated behind the `can-upload` metadata flag so it is not an unauthenticated vector, but 40 files × 4MB per request with no throttle is worth revisiting. Needs Upstash credentials. |
| `drizzle-kit push` not run | 2026-09-04 | Bumped drizzle-kit 0.21 → 0.31 against a DB created by 0.21. Schema file is unchanged, but review what `pnpm db:push` proposes before applying. Not run in-session — no unattended DB writes. |
| Unused deps: `postgres`, `pg` | 2026-09-04 | Neither imported; app uses `@vercel/postgres`. Left in place — removal is hygiene, not security. |
| `next lint` deprecated | 2026-09-05 | Removed in Next 16. Migrate with `npx @next/codemod@canary next-lint-to-eslint-cli .` |
| ADR not written | 2026-09-05 | Drizzle 0.29 → 0.45 and the Next/React/Clerk major migration are arguably trigger-level. Dara's call. |
