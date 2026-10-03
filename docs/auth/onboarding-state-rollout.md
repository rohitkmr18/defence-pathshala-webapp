# Auth/onboarding state model rollout

This branch is for review. No merge, deployment, production migration or learner write was performed. Production inspection was limited to read-only schema metadata. Supabase CLI 2.119.0 generated the migration; it was executed only in an isolated PGlite PostgreSQL test database.

## Behavior

`frontend/src/lib/auth-redirect.ts` owns destination resolution. Guests retain public Explore and targeted practice access. Authenticated incomplete users enter `/onboarding?next=...`; completed users enter the validated destination or `/dashboard`. Profile read failures enter a retryable recovery page and never fabricate completion. Proxy redirects copy refreshed session cookies and use private/no-store responses; server profile errors also remain recoverable.

`next` is carried through login/signup links, password signup confirmation, Google success/failure, setup and recovery. Explore's `returnTo` stays inside the intended practice URL and is not used as the authentication destination. External, protocol-relative, encoded auth/setup and recursive auth/setup paths are rejected. Full-paper login gating stores the selected exam/year/cycle rather than the practice listing URL.

Setup requires CDS, CAPF AC or both. Name is prefilled where available and editable but optional; target year is optional. No preparation stage is collected. Failed saves keep the inputs visible and offer retry. Successful navigation makes a fresh request.

## Persistence and compatibility

- `POST /api/onboarding` calls `public.complete_onboarding` with the authenticated user's client, then verifies the committed profile/preferences through ordinary RLS before returning success.
- `PATCH /api/profile` preserves dashboard Edit targets through `public.update_preparation_profile`; it cannot complete an incomplete profile.
- Both wrappers use one transaction implementation in the unexposed `dp_onboarding_private` schema. The narrow security-definer function is needed because authenticated users have no profile INSERT policy. It derives ownership exclusively from `auth.uid()`, accepts no ID/role arguments, fixes its search path and creates missing profiles with the student role.
- The profile is locked before modifying preferences. Profile creation, preference replacement and completion commit or roll back together. Persisted rows are checked inside the transaction and by the API afterward. Duplicate setup calls return the first completed state; a lost response/readback is safe to retry.
- Already-completed profiles are returned unchanged, including legacy exams, empty preferences, old target years and admin roles. No completion backfill/reset occurs. Target editing retains the existing broader exam choices and can retain an unchanged legacy year.
- Existing ownership RLS policies and role-protection triggers remain intact. No broad table grants or authenticated INSERT policy are added. Anonymous and service-role RPC execution is revoked. The private schema must not be exposed through the Data API.
- Legacy FastAPI `PATCH /profile` returns HTTP 410; its GET no longer creates profiles. Migrate external consumers to the web endpoints. Do not restore the non-atomic service-role writer as a fallback.

## Migration for review

`supabase/migrations/20261003093440_atomic_onboarding.sql`

Prerequisites: existing `profiles` and `user_exam_preferences` tables, ownership RLS, `auth.uid()` and role-protection trigger. This migration adds schema/functions/grants only, without reconstructing historical application tables.

The repository's `supabase/migrations` is not a complete mirror of historical production migrations. PR #9 contains separate baseline/migration reconciliation work. **Do not blindly run `supabase db push`, reset, or replay legacy numbered migrations against production.** Reconcile the ledger with the owner and PR #9 first.

On an explicitly selected disposable/staging database with the prerequisite schema, apply only the reviewed migration through the normal owner-controlled workflow. A staging-only example:

```sh
psql "$STAGING_DATABASE_URL" -v ON_ERROR_STOP=1 \
  -f supabase/migrations/20261003093440_atomic_onboarding.sql
```

Before any separately authorized rollout:

