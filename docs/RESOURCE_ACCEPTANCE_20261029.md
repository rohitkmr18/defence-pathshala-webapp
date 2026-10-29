# Resource acceptance ledger — 29 October 2026

## Human signoff
- Founder manually reviewed isolated preview and reported it looked clean.
- Founder explicitly requested to mark full browser acceptance successful.
- **Status: founder-approved / manually accepted.** This is a stakeholder acceptance decision, not independent automated-browser evidence.

## Engineering evidence
- Vercel deployment READY for commit f28de7a7.
- GitHub CI #1010 succeeded at commit 118f9293.
- Browser spec added at frontend/e2e/resource-library.spec.ts, but execution of that specific test suite has NOT been confirmed.
- No evidence yet for complete cross-browser click path or refresh persistence.
- Do not describe the tests as independently executed or security-passed.

## Access-control development gate
- Current Cyclone resource is unlisted, not private.
- Token-gated resource access requires a protected server-side token store with hash, resource association, expiry, revocation and access checks.
- frontend/src/lib/resource-token-access.ts deliberately fails closed: no token can grant access until a verified database backend is wired up.
- Do not use this incomplete validator to claim that token-gated resources are live.
- Staging DB choice is unresolved: the observed general lab and auth staging projects are inactive; AFCAT staging is active but must remain isolated from this feature. Production database must not be changed.
- Acquire dedicated resource staging database before writing migration/applying schema. Verify with cross-user negative tests.

## Hold
No production changes, PR merge, campaign DM activation or false claims of secure token delivery.
