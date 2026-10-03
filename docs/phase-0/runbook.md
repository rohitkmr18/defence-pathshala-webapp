# Phase 0 release and recovery runbook — 3 October 2026 UTC

Status: **HOLD MERGE; Phase 0 incomplete; Phase 1 not cleared.** See [report.md](report.md) for current evidence and remaining risks.

## Owner actions: authentication and test environment

1. In [production Supabase URL configuration](https://supabase.com/dashboard/project/afhwegrxnvgsqbqadvwr/auth/url-configuration), use Site URL `https://www.defencepathshala.in`.
2. Allow `https://www.defencepathshala.in/auth/callback` and the exact approved preview's `/auth/callback`. The application includes a `next` query parameter; use a callback-scoped `.../auth/callback**` pattern where required to allow that query, with the hostname fixed. Do not allow arbitrary external origins. The stable branch preview is `https://defence-pathshala-webapp-git-phase-0-remainin-074a13-rohitkmr18.vercel.app`; check the current immutable deployment/SHA before testing.
3. In Google Cloud Console → APIs & Services → Credentials, configure a Web application OAuth client. Authorized JavaScript origins are the approved production/preview origins. Authorized redirect URI is **`https://afhwegrxnvgsqbqadvwr.supabase.co/auth/v1/callback`**, not the Next.js callback. Configure consent screen/test users for the two approved Google identities if the OAuth app is in testing mode.
4. In [Supabase Auth providers](https://supabase.com/dashboard/project/afhwegrxnvgsqbqadvwr/auth/providers), enable Google and enter its client ID/secret through the secure dashboard. Do not paste credentials into chat, Git or build logs.
5. Confirm the preview Supabase project before writes. The verified preview uses production `afhwegrxnvgsqbqadvwr`. Supply an existing suitable isolated environment or explicitly approve a non-destructive test-account write strategy; do not use or reset Intelligence Lab. No paid environment has been created.
6. Owner completes Google login in the approved browser for two learner identities; transfer browser control without sharing passwords, tokens or auth-state files. Enable this workspace's network access through its supported configuration workflow for the verified preview, production domain, approved Supabase project and Google OAuth hosts. Current browser traffic is denied; connected GET tools do not support an interactive login handoff.
7. Run Google → dashboard → CDS/CAPF Explore → filter-preserving practice → answer → owned attempt → exact order/index/answer resume → completion → debrief/recommendation. Run Full Paper auth/timer/answer/submit/scorecard. Verify cross-user session GET/PATCH/linkage and learner editorial/admin denial with the two real identities. Record owned fixture IDs and preserve existing users' records.

## Owner actions: GitHub and production gate

The exact check name is **Build & Verify**, source **GitHub Actions**. It was verified in commit check-runs, not guessed from the workflow filename.

1. Open repository Settings → Rules → Rulesets (or branch protection): target `main`, enforcement Active, require pull requests, require status check **Build & Verify** from GitHub Actions, require the branch up to date, block force pushes/deletion. Apply to administrators and remove direct-push/admin bypass where feasible. No rules currently exist. The connected App's administration GET returns 403; this is an access limitation, not a configured gate.
2. In Vercel production environment settings, use staged production builds and disable automatic production domain assignment. Keep PR previews. If this is unavailable in the current UI/plan, disable automatic Git deployments for main and use the owner's authenticated Vercel deployment flow after main CI passes. Do not add a GitHub deployment workflow requiring absent VERCEL_* secrets.
3. Practical flow: PR → exact-SHA preview → Build & Verify → authenticated verification/config/security checks → merge through PR → main Build & Verify → verify production candidate SHA → manually promote/assign domains → public and authenticated smoke/logs/advisors.
4. Inspect that the candidate has no production aliases until promotion. Do not test a failing push on live main. Existing production became READY before main CI completed, so GitHub check success alone does not prove Vercel waits for it.
5. Keep PR #9 unmerged while blockers remain. A docs-only follow-up still has its own exact-head CI; do not reuse a previous SHA's status.

## Owner actions: environment and credentials

Frontend Vercel project: `defence-pathshala-webapp` / `prj_5xj3emEeMdBJ8sjxAsP43w8sKvn7`. FastAPI is linked to `defence-pathshala-api` / `prj_XosKsqXmaESbMVtkvMR0MVZUthP9`, same repository/team. The second project's active deployment/health and actual BACKEND_URL routing are not verified because its connected access is denied; the get_project tool also fails argument validation.

Review variable names/targets through authorized Vercel configuration access. Do not print values:

| Target | Variables to verify |
|---|---|
| Frontend Preview/Production | NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, BACKEND_URL; optional admin email settings |
| FastAPI Preview/Production | SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_JWT_SECRET, GOOGLE_SHEET_ID, ALLOWED_ORIGINS |
| Forbidden on Vercel | DP_OFFLINE_BUILD; offline/test-only localhost keys/configuration; browser admin/service credentials |

Preview and backend Supabase targets must agree with the approved environment. BACKEND_URL must be the intended HTTPS FastAPI serving URL, not localhost. An absent optional backend uses explicit supported Supabase fallback; mandatory sync fails explicitly. Admin sync forwards the verified user's bearer session, and FastAPI requires protected profiles.role=admin. ADMIN_API_KEY/X-Admin-Key is not accepted by the final backend code and is not sent by the final Next proxy.

Review the formerly exposed browser admin credential through the owner credential manager. If it is still active anywhere, revoke/rotate it there, update authorized server consumers/targets and verify them. If it was a Supabase legacy service credential, coordinate all affected consumers before rotation; do not blindly rotate the project's signing material or print keys. Available access cannot establish or perform this safely. Do not claim the key was rotated or globally inactive based only on source removal.

Supabase organization is Free. Leaked-password protection requires Pro or above according to current [documentation](https://supabase.com/docs/guides/auth/password-security). No upgrade was authorized or performed. Treat this as documented plan-dependent debt and enable it through Auth Email settings if a paid plan is later approved.

## Migration and reconstruction safety

One authoritative applied SQL path is **supabase/migrations**. The 13 production-recorded versions are mirrored; the three Phase 0 versions were already applied and must not be reapplied. The two original September create-table files are absent from the production journal. Never blindly `db push`, repair migration history or replay historical promotion/data UPDATE scripts against production.

Fresh local application-schema verification uses the committed reconstruction script:

```sh
python scripts/reconstruct-phase0.py --container dp-phase0-repro --database dp_phase0_new_check --report /tmp/dp-phase0-reconstruction.json
```

The container must be an existing suitable disposable local PostgreSQL instance. The script creates a NEW database; existing names fail, and no reset/connection URL is accepted. Bootstrap Auth/Storage stubs and captured legacy prerequisites are explicitly local reconstruction assets, not production migrations. After them, all recorded migrations run from supabase/migrations, followed by observed grants and synthetic transactional tests. This proves application DDL/RLS/lineage with fixtures, not a full Supabase reset or actual frozen-release restore.

Real restoration still needs an approved frozen release artifact (question/master rows, frozen eligibility/intelligence snapshot, dictionary and provenance/checksums), including exact row-ID preservation for lineage. Do not substitute synthetic 1,821 rows or regenerate eligibility/taxonomy/answer authority. Automatic approval review rejected the attempted production payload export because its scope/destination was not explicitly approved; no payload files were created. Obtain explicit export authorization or an approved existing artifact, then demonstrate 1,821 canonical rows on a suitable disposable/staging database. Do not touch Lab or copy users/attempts/sessions.

## Rollback and post-release evidence

Current verified production is **c0bf5845b43d8e2ab64934ffcf61cd4b8ae62003**, deployment **dpl_Cj3izUkgWmtDnTtywbAoZ44Lj2At**. The older 6426adb rollback paragraph is obsolete. For a future released code defect, revert through a reviewed PR or have the owner promote the known-good production deployment. Verify its SHA/domain aliases, public/authenticated smoke and logs. Historical code may still contain the defects this PR fixes; evaluate the rollback against the incident.

Preserve additive practice/session/history schema, all existing learner rows, canonical release lineage and hardened policies during rollback. Do not drop columns/tables, restore permissive editorial policies or replay corpus promotions as a code rollback. Repair schema forward using reviewed migrations.

After any approved release: confirm production SHA equals the approved merge/candidate SHA; repeat public and authenticated journeys; inspect Vercel error/fatal logs and FastAPI health; rerun both Supabase advisors and owner/count checks. Empty log results cover only the queried retention/time window. Remote HTTP timings are not Core Web Vitals or user latency SLOs.
