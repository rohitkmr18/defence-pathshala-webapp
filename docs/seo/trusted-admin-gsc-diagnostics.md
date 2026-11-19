# Trusted administrator Search Console diagnostics (release candidate)

## Why this exists

The original `/api/admin/seo/search-console` requires `ADMIN_API_KEY` or `CRON_SECRET`. Vercel stores those values securely; they are not available to external Codex sessions, so anonymous requests correctly returned HTTP 401 before reaching Google.

This change adds a **separate server-rendered read-only admin page**:
`/admin/seo/search-console`.

It calls the existing server-only Google Search Console client using the service account configured in the Vercel runtime. It does **not** retrieve or forward `ADMIN_API_KEY`, `CRON_SECRET`, the service-account private key, or Google access tokens.

## Authorization

The page requires `supabase.auth.getUser()` to verify the current user's session **and** the server-controlled `auth.users.raw_app_meta_data.role = admin`.

**Do not use `public.profiles.role` for this privileged access.** The current production RLS policy permits owners to update their own `profiles` row, including `role`; this is not a trusted authorization source. Likewise, `raw_user_meta_data` and email-only shortcuts are explicitly rejected. Unauthorized callers receive 404 without calling Google. The existing admin API and its protections remain unchanged.

If a legitimate admin cannot view the page, an authorized Supabase Auth administrator must verify/provision the trusted `app_metadata.role` through the established secure admin process. This PR deliberately does not grant or change roles.

## Available diagnostics

- Verify whether the target property `sc-domain:defencepathshala.in` appears under the service account's Search Console sites, including permission level.
- List existing sitemaps.
- Inspect the index status of `https://www.defencepathshala.in/pyqs/cds`.
- Fetch page totals and query-by-page rows for the last **28** and **90** completed reporting days, conservatively ending three days before today. Reporting dates are displayed.
- Manual pagination in blocks of 1,000 rows. Query rows omit anonymized searches and cannot be added up as site totals.

Everything executes on the server. It is read-only and does not submit a sitemap or request indexing. Links do not prefetch Google calls. Google failures are categorized without returning raw exception strings.

## Release / acceptance gates

1. CI must pass TypeScript, lint, and existing application tests.
2. Anonymous requests to this page return 404 (SEO browser acceptance).
3. Preview must be ready. An authorized staging admin should test `sites`; if preview credentials lack production GSC property permission, record this separately, not as a production failure.
4. After explicit merge authorization, test production as a signed-in admin: `sites`, `sitemaps`, `inspect`, and 28/90-day `page` and `query,page` reporting. Document real Google permission or API errors; do not guess.
5. Verify private keys/tokens never appear in client HTML, browser console or application logs.
6. Do not merge until approved. No Google Cloud, Vercel settings, credentials, RLS, database records, or sitemap configuration should be changed for this patch.

### Scope limitation

This is a manual administrator diagnostic surface, not a public SEO dashboard or unattended cron. It intentionally does not grant external coding tools the privilege to execute production Google API diagnostics.
