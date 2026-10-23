# AFCAT launch integration: engineering contract

## Branch / environment policy
- Only `feature/afcat-launch` hosts integrated AFCAT work before launch. Keep PRs #78, #79 and #80 open/unmerged until a final launch acceptance.
- Use `dp-afcat-staging` for all exploratory DDL, content and test identities. No AFCAT production API should be enabled during development.
- The staging Supabase project has a different Auth user database from production; do not mix production session cookies with staging identity.
- Preview must be explicitly environment-bound to staging and must reject requests if staging config is absent; do not silently fall back to the production Supabase URL.

## Engine contract
- GET /api/afcat/tests returns published tests only.
- POST /api/afcat/sessions creates an authenticated, test-version-pinned session; idempotency token required.
- GET /api/afcat/sessions/{id} returns exactly the user's assigned sanitized stem/options/assets; do not return `correct_option` or `explanation`.
- PATCH /api/afcat/sessions/{id}/responses validates ownership, item membership, in-progress status, elapsed server time and option before upsert.
- POST /api/afcat/sessions/{id}/submit is idempotent, runs authoritative server-side timer and scoring transaction, and freezes responses.
- GET /api/afcat/sessions/{id}/result returns answer key and explanation ONLY after authoritative submission/expiry, with RBAC ownership checks.
- Never score or enforce time client-side; UI countdown is informative.
- Update DB migration to enforce session-response state, event immutability and controlled publication under concurrent writers, with full audited staging tests.
- Preserve fixed test questions and immutable release version across reattempts.

## Product contract
- 5 full mocks, each 100 questions / 120 minutes / +3/-1; composition English 30, GA 25, Numerical 20, Reasoning 25.
- 20 sectionals (5 in each of four sections), with 500 distinct sectional questions; final section durations are pending approval.
- Fixed pools and 1000 unique IDs; no question belongs to two tests. No near-verbatim or image-equivalent duplicates.
- Detailed post-submission score, sections, accuracy, time, and question review.
- Images must be accessible, source-verified, distortion-free and mobile legible.

## Current implemented slice
- `frontend/src/lib/afcat/engine.ts`: isolated typed score, response validation, expiration primitives.
- No session API endpoints, scoring transaction, production exam attempt page or published content have been implemented in this slice.
- Prior foundation includes schema proposal, preview-only vector renderer and exam-mode shell.

## Launch gate
No `main` merge, production migration, navigation enablement, sitemap inclusion or promo until all tests and 1,000 questions pass independent acceptance and user approves the final launch.
