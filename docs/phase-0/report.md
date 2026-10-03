# Phase 0 production baseline review — 3 October 2026 UTC

**Verdict: Phase 0 incomplete; Phase 1 not cleared. PR #9 remains unmerged.**

This report supersedes the older continuation/testing/runbook status. Baseline history remains historical evidence. No production code release, database mutation, learner fixture, credential extraction or Intelligence Lab access was performed in this continuation.

## A. Executive summary

[PR #9](https://github.com/rohitkmr18/defence-pathshala-webapp/pull/9) was open at the original checkpoint. Main remained `c0bf5845b43d8e2ab64934ffcf61cd4b8ae62003`. The production domain resolves to READY deployment [Cj3izUkgWmtDnTtywbAoZ44Lj2At](https://vercel.com/rohitkmr18/defence-pathshala-webapp/Cj3izUkgWmtDnTtywbAoZ44Lj2At), with that same SHA.

The final application/test revision for this review is [2c614d9](https://github.com/rohitkmr18/defence-pathshala-webapp/commit/2c614d960cc79d890d97eb454b29fc9e2223380c). Later report/evidence commits do not change application behavior. Verify the exact current PR head's checks and deployment before any release; previous green checks are not transferable authorization to merge.

Executed fixes cover session creation/first-answer ordering, retained linkage, expired-auth failures, visible persistence failures, persisted Full Paper submission, safe OAuth return paths, admin proxy bearer authentication and JWT issuer validation. All recent difficulty/filter/mobile/subtopic/Quick Select/resume/navigation work was retained.

Local gates: authoritative frontend lockfile install and backend requirements install; 48 frontend tests; 26 backend tests; TypeScript; ESLint with 0 errors/45 visible warnings; isolated production build and root verification. The backend uses an isolated Python 3.12.14 virtual environment locally; mandatory CI uses Python 3.11 and Node 24.

Public read-only checks passed 14/14 on production and 14/14 on the verified `28fe18f` preview. OAuth and authenticated database writes remain unverified. The owner confirmed Google setup stopped at Supabase URL configuration.

## B. Issues and evidence

| Severity | Root cause | Final fix/state | Verification |
|---|---|---|---|
| P1 | First answer can reach the API before the cloud session exists | Attempts await creation; old/new session identity remains stable; failed creation never sends a local ID or silently unlinks an attempt | Deferred creation/answer/session-switch tests; in-flight completion deduplication |
| P1 | Client swallowed HTTP persistence errors and could accept guest responses after auth expiry | Confirm cloud responses, surface error status, retain unsaved answers on device, retry known pending answers on completion | HTTP/create/attempt/PATCH/expired-auth/reload regression tests |
| P1 | Full Paper only held answers/submission in React state; timer could start before authentication | Gate loading/timer on auth/session; save progress; persist owned attempts before completion; await confirmed completion before debrief; fresh retake session | Real component offline hook harness tests for guest, answer, submission and timer expiry; client persistence tests |
| P1 | Google login entry point absent; callback discarded destination; password login accepted unsafe return paths | Google OAuth entry point, same-origin path validation, callback error handling and preserved destination | Helper and real route tests; local browser renders Google button without overlay; real provider setup still blocked |
| P1 | Next admin proxy sent X-Admin-Key while FastAPI requires bearer auth | Forward the verified administrator's bearer session; retain backend protected profiles.role authorization; do not activate legacy shared keys | Real proxy tests deny learners/expired sessions and verify bearer header; backend rejects legacy headers |
| P1 | HS256 fallback lacked issuer validation | Require configured Supabase issuer in both JWT verification paths | Wrong-project and configured-offline-issuer JWT tests |
| P1 | Main unprotected and production deployment independent of Actions | NOT configured: owner administration is required | Main protected=false, rulesets=[], protection GET 403; deployment timing precedes main CI completion |
| P1 | Production backend/env targets and formerly exposed credential status unknown | Code removes browser admin credentials and production localhost fallback; deployed credential/configuration review remains blocked | Source tests and preview bundle project-host audit; backend project access denied and Vercel get_project connector validation fails |
| P1 | Applied migration history absent from Git; legacy prerequisites absent from fresh Supabase migrations | Mirror 10 historical applied SQL files; retain existing three Phase 0 files; add guarded local reconstruction script and captured prerequisites | All 13 remote versions reconcile, ignoring trailing whitespace; fresh local schema + synthetic lineage/RLS pass |
| Resolved P1 | Real frozen-release restoration was not demonstrated | Owner explicitly approved the narrowly scoped local export; import into fresh disposable PostgreSQL, excluding all learner data | All four table digests and canonical v2 digest match production; 1,821 canonical rows and nine dictionary rows |
| P2 | Leaked-password protection disabled | Free plan does not support the feature; no paid upgrade made | Organization plan=free; current Supabase docs require Pro or above |

## C. Actual architecture and release gate

Next.js 16.3.6 App Router runs in Vercel project `defence-pathshala-webapp`, team `team_fDFdO1Q2KzBJ0aHvWtY6fGNE`. Browser Supabase Auth and server-side learning APIs use production project `afhwegrxnvgsqbqadvwr`; a compiled preview login bundle proves the preview also uses this project. A preview hostname does not isolate learner data.

Learning Next route handlers validate the signed-in user with getUser, then use a server service client with explicit owner predicates. Attempts use canonical final_opt for scoring. Database RLS protects learner direct access; a trigger also rejects cross-user attempt/session linkage for privileged server writes. Canonical runtime reads use `v_dp_question_intelligence_v2`.

FastAPI source is connected to the separate Vercel project `defence-pathshala-api`; GitHub reports successful Vercel deployments for both projects. Its active serving URL, health and actual frontend BACKEND_URL/environment targets remain unverified because that project's connected access was denied. Public supported reads can fall back directly to Supabase. Admin publishing uses authenticated Supabase table/storage access and protected admin policies. Admin sync now forwards an administrator bearer session to FastAPI.

The actual required check context is **Build & Verify**, supplied by **github-actions**. Main has no protection or rulesets. Production was READY at 2026-10-02 22:52:10.845 UTC; main push CI completed at 22:52:29 UTC. This is evidence of independent deployment, not a CI promotion gate. No failing/direct production push was used to test it.

Owner configuration and the practical PR → preview → CI → verified merge → staged production → main CI → manual promotion sequence are in [runbook.md](runbook.md). No secret-dependent deployment workflow was added.

## D. Database/migration state

Production is ACTIVE_HEALTHY on PostgreSQL 17.6.1.166. Questions, canonical v2, release contract and intelligence snapshot each contain **1,821** rows. All v2 rows are production/intelligence eligible. Attempts remain **5**, saved sessions remain **1**; null session owners and invalid attempt/session owners are **0**. Existing learner records were not changed.

Both intelligence views retain security_invoker=true. Frozen eligibility, taxonomy, final answer authority, pattern dictionary and DP_PYQ_CORPUS_v1 lineage are preserved.

The three already-applied Phase 0 migrations remain:

- 20261002205937_phase0_practice_persistence
- 20261002210031_phase0_security_hardening
- 20261002210827_phase0_current_affairs_storage

All 13 remote recorded migrations now exist under **supabase/migrations**. The two older repository question/attempt creation migrations are not recorded in the remote journal. Do not blindly db push, repair the journal or replay historical UPDATE/promotion SQL on production.

`scripts/reconstruct-phase0.py` refuses existing database names and accepts only a local Docker container/new dp_phase0_* database. It ran 19 files in a fresh PostgreSQL database: platform stubs, two base migrations, captured legacy prerequisites, 13 recorded migrations, observed grants and rolled-back synthetic checks.

This proves the application schema and synthetic answer/eligibility/pattern lineage plus owner RLS and denied learner editorial writes. Following explicit owner approval, a second fresh reconstruction imported the production questions, frozen release contract, intelligence snapshot and dictionary. All four table digests and the canonical v2 digest match production using explicit C ordering; canonical/eligible counts are 1,821, dictionary count is nine. Source IDs, taxonomy, answers, eligibility and release lineage are retained exactly. The local database contains zero users, attempts or sessions; it has 11 public foreign keys, 53 indexes and 13 RLS tables. The payload is outside Git; committed receipts contain only digests/counts. An initial digest comparison rolled back because default database sort ordering differed; explicit C ordering resolves that difference without changing data.

This does **not** prove full Supabase services, a plain supabase db reset, archive/stage restoration or original Lab freeze provenance. The prerequisite capture is a fresh reconstruction asset, not an additional production deploy path. The default branch entry returned by Supabase is MIGRATIONS_FAILED and points at production; it was not used or reset.

## E. Security state

Production retains owner-only session/history policies, non-null session ownership and protected-admin Current Affairs table/storage writes. User-editable metadata is not an admin authority. Trigger function ACL/search_path hardening remains applied.

Advisors: six security no-policy INFO findings reflect intentional private/denied master, frozen snapshot, stage and backup tables. They were not silenced with permissive policies. Leaked-password protection remains WARN on an unsupported Free plan; see [password security](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

Performance retains two backup-table missing-PK INFO findings, 18 unused-index INFO findings and three Current Affairs overlapping SELECT-policy warnings. Published-reader and protected-admin access are intentional; overlap is performance debt, not broad learner editorial permission. No indexes were dropped merely because their usage count is zero.

The formerly browser-exposed key's identity/activity cannot be established through the available credential-management access. No credential value was printed, extracted, tested against production, or rotated. Backend code does not accept ADMIN_API_KEY/X-Admin-Key; this alone does not establish that a formerly exposed value is inactive in every deployed target. Owner must inspect/rotate any still-active exposed credential through authorized management and verify legitimate server consumers before release.

Production one-hour error/fatal log query returned no rows. This limited retention/time-window evidence is not proof of no errors.

## F. Automated and real journey coverage

| Environment | Demonstrated | Not demonstrated |
|---|---|---|
| Offline frontend | 48 tests: canonical reads/scoring, own/cross-user route contracts, callbacks/filter equivalence/exact resume, race/error/retry/client state, Full Paper auth/timer/submit and admin proxy | Real OAuth, real Supabase transactions or deployed authenticated UI |
| Offline backend | 26 tests: routes, canonical analytics, mocked dataset operations, admin denial, JWT issuer | Live FastAPI environment/credential configuration |
| Local browser | Built login page renders, Google CTA present, no blank page/Next overlay or recorded page errors | Provider exchange or learner writes |
| Local PostgreSQL | Fresh schema, FKs/indexes/policies, owner/cross-user policy checks; approved real frozen import, all four source table digests and canonical digest/count match | Full Supabase Auth/Storage, historical archive/stage restoration, original Lab freeze provenance |
| Public preview | 14 read-only checks on READY deployment HPGMFZr6brcaadubETMaRoK7nQaj for 28fe18f; login includes Google CTA, count=1,199 CDS, guest history empty, admin stats 403 | Signed-in learning/debrief/recommendation/Full Paper; preview uses production database |
| Production | 14 read-only checks at unchanged c0bf584; 1,199 CDS count, empty guest history, admin denial; advisor/SQL refresh | New fixes released; authenticated post-release smoke |

Authenticated Google → dashboard → CDS/CAPF Explore → filters → practice → owned attempt → exact resume → completion → debrief/recommended next action and Full Paper remain an explicit release blocker. Two real approved identities have not been handed off. No auth bypass or privileged session manufacture was used. Browser network access to production/preview/Supabase/Google is also blocked by the workspace host policy; connected Vercel GETs are not a replacement.

## G. Remaining P1/P2/deferred debt

P1 release blockers: owner OAuth setup and secure two-identity handoff with an approved write environment; exact latest authenticated preview journey; GitHub administration/release gate; actual backend/env/active-credential review; main/production/post-release evidence after a gated merge.

P2/deferred: leaked-password feature requires paid-plan decision; 45 lint warnings; three SELECT-policy overlaps; backup/index informational findings; session summary counts still originate in client snapshots; stricter session payload/membership validation; server idempotency for ambiguous committed-write/lost-response retries; Full Paper elapsed-time restoration; Current Affairs failed publication can leave an unpublished draft. None is represented as tested end-to-end.

## H. Phase 1 readiness

**NOT CLEARED.** Passing mocks, local reconstruction and public smoke do not satisfy authentication, deployed configuration or production gating. The approved frozen canonical reconstruction now passes. PR #9 must remain unmerged until these applicable checks pass. Rollback must preserve additive schema, existing learning history and hardened policies.

## Evidence

- [Frontend tests](evidence/frontend-tests-20261003.txt), [backend tests](evidence/backend-tests-20261003.txt), [lint](evidence/lint-20261003.txt), [build/root verification](evidence/build-verify-20261003.txt)
- [Public checks](evidence/public-smoke-20261003.json), [preview project host audit](evidence/preview-bundle-audit-20261003.json)
- [Database counts/views](evidence/database-20261003.json), [migration reconciliation](evidence/migration-reconciliation-20261003.json), [fresh reconstruction](evidence/local-reconstruction-20261003.json)
- [Approved frozen import](evidence/frozen-import-20261003.json), [source digests](evidence/frozen-source-digests-20261003.json), [fresh import schema](evidence/frozen-schema-reconstruction-20261003.json)
- [Security advisor](evidence/finalsecurity-20261003.json), [performance advisor](evidence/finalperformance-20261003.json)
- Original refreshed checkpoint CI: [push 37096672214](https://github.com/rohitkmr18/defence-pathshala-webapp/actions/runs/37096672214), [PR 37096673460](https://github.com/rohitkmr18/defence-pathshala-webapp/actions/runs/37096673460). Current-head CI/deployment receipt is recorded on PR #9 and in the completion response.