1. Confirm `dp_onboarding_private` is not exposed through PostgREST. Review owners, execute grants, empty search paths, ownership checks and the unchanged RLS/role triggers. Run Supabase advisors on the selected non-production project.
2. Apply the migration in staging. Verify schema-cache reload exposes the public RPCs to authenticated clients and rejects anonymous calls.
3. Complete the browser acceptance checks below with staging-only test users and verify the actual persisted rows under the same user. Test two concurrent database connections; PGlite queues operations and is not a multi-connection lock stress test.
4. Reconcile draft PR #12 deliberately. Keep its shared EmailOtpForm and email rollout instructions; do not restore password forms when resolving conflicts. After OTP verification, navigate with `authUrl('/auth/continue', nextUrl)` so the resolver handles incomplete users even for public destinations. Retain next on links, Google entry and retries. Mail delivery prerequisites remain separate and unverified here.
5. Ship the migration before the new frontend, and retire the legacy backend writer in the same controlled release. Neither deployment nor production migration is authorized by this task.

The user approved a branch-only Vercel deployment guard before publication. Root and frontend `vercel.json` disable Git deployments solely for `feat/auth-onboarding-state-model`; unspecified branches retain their existing behavior. Keep this guard while the PR is draft and remove it only as part of a separately authorized rollout. No production deployment or migration is authorized by PR publication.

## Verification

From repository root after installing frontend dependencies:

```sh
node --experimental-strip-types --test --experimental-test-isolation=none \
  frontend/src/__tests__/*.test.mjs \
  scripts/test-onboarding.cjs scripts/test-onboarding-db.cjs \
  scripts/test-auth-components.cjs scripts/test-auth-middleware.cjs

SUPABASE_URL=https://placeholder.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=placeholder-service-role-key \
SUPABASE_JWT_SECRET=placeholder-jwt-secret-placeholder-32-chars \
  backend/.venv/bin/python -m pytest -q backend/tests/test_profile_compatibility.py

npx --prefix frontend tsc --noEmit -p frontend/tsconfig.json
```

PGlite is a pinned development-only dependency. Tests execute the actual migration with synthetic Auth/RLS fixtures and the actual route handlers/components with mocked external dependencies. They establish no real Supabase Auth session and do not test PostgREST/SMTP/Google configuration. Component event tests are not a browser layout/accessibility check. Results are recorded in `onboarding-state-verification.md`; CI includes the auth/SQL/component/middleware suite and legacy writer checks.

## Remaining browser acceptance checks

All checks below are **pending**; no production or authenticated browser success is claimed.

- Guest Explore → targeted practice → back to the same Explore filters, with no login requirement and returnTo unchanged.
- Select a non-default CDS paper/year/cycle and, separately, CAPF AC → login/signup switch → Google/email sign-in → setup if incomplete → exact selected paper. Check refresh and back navigation.
- Direct login/signup/setup for completed users skips setup, including legacy NDA/AFCAT/empty preferences, old year and admin role. Existing attempts remain intact; Edit targets still saves.
- Guest direct setup preserves next through sign-in. External, encoded and recursive destinations fall back to dashboard.
- New and missing-profile users see one screen with name prefilled if available, required CDS/CAPF/both, optional name/year, no preparation-stage input and “Start my preparation”. Check mobile, keyboard, radio labels and error announcements.
- Profile-load errors recover through Retry without completion assumptions or lost destinations.
- Save rejection, lost response/readback and expired session keep inputs visible and never navigate prematurely. Retrying and rapid clicks/concurrent tabs yield one final profile with unique preferences.
- Refresh after success and direct onboarding skip setup. Verify ownership and role protection in staging, including two independent database connections.
- After PR #12 reconciliation, test real OTP delivery, invalid/expired codes, resend/change email and session establishment. Also test Google cancellation, expired callback and successful callback with refreshed cookies.

## Rollback

If staging acceptance checks fail, keep this PR draft and do not roll it out. After any separately authorized rollout, use a known UI/backend release that still uses the canonical authenticated writer; do not revive the non-atomic writer. Leave additive RPCs and saved preferences/completion in place until a reviewed rollback migration is needed. Never reset completion, delete learner data, loosen RLS or replay historical migrations to roll back.
