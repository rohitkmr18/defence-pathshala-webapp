# Verification environments

CI uses Node 24 (matching Vercel) and Python 3.11. Install backend/requirements.txt before imports/tests. Root requirements.txt belongs to the legacy Streamlit application; pyproject.toml defines deployment metadata only.

Backend conftest replaces the Supabase service boundary before app import. Test-only localhost configuration is used only in tests; no live production requests or secrets are required. Frontend DP_OFFLINE_BUILD=1 skips SEO metadata fetch only in isolated builds, with explicitly local test key configuration. Never configure DP_OFFLINE_BUILD on Vercel.

Prior hardening passed all local gates. After reconciling main c0bf584, TypeScript, ESLint (0 errors, 46 visible warnings) and 32 frontend tests pass; the combined build/backend verification is rerun before publication. No lint rules were disabled or downgraded.

Frontend tests execute the real Next route handlers with only Auth/DB boundaries replaced. They cover session creation, server scoring from canonical final_opt, persistence, completion and own-user dashboard reads; cross-user session linkage/update denial; guest no-write behavior; persistence errors; missing migration/configuration; unreleased questions/invalid answers; canonical count failures without master-table fallback; auth callback missing/failing/successful exchange. These are offline route tests, not proof of a real authenticated deployed UI or OAuth exchange.

React lint fixes move time reads into effects, derive valid selections, reset modal forms by remounting and cancel stale requests. Existing 54 warnings are retained as visible debt. Local Python is 3.12.14; remote CI targets 3.11 and has not run.

On 3 October, GitHub branch creation succeeded: phase-0/remaining-baseline-hardening. The previous publishing blocker no longer applies. Repository administration remains unavailable (branch protection GET returns 403), and main remains unprotected. Live main c0bf584 has green original CI and a matching READY Vercel production deployment, but the stronger hardening workflow still requires its own remote run and preview verification.
