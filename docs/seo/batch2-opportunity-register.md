# SEO + AEO + GEO Batch 2 — evidence and opportunity register (15 November 2026)

## Evidence levels and blockers

- **Verified in default-branch code:** Direct Search Console service-account client and admin-protected API route exist. They support date ranges, query/page/device dimensions, exact-page filtering and pagination.
- **Verified in Vercel metadata:** `GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL`, `GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY`, `GOOGLE_SEARCH_CONSOLE_SITE_URL` and `ADMIN_API_KEY` have production and preview environment entries. **Values were not read.** Presence is not Google authorization.
- **Not verified:** An authorized live GSC response, 28-day/90-day clicks/impressions/CTR/position, Google-selected canonicals, keyword cannibalization, live Core Web Vitals, and generated-answer citations.
- The independent web retrieval service could not access sampled live DP URLs. That is not a finding that Google or students cannot access the site.
- Historical source search may show an older indexed commit; always re-fetch files on the current branch before implementation.

## Free reporting path (no GSC Wizard)

Protected endpoint: `/api/admin/seo/search-console?action=performance`. Authenticate through an approved admin session/secret-holder workflow; never expose the admin key in client-side JavaScript, screenshots, reports, or logs.

Fetch the latest settled 28 and 90 days separately for:
1. Page totals (dimension `page`).
2. Query-by-page data (dimensions `query,page`, with pagination).
3. Device segmentation where useful.

Record reporting date boundaries and data maturity. Query rows omit anonymized searches; never sum query rows and pretend they equal site totals. Pull URL Inspection selectively for candidate pages. If access fails, document exact failure class without leaking credentials and defer numerical conclusions.

## Provisional opportunity matrix (hypotheses, **not GSC-ranked**)

| Target | Search intent | Potential overlap / canonical question | Content action to validate |
|---|---|---|---|
| /pyqs/cds | CDS PYQ / previous year questions | /pyq aliases and subject routes | Validate indexed canonical, strengthen method + practice |
| /pyqs/capf | CAPF AC PYQ / Paper I | /pyq aliases and subject routes | Differentiate Paper I and study method |
| /pyqs/cds/history | CDS History PYQs | CDS hub and topic subroutes | Use verified years/topics, avoid generated count claims |
| /pyqs/cds/polity | CDS Polity PYQs | Polity ebook | Cross-link with distinct intent |
| /pyqs/cds/economy | CDS Economy PYQs | Economy ebook | Distinguish questions from revision guide |
| /pyqs/capf/polity | CAPF Polity PYQs | CAPF hub and Polity ebook | Build question-based explanations |
| /afcat | Free AFCAT mocks | App-only /afcat internal routes | Keep indexable public hub distinct from noindex application |
| /current-affairs | Defence daily current affairs | Dated editions / month archives | Make editorial use and exam relevance explicit |
| /library | Free revision ebooks | Individual book routes | Subject navigation and reader discoverability |
| /library/economy-decoded | Indian economy revision ebook | CDS/CAPF economy PYQs | Semantic chapter outline + practice links |
| /library/polity-decoded | Indian polity revision ebook | CDS/CAPF polity PYQs | Semantic chapter outline + practice links |
| /library/physics-decoded | Physics revision ebook | Science PYQ archives | Semantic chapter outline + practice links |
| /library/chemistry-decoded | Chemistry revision ebook | Science PYQ archives | Semantic chapter outline + practice links |
| /library/biology-decoded | Biology revision ebook | Science PYQ archives | Semantic chapter outline + practice links |
| /library/geography-decoded | Geography revision ebook | Geography PYQ archives | Verify inventory before prioritizing |

**Important:** This table is an investigation shortlist, not an assertion that all 15 routes have live search demand, that the specific subject routes are indexed, or that geography-decoded is deployed. Confirm route existence, eligible corpus coverage and GSC opportunity before creating any page or altering canonical strategy.

## Changes in this PR

1. The existing six-book public library template now renders a plain HTML, accessible, question-headed chapter summary from each book's published `sections` metadata. It links to existing book page anchors and the actual quiz count; the text is not AI-generated teaching content and makes no unsupported PYQ frequency claims.
2. The Current Affairs hub now includes a concise, crawlable study workflow and scope disclaimer, preserving the existing edition list, calendar and app links.

No new pages, redirects, Google API calls, learner data changes or new dependency are introduced.

## Release and measurement gates

- CI: TypeScript, lint, unit and existing browser SEO suites.
- Preview: Inspect initial HTML for each representative ebook and /current-affairs; test anchor navigation at 320px, 390px and desktop. Check absence of duplicate or misleading headings.
- Confirm canonical URLs, article/book schema, sitemap and published content remain intact.
- Collect GSC baseline before evaluating keyword impact. Do not interpret no GSC access as zero impressions.
- Test AI citations in actual generated answers, not only organic search result listings.
- Keep this PR draft; do not merge without explicit approval.
