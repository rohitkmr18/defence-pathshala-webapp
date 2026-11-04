# DP Learning Resources — isolated foundation (29 October 2026)

Status: design and catalogue skeleton only. No campaign or secure access is live.

## Product contracts
- Public: editorially published and discoverable in /resources.
- Unlisted: omitted from catalogue, navigation and sitemap; URL-sharing alone is not a security boundary.
- Token-gated: server validation needed on every content/API/file access. Do not implement by CSS hiding or client checks.
- Draft: inaccessible to non-admin viewers in every visibility mode.
- Resource type: quiz, ebook, flashcards. Reuse existing learner components wherever safe.
- No mandatory login for free lead magnets. Never mix resource attempts with official exam attempts.

## Follow-on implementation (not yet shipped)
1. Audit the existing question renderer, admin authorization, database migration ledger, RLS, and staging data before creating schemas.
2. Add versioned resource, question, campaign and token metadata; enforce public/unlisted/token-gated policies server-side.
3. Build an accessible one-question-at-a-time MCQ player with answer explanations and score, initially using five source-reviewed cyclone questions.
4. Add admin-only creation, editorial approval, unlisting and revocation without production edits.
5. Add an eBook renderer backed by private storage for token-gated files.
6. Track campaign landing, quiz start, completion and opt-in CTA; do not store shared tokens in analytics or referrers.
7. Verify anonymous, unlisted, expired, revoked, cross-user and direct API access in isolated staging.
8. Configure Instagram comment → DM automation only after real resource URL and follower-flow tests.

## Release constraints
- Do not touch AFCAT PR #87, protected exam routes, auth policy or production.
- Never create fake successful acceptance results.
- Do not expose answer keys or draft content through unauthorised public endpoints.
- This branch is not a complete Resource Vault and must not be merged as a released feature without review.
