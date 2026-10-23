# P1.2 AFCAT isolated data foundation — acceptance plan

## Scope
- Proposed migration: `supabase/migrations/20261023131000_afcat_p12_isolated_foundation.sql`.
- Six new `public.afcat_*` tables. Existing CDS/CAPF questions, attempts, sessions and read models are unchanged.
- Shared identity via `auth.users`, distinct AFCAT session and response FKs.
- Two non-overlapping pools: 500 sectional questions + 500 full-mock questions, 20 sectionals and five full mocks.
- Read access: published test catalogue; authenticated learner sees own session/response records only. Question answers, test items and assets are server-only.

## Deployment rules
1. PR review and SQL parse/static analysis first.
2. **Do not execute on production from this PR.**
3. Test against an isolated staging Supabase project. Confirm staging is not wired to production before any write.
4. Validate role grants + RLS using actual anon, learner A, learner B and elevated server roles.
5. Verify that the intended internal server routes can access the tables, but clients cannot read answer keys or question assignments.
6. Application API / storage policy / visual renderer are **not part of P1.2**.
7. Explicit production release approval and migration-ledger check required after staging acceptance.

## Required scenario tests
- Create question in sectional pool; attach only to matching sectional test.
- Reject cross-pool and wrong-section assignments.
- Reject unapproved or mismatched-version question assignments.
- Reject duplicate question ID in any second test (including five full mocks).
- Reject publishing a test with missing positions, gaps, unapproved content, or unexpected count.
- Reject full-mock publication lacking any of the four sections.
- Verify a published test cannot add/change/delete item assignments (DELETE guard added; requires staging test).
- Verify a published question cannot change, including corrections and answer key.
- Verify artwork inserts/updates/deletes cannot invalidate a frozen published question (asset guard added; requires staging test).
- Verify session belongs to a real user, and a second user cannot read learner A sessions/responses.
- Verify session responses reference only test-assigned questions (database trigger added; API validation still required).
- Verify limits of 20 sectionals / 5 mocks and exactly 500 + 500 at **release level** (still an editorial/release gate). Full-mock 30/25/20/25 enforced by publication trigger, awaiting staging verification.
- Verify no exact/semantic/visual near-duplicates across pools (external content QA).
- Confirm all old PYQ routes/query counts and learner history are unchanged.

## Findings / deliberate holds
- Migration provides foundational database isolation, NOT a fully secure published exam engine.
- Correct answers must never reach client before submission.
- Current catalogue is empty, so no AFCAT attempts possible.
- Frozen asset changes and immutable item deletion now have database guards; staging tests are pending.
- Need server-authoritative scoring, idempotent submissions, timed expiry and authoritative test-release lifecycle handling in later API PR. Session creation now checks a published release and response membership has a trigger.
- There is no published AFCAT content in this migration.
- **Staging blocked:** The only other Supabase projects visible to the connection are INACTIVE (dp-pyq-intelligence-lab and dp-auth-staging). The active healthy project is defence-pathshala-pyq, which is treated as production. Neither inactive project has been verified as independent or safe for migrations. No SQL was executed.
- Migration still requires independent SQL compilation and tests; this PR is not migration-accepted.
- Test counts are a business release gate; blindly imposing 1,000 as a DDL check would prevent incremental ingestion.

## Existing dependency
- P1.1: PR #78 remains separate. This migration PR should not depend on merging P1.1.
