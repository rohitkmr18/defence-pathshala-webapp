# AFCAT Authentication Integration Decision — 25 October 2026

## Product architecture (approved direction)
AFCAT is an additional module within Defence Pathshala. At final production launch it MUST use the existing DP Supabase Auth session, OTP login, learner user ID and profile/onboarding architecture. Do not introduce an AFCAT-specific login, user store, SMTP provider, or second production Supabase project.

## Staging exception
The prelaunch branch connects to an isolated Supabase project (pxfstrzceyxnweeaydvz) to avoid modifying production data. This necessarily has an independent Supabase Auth directory and email templates. Neither existing production users nor production tokens may be copied, passed to, or trusted by the staging database. The staging service role MUST remain branch-restricted and never be reused from production.

The existing AFCAT API already calls `createClient()` from DP's common auth server helper and `auth.getUser()` before authorizing a session. This is **shared application authentication code**, not a new AFCAT login implementation. The preview's login link routes to `/auth/login?next=%2Fafcat%2Flab`.

## Staging acceptance options
1. Preferred normal flow: configure independent staging OTP delivery (testing-only SMTP and template) and create a disposable staging learner account. This does not change production OTP or constitute new production architecture.
2. If email configuration is unavailable, use explicitly scoped, ephemeral staging test authentication with short-lived identities and auditable revocation, implemented and independently reviewed before use. Never place privileged keys or session bypasses into browser code.
3. No production Auth project access or production DB write as a shortcut.

## Release gates
- Review/remove hard-coded staging project guard as part of a controlled, separately approved release integration. Production AFCAT tables require approved migrations, RLS and test content.
- Ensure all AFCAT routes use the established DP user ID and profile without independent registration.
- Verify launch credentials and all environment URLs against the intended project before any database deployment.
- Prove signed-in user ownership, denial of cross-user access, atomic result finalization and timer enforcement in staging.
- Keep this staging-only branch out of production until editorial approval of all 25 tests and explicit launch authorization.

## Current gaps
- Staging SMTP/OTP template not yet established; staging authenticated browser acceptance remains incomplete.
- Staging time-expiry data guard has been applied; automated suite passed on previous commit.
- No production migration or main merge authorized.
