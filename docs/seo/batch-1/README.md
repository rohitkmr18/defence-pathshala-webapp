# SEO / AEO / GEO Batch 1 — 15 November 2026 IST

## Baseline
Production Vercel deployment `dpl_7yepMKjhpgHyFDfVdjCmq723MmZE` (`kvft74uuz`) was READY and mapped to www.defencepathshala.in. Production and GitHub main both resolved to `817400d18de628109e000f08880a8edef7f0b413`.

Raw evidence: production-sitemap.xml and production-audit.json. Read-only HTTP crawl covered 285 sitemap URLs and seven additional unique paths (292 total). All sitemap URLs returned 200, with self canonicals (homepage trailing slash normalized by Next), and no observed noindex directives. This checks HTTP HTML, not Google's selected canonical or indexing decisions. Sitemap routes include CDS/CAPF exam, year, subject, topic archives; AFCAT; daily/monthly CA; About; Library and six ebooks. Bare /pyq and /pyqs return 404; these are not canonical hubs. Existing /pyq/cds and /pyq/capf aliases redirect to plural hubs. Exact-question links redirect anonymous users to normal login.

## Assessment and ranked gaps
SEO: useful foundation, materially weakened by missing static public content. AEO: source-linked educational content exists, but entity relationships and page schema incomplete. GEO: discovery readiness only; actual AI answer citation visibility unmeasured. No numerical maturity score is justified.

P0: none established in the audited public surface.
P1: About, Library, all six ebooks and monthly capsule return shells without visible H1/content in raw HTML. Educational content exists in RSC payload but requires client hydration. DashboardShell's Suspense wraps search-param hooks with an empty fallback on statically generated pages.
P1: root homepage canonical is inherited by internal lab/visual-preview pages, which also return index/follow despite robots disallow. Public canonical hubs themselves are already correct.
P1: GSC operational access is blocked; indexing, canonical selection, query/page performance and cannibalization cannot be verified.
P2: older exam/subject/year/topic metadata inherits homepage Twitter title/description. Article/ebook schema and stable organization IDs missing. Ebook body is largely raster pages; only catalogue, section summaries and quizzes are textual. Thin year/subject combinations remain eligible with >0 questions; topic threshold is already 10. No content expansion authorized here.

## Changes and file rationale
- app/layout.tsx and app/page.tsx: scope homepage canonical to homepage; add stable organization/site IDs and publisher relationship.
- components/layout/DashboardShell.tsx plus about/library/current-affairs layouts: opt-in public-content Suspense fallback; private routes retain existing fallback and auth behavior.
- app/exams/[exam] and nested app/pyqs metadata: matching page-specific Twitter identity.
- app/admin, app/pyq, app/afcat/lab, app/afcat/visual-preview layouts: explicit noindex for internal surfaces without changing page components or authentication.
- app/robots.txt: cover bare /dashboard and /admin in addition to child routes.
- lib/seo-schema.ts; dated CA and ebook pages: escaped Article/Book JSON-LD, publisher linkage, source citations and catalogue facts. No fabricated personal author or publication timestamps.
- scripts/test-seo-foundation.cjs, e2e/seo-foundation.spec.ts and SEO workflow: regression coverage for safe schema, both sitemap upstream failures, SSR content, canonical scope and crawl controls; broaden workflow path triggers.

Sitemap already fails closed when either inventory source fails, deduplicates valid routes and enforces topic eligibility. This behavior is preserved; no static-only success fallback was added. Wildcard robots allows search and AI crawlers on public paths. Googlebot/Bingbot, OAI-SearchBot and training agents such as GPTBot currently share access; search crawling and training are distinct purposes. No training policy change was assumed. robots is not authorization and disallow can prevent discovery of noindex; if internal URLs are already indexed, use GSC removal/recrawl workflow after review.

## Search and AI visibility
GSC Wizard list_sites returned payment_required / subscription_required: trial ended and no active subscription. No 28-day or three-month metrics, coverage, sitemap submissions, selected canonicals, cannibalization or CrUX field results could be retrieved. Restore subscription at https://tool.gscwizard.com/settings/subscription before repeating. No metrics inferred from historical memory.

Available web-search system was queried for:
1. best CDS previous year questions topic wise practice explanations
2. CAPF AC previous year questions practice online
3. AFCAT free mock tests performance analysis
No Defence Pathshala URL or brand mention appeared in the returned results. This is a small retrieval sample, NOT a test of generated answers or citation rankings. ChatGPT Search, Gemini and Perplexity answer sessions were not accessible/tested; actual citations and brand mentions there are unknown. Do not equate search retrieval absence with zero AI visibility.

## Local verification
Production build passed. TypeScript and targeted schema lint passed. Eleven SEO unit tests passed, including partial inventory failures and script escaping. Three HTTP acceptance tests passed: invalid routes/protected admin API, aliases/exact question preservation, public metadata/SSR/schema/internal robots. Local Chromium could not launch because process singleton socket creation is denied by this runtime; desktop/mobile browser tests are delegated to existing GitHub SEO acceptance, not reported as local passes. No production learner records were read or created. Analytics and API contracts were not modified.

## Batch 2 scope
1. Restore GSC; collect settled 28-day and three-month query/page data by CDS/CAPF/AFCAT/CA/ebook, brand split, cannibalization, sitemap/indexing coverage and selected canonicals.
2. Verify preview then production HTML after an approved merge; inspect representative URLs in GSC and request indexing where needed. Monitor impressions/clicks by landing page and meaningful practice activation, consistent with Analytics & Behaviour Intelligence v1.
3. Audit thin year/subject pages with corpus evidence before choosing noindex/consolidation; review title overlap between /exams and /pyqs by real query intent.
4. Add editorially reviewed semantic ebook text and sourced answer summaries, with verified contributor profiles and update dates; no speculative mass pages.
5. Run repeatable logged-out answer-engine prompts across accessible ChatGPT Search/Gemini/Perplexity, recording answer, citation URL, brand mention, time and system separately.
6. Measure CrUX/mobile performance when field data is available; inspect LCP/INP/CLS before optimization. No CWV pass is claimed in Batch 1.
