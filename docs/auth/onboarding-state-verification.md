# Auth/onboarding verification

Base: latest inspected main `8b5b7ca` (including Google auth #11, onboarding persistence #10 and canonical reads #13). Branch: `feat/auth-onboarding-state-model`. Open PRs inspected: email OTP draft #12, baseline hardening #9 and #1. OTP preview implementation and rollout notes were reviewed before implementing; its UI/mail work is not duplicated.

## Passed

- 59 JavaScript/SQL/component/middleware tests on both Node 24.19.0 and CI-compatible Node 22.22.0. Includes 10 real PostgreSQL migration tests in isolated PGlite 0.5.8, API persistence/readback failure tests, repeated submissions, legacy-user and target-editor compatibility, direct entry routing, redirect validation, intent/returnTo preservation, exact paper selection, visible input retention and refreshed redirect cookies.
- 2 new backend legacy-profile compatibility tests with mocked database and placeholder credentials.
- TypeScript `tsc --noEmit`.
- Targeted ESLint for every changed frontend TS/TSX/test file: 0 errors/warnings.
- Isolated Next.js production build with placeholder Supabase credentials. SEO query failure against the placeholder was expected and did not fail the build.
- Root `npm run verify`: isolated production build and backend import both passed.
- `git diff --check`.

## Failed/environment-dependent

- Full repo ESLint: 41 errors and 46 warnings. A detached comparison of main at `8b5b7ca` found 42 errors and 46 warnings; no new error locations/rules were introduced. Existing admin, question-bank, analytics and other errors remain outside this change.
- Broad backend suite with placeholder credentials: 16 passed, 7 failed. Failing existing tests require Google Sheets and a reachable live question database: sync dry run, sync stats, analytics dashboard, practice filters/count/questions/intelligence. GOOGLE_SHEET_ID was not configured and the placeholder Supabase host was denied by the proxy. No production credentials/data were used to satisfy these tests.

## Pending/blocked

- Authenticated browser acceptance, real Google/password/OTP delivery/session establishment and PostgREST integration are untested. No production or authenticated browser success is claimed.
- PGlite exercises real transaction rollback and queued duplicate saves, but has one connection. True concurrent connection/lock acceptance remains pending on staging.
- Supabase advisors/full service startup were not run against a non-production Supabase instance. The RPC/migration was not installed in production.
- Supabase changelog fetch was blocked by network policy (403); the documentation MCP lookup succeeded.
- Publishing the draft PR is blocked by automatic approval rejection of the proposed branch-only deployment guard. No branch was pushed and no deployment config was changed. Root/frontend `git.deploymentEnabled` mapping solely for this branch is the concrete proposal; its application requires explicit approval.

## Reproduce

Commands and remaining acceptance checklist: [rollout instructions](onboarding-state-rollout.md).

Node 22 CI compatibility passed using `--experimental-test-isolation=none`; Node 24 accepts the same flag. The stable spelling was corrected before publication. No in-progress checks remain.
