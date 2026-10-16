# Defence Pathshala — Direct Google Search Console Integration

This integration replaces paid Search Console wrappers with Google's own free APIs.

## Architecture

DP calls Google Search Console server-to-server using a Google service account.

The integration supports:

- Search Console property access verification
- sitemap listing
- sitemap re-submission
- URL Inspection
- Search Analytics page performance
- a combined monitoring snapshot for the DP PYQ SEO cohort

The application route is protected and is not exposed as a public analytics endpoint:

`/api/admin/seo/search-console`

## Required Google setup

1. In Google Cloud, create or reuse a project.
2. Enable:
   - Google Search Console API
   - Search Console URL Inspection API
3. Create a service account.
4. Create a JSON key for that service account.
5. In Google Search Console, open the property:
   `sc-domain:defencepathshala.in`
6. Add the service-account email as a user with sufficient permission to read Search Console data. Use Full permission if sitemap submission is required.

No OAuth consent screen or interactive user login is required for this server-to-server integration.

## Vercel environment variables

Configure these server-side variables:

- `GOOGLE_SEARCH_CONSOLE_SITE_URL=sc-domain:defencepathshala.in`
- `GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL=<service-account-email>`
- `GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY=<private-key>`
- `ADMIN_API_KEY=<strong-random-secret>`

For the private key, Vercel may store the multiline PEM directly. The application also accepts a single-line key containing literal `\n` sequences.

Never use a `NEXT_PUBLIC_` prefix for Google credentials.

## Protected API

All requests require either:

- `x-admin-key: <ADMIN_API_KEY>`, or
- `Authorization: Bearer <ADMIN_API_KEY>`

A future Vercel Cron integration may use `CRON_SECRET` as a Bearer token.

### Overview

`GET /api/admin/seo/search-console?action=overview`

Returns the configured property, sitemap state, /pyqs/ performance rows, and URL Inspection results for the default monitoring cohort:

- /pyqs/cds
- /pyqs/capf
- /pyqs/cds/history
- /pyqs/cds/history/modern-history

Additional `url` query parameters can override the cohort.

### Sites

`GET /api/admin/seo/search-console?action=sites`

Verifies that the service account can see the expected Search Console property.

### Sitemaps

`GET /api/admin/seo/search-console?action=sitemaps`

### URL Inspection

`GET /api/admin/seo/search-console?action=inspect&url=https://www.defencepathshala.in/pyqs/cds`

### /pyqs/ performance

`GET /api/admin/seo/search-console?action=performance&page_contains=/pyqs/`

Uses the latest settled 28-day period, ending three days before execution to avoid partially settled Search Console data.

### Submit sitemap

`POST /api/admin/seo/search-console?action=submit-sitemap`

Optional JSON body:

```json
{
  "sitemapUrl": "https://www.defencepathshala.in/sitemap.xml"
}
```

## Release gate

Do not enable scheduled monitoring until all of these pass in Preview:

1. `action=sites` returns `sc-domain:defencepathshala.in`.
2. `action=sitemaps` returns the production sitemap.
3. URL Inspection for `/pyqs/cds` succeeds.
4. Search Analytics request completes without authentication/permission errors.
5. No credential is returned in any API response or log.

After that gate, add a low-frequency daily monitor and persist only normalized indexing/performance snapshots.
