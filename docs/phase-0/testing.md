# Phase 0 verification environments — 3 October 2026 UTC

See [report.md](report.md) for the current verdict and [runbook.md](runbook.md) for blocked real journeys. **Offline coverage does not clear Phase 0.**

## Mandatory gates

Install `npm ci --prefix frontend` from the lockfile and backend/requirements.txt into an isolated virtual environment. CI targets Node 24 and Python 3.11; local Node is 24.19.0 and Python is 3.12.14. The root Streamlit requirements file is not authoritative for FastAPI.

Run TypeScript; every frontend `*.test.mjs` using Node's type stripping/test runner; `python -m pytest backend/tests -q`; isolated frontend production build; mandatory ESLint; root `npm run verify`. No rule was disabled or failure ignored. Current local results: **48 frontend tests, 26 backend tests, TypeScript PASS, lint 0 errors/45 visible warnings, isolated build/root verify PASS**.

Frontend route tests transpile and execute real handlers while replacing only Auth/DB/network boundaries. Full Paper tests execute the real component in an offline deterministic hook/event harness. These are mocks, not authenticated deployed verification. Supabase boundaries fail offline rather than use live credentials. Backend conftest installs local test configuration/service doubles before app import. JWT tests use the conftest offline secret, never a live signing secret.

Builds explicitly unset live service/JWT/admin/backend variables and supply localhost/test-only frontend configuration with DP_OFFLINE_BUILD=1. **Never configure DP_OFFLINE_BUILD or test-only values on Vercel.** Next.js 16 bundled route-handler, cookies and authentication documentation and frontend/AGENTS.md were read before edits.

Local test subprocesses need the supported workspace process/network permission to execute the full Node child test runner. Restricted execution initially showed only file-level test counts; authoritative reruns show all 48 named tests. This permission does not authorize live credentials or bypass the destination host policy.

## Race and failure contracts

Coverage includes a delayed create with first answer, session switch before create response, failed creation/local-only IDs, serialized progress, late responses, skipping, expiry returning guest success, unsaved-answer storage/retry after reload, duplicate in-flight first answer/completion, completion failure, timed owned attempt persistence, retake identity and exact requested resume order/index/answers. Cloud-linked local resume verifies current-account ownership before returning cached progress.

Full Paper coverage proves no question load/session/timer before auth, answer progress, confirmed submit before debrief and timer expiry through the same persistence path. Admin proxy coverage verifies bearer forwarding, absence of shared-key headers, learner/expired-session denial. Backend tests verify legacy header denial and issuer validation.

## Database and browser boundaries

The guarded local reconstruction ran 19 files in a new Docker PostgreSQL database with Auth/Storage stubs, all recorded migrations, legacy prerequisites/observed grants and rolled-back synthetic fixtures. FKs/indexes/RLS, answer and eligibility/pattern lineage, owner history, cross-user linkage denial and denied learner editorial writes pass. Real frozen-release import and full Supabase services remain unproved.

A local built login page was checked with agent-browser/system Chromium: Google button and expected form render; no blank page, framework overlay or recorded page errors. Direct production/preview browser navigation is blocked by workspace egress policy. No interactive Google login handoff or two-identity preview write test occurred.

Connected Vercel read-only fetches passed 14 checks each on unchanged production and the recorded 28fe18f preview: public/canonical pages, Explore/practice/Full Paper shells, metadata/filters/questions/count, missing-code callback, empty guest history, unauthenticated admin denial. The preview compiled bundle targets production Supabase. These GET checks never establish the signed-in learning/debrief/recommendation flow.

## Evidence

Current logs and SQL/advisor/migration/public-check receipts are under `docs/phase-0/evidence/*20261003*`. Current-head CI/deployment results must be checked on PR #9; the original checkpoint's green CI and preview were refreshed but do not substitute for new-head checks. Known remaining debt includes ambiguous committed-write/lost-response server idempotency, client session-summary validation and Full Paper elapsed-time restoration.
