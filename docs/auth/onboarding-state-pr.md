# Implement the auth/onboarding state model and atomic setup

Authenticated users with incomplete setup now reach one setup screen; completed users reach their validated destination and skip repeat setup. Profile failures show recoverable errors instead of inventing completion. Guest Explore and targeted practice remain public. Login/signup, Google callbacks, setup and retries preserve next; Explore returnTo stays separate. Full-paper login gates retain the selected exam/year/cycle.

Setup requires CDS, CAPF AC or both, prefills optional name, offers optional year and collects no preparation stage. One authenticated transaction creates a missing profile, locks it, saves unique exam preferences and marks completion, verifying persisted rows before returning. The API verifies the committed RLS-protected result. Repeated setup leaves completed legacy users unchanged. Dashboard target editing uses the same transaction implementation; the legacy non-atomic backend writer returns 410. Failed saves retain visible inputs and permit retry.

Migration: `supabase/migrations/20261003093440_atomic_onboarding.sql`. No production migration, merge or deployment has been performed. Review migration prerequisites/history, unexposed private schema, execute grants, ownership checks and unchanged RLS/role triggers. Apply and verify in staging before a separately authorized rollout.

User-approved root/frontend Vercel guards disable Git deployments only for this PR branch; no other branch is disabled.

Validation: 59 JS/SQL/component/middleware tests and 2 new backend compatibility tests passed; TypeScript, changed-file ESLint and isolated production build passed. Full repo lint still has 41 existing errors/46 warnings (main: 42/46). Broad backend tests: 16 passed, 7 existing live-data tests failed with placeholder credentials/missing Sheets configuration. Local Chromium guest login/signup, onboarding redirect and exact-paper gate checks passed with placeholder credentials. Real authenticated browser, PostgREST and two-connection concurrency acceptance remain pending.

Runbook and acceptance checklist: `docs/auth/onboarding-state-rollout.md`. Evidence/limits: `docs/auth/onboarding-state-verification.md`. Reconcile draft email OTP PR #12 by keeping its shared form and using `/auth/continue` after verification; mail delivery remains a separate prerequisite.
