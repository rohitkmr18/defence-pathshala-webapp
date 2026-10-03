# Phase 0 baseline — 2026-10-02 UTC

Captured before source/schema changes.

- Main: `6426adb116e69a29c3b1dc888de04bcda5f49593`; clean clone.
- Production: Vercel `dpl_2UJtQqoHoRq4wop7uMjcafWptr8M`, READY, same SHA, custom domains mapped. Node 24.x.
- CI push run `37050468541`: frontend build passed; backend import failed with missing FastAPI. Python setup/install occurs AFTER the combined verification, so those steps were skipped. CI Node 20 conflicts with Supabase dependency engines >=22.
- Main unprotected; rulesets empty. Connector branch-administration endpoint returns 403 despite repository metadata advertising admin/push permissions.
- Open PR #1 runs main toward legacy repository-foundation branch; unrelated to this work.
- Production `afhwegrxnvgsqbqadvwr`: questions=1821; canonical v2 rows=1821. v1/v2 views security_invoker=true. Lab untouched.
- `practice_sessions`, attempts.session_id and attempts.mode absent. Repository legacy migration 010 exists but permits NULL ownership and needs correction before deployment.
- user_attempts RLS enabled, no policies; service-role server routes currently bypass RLS.
- Current Affairs authenticated ALL policies use true: any signed-in user can modify editorial data. Admin helper also trusts user-editable metadata.role.
- Definer trigger functions handle_new_user/prevent_role_change have public execute grants; update_updated_at_column has mutable search_path.
- Profiles/preferences policies repeatedly evaluate auth.uid(); two Current Affairs foreign keys unindexed.
- Password leak protection disabled. Advisor no-policy warnings on release/snapshot/stage/backups may be intentional private access; do not add blanket public policies.
- Multiple localhost fallbacks remain in server helpers and browser admin component.
- Runtime error log query over preceding 24h returned no entries; this is not proof of no errors.
- Backend requirements.txt is pinned; root requirements.txt belongs to legacy Streamlit; backend pyproject has metadata but no dependency declarations.

## Initial severity
P0: editorial database authorization and mutable user metadata admin bypass; missing persistence schema; unprotected release gate.
P1: CI ordering/runtime mismatch, false-success persistence responses, localhost fallback.
P2: indexes/RLS evaluation; legacy migration duplication.

## Change log
Baseline captured. No question data modified.

## Reconciliation matrix
| Contract | Repository before | Production before | Planned action |
|---|---|---|---|
| practice_sessions | legacy 010 draft | absent | additive migration, non-null ownership |
| user_attempts.session_id | legacy 010 draft | absent | nullable UUID FK + ownership trigger |
| user_attempts.mode | legacy 010 draft | absent | additive text column |
| attempts SELECT RLS | absent live | absent | authenticated owner only |
| session RLS | draft permits NULL | absent | authenticated owner SELECT/INSERT/UPDATE |
| session/attempt indexes | legacy draft | absent | covering user/session indexes |

Authoritative future migration path: supabase/migrations. Legacy database/migrations are historical references, never an independent deploy path. Production has historical migrations not yet mirrored fully in Git; rebuilding a fresh database remains a separate exit check.

## Applied production change log
- 20261002205937 phase0_practice_persistence: session schema, attempt linkage, authenticated own-row SELECT and session write policies, cross-user linkage trigger. Original 5 attempt rows preserved.
- 20261002210031 phase0_security_hardening: trigger function ACL/search_path, profile/preferences RLS optimization, admin-only Current Affairs table writes, two FK indexes.
- 20261002210827 phase0_current_affairs_storage: admin-only asset INSERT/UPDATE/DELETE; public viewing retained.
- All applied SQL committed locally, exact production migration versions mirrored. GitHub publication denied (403); no code deployment performed.
- SQL ownership/privilege tests passed in rolled-back transactions. Storage INSERT/UPDATE tests passed; direct DELETE SQL is rejected by Supabase's storage guard, so actual Storage API delete remains untested.
- Final counts: questions=1821, v2=1821, attempts=5, sessions=0, storage test fixtures=0. Lab untouched.

## Resumed execution checkpoint — 3 October 2026 IST
- Main remains 6426adb116e69a29c3b1dc888de04bcda5f49593; GitHub branch write retry still returns 403 Resource not accessible by integration.
- Fixed the inherited 59 frontend lint errors without disabling rules. Final lint: 0 errors, 54 warnings. TypeScript passes.
- Added offline Next route tests of authenticated creation/scoring/persistence/completion/dashboard reads, ownership denial, fail-closed errors and auth callbacks. Frontend tests: 25 passed; backend tests: 22 passed; isolated production build and root npm verify pass.
- Explore/filter/distribution/SEO reads and backend analytics use canonical v2 rather than master rows. Removed master-table count fallback and attempt retry that discarded session lineage; canonical final_opt is the answer authority.
- Supabase migration versions verified unchanged. Rechecked counts: questions=1821, canonical v2=1821, attempts=5, sessions=0. No new database migrations or corpus modifications in this resumed work.
- Production HTTP smoke suite: 12/12 passed. Browser CDS practice shows 1199 questions; Full Paper shows Sign In Required. These are the original deployed code, not the prepared fixes.
- Advisor refresh: security INFO no-policy6 plus WARN leaked-password1; performance INFO backup PK2 / unused-index18 plus WARN overlapping policies3. One-hour production error/fatal log query found no rows; limited evidence.
- Remaining release blocks: actual GitHub push/PR/CI, required branch checks, preview authenticated UI and OAuth, environment/backend review, production SHA verification and fresh schema reset/import. Do not declare Phase 1 readiness.
