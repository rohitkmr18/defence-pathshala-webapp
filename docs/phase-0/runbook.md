# Release and recovery runbook

## Release gates
1. Publish phase-0 branch against main. Run Build & Verify, including lint; all must pass. Local lint is now green, but remote CI must independently pass.
2. Require Build & Verify for main using a GitHub branch rule/ruleset, including administrators where feasible. Main is currently unprotected and the connected GitHub App cannot change administration settings.
3. Verify Vercel preview against the exact PR SHA. Confirm environment variable NAMES/targets without exposing values. Verify BACKEND_URL if FastAPI is deployed; absence deliberately uses Supabase on supported read paths. Mandatory sync endpoints fail explicitly if unconfigured.
4. Apply reviewed SQL only from supabase/migrations; compare the remote migration list first. The Phase 0 SQL is already applied to production with the exact versions recorded in filenames. Do not reapply it.
5. Merge only after green checks and authenticated preview write-path verification. Verify production SHA equals the approved merge SHA.
6. Run scripts/production-smoke.py, browser learner/full-paper tests, Vercel production error logs, and both Supabase advisors after significant releases.

## Rollback
Production remains at 6426adb116e69a29c3b1dc888de04bcda5f49593 during this session. Its Vercel deployment is dpl_2UJtQqoHoRq4wop7uMjcafWptr8M. After a future code release, use Vercel rollback/promote to the last verified deployment, then verify domain mapping and smoke tests.

Database changes in this phase are additive schema plus authorization tightening. Keep practice tables/columns when rolling code back: the old app can coexist with them. Preserve learning history; never drop new tables/columns as an automated rollback. Repair forward if a schema issue occurs. Do not restore the insecure authenticated ALL editorial policies to cure an application permission error.

## Schema reproduction debt
Production's original profile/current-affairs schema and data imports predate tracked Supabase migration history; two migration directories exist. Future changes have one path: supabase/migrations. A clean staging reset including the historical schema and frozen snapshot import is still required before declaring full reproduction. Do not replay historical UPDATE/promote scripts blindly against a populated database.

## Test boundaries
Public production checks are read-only; browser practice used a guest without cloud history writes. Database authorization/write tests ran in transactions rolled back in full. Authenticated learner UI, Google OAuth exchange and persisted full-paper submission remain unverified without an appropriate signed-in preview test account.

## Observability
Check CI job and SHA → Vercel deployment and SHA → error logs/status counts → Supabase security/performance advisors. A query yielding no log rows is limited evidence, not assurance of no errors. HTTP elapsed times measured from this remote environment include network overhead and must not be called Core Web Vitals or used as user latency SLOs.
