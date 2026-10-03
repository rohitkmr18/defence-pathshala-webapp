# Repository reconciliation and staging preparation

## Source of truth

Inspected main: `8b5b7ca`. PR #9: `57721584b46462351c7b0517a2cf9ef465daa983`. PR #12: `921188f744134912703146f4470385f268dab25d`. PR #15 remains on `feat/auth-onboarding-state-model`, Draft, with its branch-only Vercel guard retained.

On 2026-10-03, read-only queries of production project `afhwegrxnvgsqbqadvwr` returned 14 migration versions, names and stored SQL statements. [The receipt](production-migration-history.json) retains these metadata; no learner rows, secrets or corpus payload were copied. Every version now has a matching file in `supabase/migrations`, including **20261003091625_phase2_intelligence_trust_contract**. The Phase 2 branch had used a different source filename (`20261003144500`); that version is not recorded remotely and is not introduced here. The recorded version and SQL are authoritative.

The two `20260924` bootstrap files were absent from remote history. They are preserved under `supabase/reconstruction/bootstrap`, not presented as pending production migrations. PR #9's prerequisite snapshot, observed grants and synthetic checks support fresh reconstruction. No new production baseline entry is fabricated. `database/migrations` remains legacy reference material, not a second ledger to replay.

The only unrecorded migration in the canonical directory is `20261003093440_atomic_onboarding.sql`. It is unchanged from PR #15 and **has not been applied to production**. Tests compare all 14 source files against recorded statements, allowing only surrounding whitespace differences.

Repository drift is reconciled on this branch. Main and the hosted migration runner still need a separately reviewed release; the reported `MIGRATIONS_FAILED` history-drift status was not modified and is not evidence of a database outage. Never repair remote history to make it fit stale source files.

## Overlap decisions

| PR #9 / #12 area | Reconciled authority |
|---|---|
| Login/signup and callback return paths | PR #15 `auth-redirect.ts` exclusively validates destinations; OTP and Google feed `/auth/continue`. PR #9's weaker `auth-navigation.ts` and PR #12's `safeAuthDestination` are not retained. |
| Profile API and backend fallback | PR #15 canonical RLS read + atomic RPC/readback remain; no backend proxy/upsert fallback is restored. Legacy backend PATCH remains 410. |
| Profile read failures | Recoverable error state remains; completed state is never assumed after a failed read. |
| Onboarding and profile roles | One screen and idempotent locked transaction remain. Historical RLS/role-protection SQL is restored verbatim; completed users are retained. |
| Full-paper auth gating | PR #15's exact exam/year/cycle destination and authenticated initialization/timer guard remain. |
| Backend token validation | PR #9's configured-project issuer check and its regression tests are incorporated. |
| Offline backend verification | PR #9's explicit service-boundary fixture and mocked Sheets sync checks are incorporated; no live configuration is needed. |

Other PR #9 practice synchronization, admin proxy, analytics and UI work remains in PR #9 for independent review. This is a selective reconciliation, not a merge of PR #9 or an assertion that all Phase 0 release gates are satisfied. Main's canonical V2 reads and PR #15 architecture are preserved.

PR #12's email-code form/helper/template/rollout guidance are incorporated. Email requests permit new or existing accounts; verification must return a session before navigation. Invalid/expired or sessionless responses retain inputs and allow retry. Resend cooldown, change email, rapid-submit protection, Google sign-in and safe intent-preserving login/signup links remain. The only post-auth navigation is a fresh `/auth/continue?next=...` request. No password-first form was restored.

## Isolated staging preparation

The repository is prepared for **controlled reconstruction or an isolated environment with the verified baseline**, not an automatic branch replay into an empty database. The historical ledger starts after application tables existed. Local config therefore disables automatic migrations/seeds, clears the stale declarative path and absent seed path, and keeps the private onboarding schema outside exposed API schemas. These are checked-in settings only; no hosted setting changed.

For a new empty, explicitly selected isolated Supabase environment, the reviewed application schema sequence is:

1. Use the real platform-provided Auth/Storage roles/schemas. **Do not install `platform-test-stubs.sql` on Supabase.**
2. Apply the two ordered `supabase/reconstruction/bootstrap` files, then `legacy-prerequisites.sql` as the environment's schema owner. They require an empty application schema and reject existing tables/triggers; they are not production migrations.
3. Apply the 14 recorded historical files in version order only to this fresh environment. Then reproduce `observed-grants.sql`. Do not use these grants as a production permission patch.
4. Apply only the reviewed onboarding migration after baseline prerequisites exist. If the isolated environment already has that baseline, skip steps 2–3 entirely.
5. Use the normal platform migration workflow to track that environment's own applied versions. No production migration repair, reset or history mutation is needed or authorized here. Do not point an automatic production-linked push at this reconstructed source tree.
6. Configure staging-only frontend/backend credentials, allowlisted callback URLs, email templates/provider and Google OAuth through an owner-controlled workflow. Keep production references/keys out of staging application config. Synthetic test accounts only; no production learner/corpus export is authorized.
7. Verify live PostgREST grants/schema cache, ownership and role protection, provider session cookies, OTP delivery/invalid/expired/resend, completed-user compatibility, profile recovery, persisted save/readback, lost-response retry and two independent database connections. Follow the [browser checklist](onboarding-state-rollout.md#remaining-browser-acceptance-checks).

No isolated live environment was selected or provisioned. Creation of a Supabase branch/project, paid resource, external preview or secret/configuration change is the stop boundary. Native branch creation may automatically execute migrations; it must not be used until its reconstruction strategy is reviewed. The existing preview must not be assumed isolated: PR #9 reported it pointed at production.

## Repository verification

Run from repository root with frontend dependencies and the backend virtual environment installed:

```sh
node --experimental-strip-types --test --experimental-test-isolation=none \
  frontend/src/__tests__/*.test.mjs scripts/test-onboarding.cjs scripts/test-onboarding-db.cjs \
  scripts/test-auth-components.cjs scripts/test-auth-middleware.cjs \
  scripts/test-email-otp.cjs scripts/test-otp-routing.cjs
node --test --experimental-test-isolation=none scripts/test-migration-ledger.cjs
backend/.venv/bin/python -m pytest -q backend/tests
```

The backend fixture replaces the service boundary before app import and sets offline configuration. Build/import checks must explicitly override inherited Supabase credentials with placeholders. TypeScript and changed-file lint run inside `frontend`. CI runs the OTP/state/SQL suite and reconstructed ledger separately: the existing resume tests temporarily install a fake global `window`, which must not affect PGlite's platform detection during fresh initialization.

PGlite reconstructs all application DDL and exercises synthetic ownership/role checks, history SQL and onboarding; it omits only the unavailable `pgcrypto` extension installation (UUID generation is built in). Docker reconstruction supports the real extension in a newly created local database and never accepts a remote connection URL. A separate two-connection test in local Docker PostgreSQL passed using synthetic Auth/Storage stubs; see [reconstruction receipt](evidence/local-postgres-reconstruction.json) and [concurrency receipt](evidence/local-postgres-concurrency.json). This proves local SQL serialization only. Live Supabase provider, PostgREST/RLS and concurrency acceptance remain untested.

The local Docker image was pinned by digest (`postgres@sha256:b0f9560a2de083e2cc7382e75f808c7381a32852a7ec49117deedb300e552b24`) and ran without a network or published ports. Reproduce in a new database using `scripts/reconstruct-phase0.py`, followed by `scripts/test-onboarding-concurrency.py` with the same task-owned container/database and distinct report paths. Both scripts pin the managed local Docker socket and reject remote connection URLs; reconstruction refuses existing database names.
