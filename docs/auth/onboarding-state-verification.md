# Auth/onboarding verification

Base: latest inspected main `8b5b7ca` (including Google auth #11, onboarding persistence #10 and canonical reads #13). Branch: `feat/auth-onboarding-state-model`. Open PRs inspected: email OTP draft #12, baseline hardening #9 and #1. OTP preview implementation and rollout notes were reviewed before implementing; its UI/mail work is not duplicated.

## Passed

- 70 JavaScript/component/middleware/OTP/onboarding SQL tests on both Node 24.19.0 and CI-compatible Node 22.22.0. Includes 10 onboarding migration tests in isolated PGlite 0.5.8, API persistence/readback failure tests, repeated submissions, legacy-user and target-editor compatibility, direct entry routing, redirect validation, intent/returnTo preservation, exact paper selection, visible input retention and refreshed redirect cookies.
- 2 separate recorded-ledger/fresh-reconstruction tests passed in PGlite, including all 14 recorded SQL migrations and completed legacy user/role protection checks.
- 25 backend tests passed with explicit offline service fixtures, including legacy-profile compatibility and configured-project JWT issuer checks.
- Full 21-file reconstruction passed in a network-isolated local Docker PostgreSQL instance; two independent SQL connections converged on one completed profile and two unique exam preferences. Auth/Storage are synthetic stubs, not live Supabase services.
- TypeScript `tsc --noEmit`.
- Targeted ESLint for every changed frontend TS/TSX/test file: 0 errors/warnings.
- Isolated Next.js production build with placeholder Supabase credentials. SEO query failure against the placeholder was expected and did not fail the build.
- Root `npm run verify`: isolated production build and backend import both passed.
- `git diff --check`.
- Earlier local Chromium guest smoke with placeholder credentials: login/signup links retain the exact paper intent; direct guest onboarding redirects to login with the same next; the direct full-paper gate links to login with the selected CDS 2024 II paper. No browser page errors were reported on these screens. Authenticated provider/database flows were not attempted.

- Reconciled OTP guest UI smoke: login/signup expose Google and email-code entry, contain no password fields, retain exact-paper next links, and report no page errors. No provider request was sent.

## Failed/environment-dependent

- Full repo ESLint: 41 errors and 46 warnings. A detached comparison of main at `8b5b7ca` found 42 errors and 46 warnings; no new error locations/rules were introduced. Existing admin, question-bank, analytics and other errors remain outside this change.
- The previous 7 live-configuration-dependent backend failures are now exercised with PR #9's offline boundary/Sheets fixtures: all 25 backend tests pass without live configuration. This does not verify production data/Sheets integration.

## Pending/blocked

- Authenticated browser acceptance, real Google/password/OTP delivery/session establishment and PostgREST integration are untested. No production or authenticated browser success is claimed.
- PGlite exercises transaction rollback and queued duplicate saves with one connection. A local Docker PostgreSQL test passed with two independent connections; live Supabase concurrency/lock acceptance remains pending on staging.
- Supabase advisors/full service startup were not run against a non-production Supabase instance. The RPC/migration was not installed in production.
- Supabase changelog fetch was blocked by network policy (403); the documentation MCP lookup succeeded.
- The user explicitly approved the branch-only deployment guard. Root/frontend configs disable Git deployments only for `feat/auth-onboarding-state-model`; both parsed JSON and branch scope were checked before publication. Remote CI/deployment observations are reported in the draft PR and final handoff.

- Production source-ledger reconciliation is verified on this branch only; main/hosted history status was not changed. All 14 recorded SQL statements match local files; onboarding alone is pending. See [reconciliation and staging plan](repository-reconciliation.md).

## Reproduce

Commands and remaining acceptance checklist: [rollout instructions](onboarding-state-rollout.md).

Node 22 CI compatibility passed using `--experimental-test-isolation=none`; Node 24 accepts the same flag. The stable spelling was corrected before publication. No in-progress checks remain.
