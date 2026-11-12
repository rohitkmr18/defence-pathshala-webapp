# Organic search foundation — CDS and CAPF AC

Audit date: 12 November 2026 IST. **Draft / NO-GO for production release until final preview, CI and manual acceptance gates pass.** No rankings or indexing guarantees.

## A. Deployment and repository verification

- Production domain: https://www.defencepathshala.in
- Vercel production deployment: `dpl_EWiBTYt3KwPmrLEL6HhZGmysj85r`, READY, production target, main branch.
- Deployed and checked-out main SHA: `d36e4c7c77e5c2d4ff0d33e582509c6945541c30` (approved descriptions, PR #153).
- Historical `87cb4b4...` was not used as current HEAD.
- Isolated branch: `feat/seo-foundation-cds-capf`.
- Open PR overlap: #154 touches the same archive title/H1 and navbar; **choose this comprehensive patch or reconcile #154 before merge**, never blindly merge both. #151 subject changes are left untouched. #127 removes the temporary production ingestion hook: this branch necessarily removes its build invocation to make builds read-only, but retains its loader and data files. Reconcile the package.json line when #127 merges. AFCAT #137/#138 and other branches are untouched.
- No production database, authentication, secrets or infrastructure changes. No merge or production deployment.

## B. Evidence-backed technical audit

Evidence: `evidence/production-audit.json`, `evidence/sitemap-before.xml`, `evidence/sitemap-crawl.json` when present. GET probes used ordinary HTTP clients. Request duration includes the execution proxy; it is **not** a Core Web Vital or end-user latency measurement.

| URL or family | Indexability | Canonical | Metadata | Content | Internal links | Sitemap | Performance | Priority |
|---|---|---|---|---|---|---|---|---|
| `/` | 200, index/follow | WWW root | Brand/product title | SSR H1 | Exam and archive discovery | Yes | 66,866 decoded HTML bytes | P2 |
| `/exams/cds`, `/exams/capf` | 200, index/follow | Self | Informational exam intent | SSR guides | Archive links | Yes | ~80–83 KB HTML | P2 |
| `/pyqs/cds` | 200, index/follow | Self | Approved description already deployed; title lacks PYQ abbreviation; Twitter inherited | SSR year/subject cards; unqualified verification/official wording | Practice CTA only near bottom; no mobile discovery menu | Yes | 85,673 HTML bytes | P1 |
| `/pyqs/capf` | 200, index/follow | Self | CAPF title omits AC; Twitter inherited | SSR inventory; same claim concerns | Same mobile/CTA gap | Yes | 89,318 HTML bytes | P1 |
| `/pyqs/{exam}/2026` | 200, index/follow | Self | Year intent | SSR subject counts | Parent/subject/practice links | Yes | ~65 KB HTML | P2 |
| `/pyqs/cds/polity` | 200, index/follow | Self | Subject intent; #151 owns improvements | Questions/answers SSR | Topic/year/practice | Yes | **1,776,438 HTML bytes** | P1 future performance review |
| `/pyqs/capf/history` | 200, index/follow | Self | Subject intent | Questions/answers SSR | Topic/year/practice | Yes | **1,129,227 HTML bytes** | P1 future performance review |
| `/pyqs/cds/history/modern-history` | 200, index/follow | Self | Topic intent | SSR questions | Parent/practice | Yes | 434,268 HTML bytes | P2 |
| `/pyqs/cds/2026/polity` | 200, index/follow | Self | Year + subject | SSR content/navigation | Parents/practice | Yes | 57,578 HTML bytes | P2 |
| `/current-affairs` | 200, index/follow | Self | Public CA hub | SSR H1 and archive | Editions/months | Yes | 81,394 HTML bytes | P2 |
| `/afcat` | 200, index/follow | Self | Public mock-test landing | SSR product explanation | App entry | Yes | 62,341 HTML bytes | Separate AFCAT work |
| `/about` | 200, index/follow | Self | About metadata | No H1 in raw HTML; client content | Brand links | Yes | 58,122 HTML bytes | P2 separate trust/SSR review |
| `/dashboard/question-bank` | Public guest shell, 200, noindex | Inherited root; excluded | Application intent | Hydrated Explorer | App navigation | No | JS-dependent | Keep out of search |
| `/dashboard/practice?exam=…` | Public guest shell, 200, noindex | Inherited root; excluded | Application intent | Hydrated configurator | Existing auth continuation | No | Browser-loaded filters verified | Preserve journey |
| `/pyq/[questionId]` | Auth-checked exact-question session route | Not a public question article | Root inheritance risk | Calls getServerProfile, client player | CA-linked session entry | No | Source inspection only | Separate noindex review |
| Invalid exam/year/subject probes | **404, noindex** | Root inherited on error | Not index eligible | Genuine not-found | — | No | No soft-404 found in probes | Pass |

### Confirmed findings and implementation

1. **P1/high confidence: incomplete sitemap on failed reads.** PYQ metadata returned `[]` without a key and `break` on query error, including after collecting a partial page. Sitemap also caught failures and returned empty cohorts. Current Affairs sitemap had the same failure-as-empty behavior. Fix: throw generic errors, retain Next data caching, paginate PYQ metadata in stable ID order, make sitemap request-time, and propagate errors. A cold upstream failure now fails the request instead of publishing a successful incomplete XML. This does not claim a durable last-known-good sitemap service; caching behavior during an outage still needs hosted verification. A snapshot store would be a separate architecture decision.
2. **P1/high confidence: unsupported DB exam risk.** `examToSlug` fell back to arbitrary lowercase values, although loaders only accept CDS and CAPF. Filter to canonical supported DB values, valid four-digit years and usable nonnumeric subject slugs; omit empty topic slugs, deduplicate paths. Topic threshold stays at 10. These are source/test-proven risks; current production invalid URLs are reported separately by the crawl.
3. **P1/high confidence: mobile navigation.** Existing discovery links were hidden below md with no menu. Native disclosure now exposes all existing destinations without JS; flex wrapping prevents the brand/CTA row forcing a narrow viewport wider.
4. **P1/high confidence: truthful archive scope.** `paperTabDbValues(null)` selects GS, not English/Maths. Keep current data scope and disclose it. Current GS counts are CDS 1,677 and CAPF 867 across 2020–2026; dynamic inventory remains authoritative. Do not infer complete papers from year cards.
5. **P1/high confidence: claim and conversion gap.** Remove “Official UPSC Archive”/blanket “verified” from changed landing pages, show real inventory, useful FAQs, founder identity and non-affiliation, and add a visible practice CTA and guide link.
6. **P2/high confidence: Twitter inherited root identity.** Reuse `pageMetadata()` for archive-specific title/description/canonical/social tags. Add visible-path-matching Home → exam PYQs BreadcrumbList. No FAQ rich-result or course schema.
7. **P1/high confidence: build mutation risk.** Current npm build invoked a loader capable of production writes when configured. Remove the invocation before any branch preview. This is required by the no-database-writes constraint, not an unrelated ingestion refactor.
8. **P2/high confidence: search reporting gap.** Admin route only exposed page grouping. Add validated query/page/device/country/date dimensions, exact-page filtering, paired dates and pagination using the existing Google client and unchanged auth guard.

### Checks and limits

- Non-WWW `/pyqs/cds` → WWW in one 308. Trailing slash → no slash in one 308.
- robots.txt accessible, references the correct WWW sitemap. Public archives allowed; private/app/auth routes excluded from sitemap. robots blocking is not itself a noindex guarantee.
- Initial XML: 272 unique URLs; parseable, canonical WWW format. Full GET crawl: all 272 returned 200, no redirects and no canonical mismatch. Largest payload: CDS Science & Technology, 3,763,765 decoded HTML bytes. PYQ lastmod is correctly omitted; CA uses stored dates rather than today's date.
- Invalid `/pyqs/unsupported`, `/pyqs/cds/9999`, `/pyqs/cds/not-a-subject`: 404 + noindex. Initial successful pages have no X-Robots-Tag exclusion.
- Organization and WebSite JSON-LD parse successfully. Existing public social URLs are present; ownership/endorsements are not independently verified. Founder claims are founder-supplied facts, not institutional endorsements.
- Shared Chrome: both archive CTAs reach guest practice with the intended selected exam; loaded inventory matches archives. No session creation/answer submissions were performed. Authentication and saved results were not live-tested.
- Local Chromium launch failed with `socket() failed: Operation not permitted`. Dedicated CI tests cover 320, 390 and 1440 widths; until their result is recorded these are pending, not passed. No Lighthouse, CrUX, INP, CLS or LCP claims. Large subject HTML is a measured concern, not proof of a Core Web Vitals failure.
- GSC Wizard returns `payment_required`. Direct endpoint anonymous GET correctly returns 401. No authenticated admin credential is bound in this workspace; live configuration, CAPF search baseline and indexing states remain unknown. No subscription purchase or credential extraction.
- GA4 loads only in production; existing `trackLearningEvent` emits practice_launch/practice_start through dataLayer. The main source does not establish a consent-aware PostHog conversion pipeline. #20 owns wider analytics work. This patch adds only `origin=seo_cds_archive`/`seo_capf_archive` to existing practice links. **Origin identifies the page, not organic acquisition**; filter by session source/medium separately. Do not count CTA clicks as started practice.

## C–E. Keyword architecture and landing-page optimisation

No verified keyword search-volume data was available. All demand priorities below are hypotheses informed by product relevance and the founder's supplied page baseline. No singular/plural duplicate pages.

| Cluster | Intent | Existing URL / target canonical | Supporting terms | Gap | Priority | Evidence |
|---|---|---|---|---|---|---|
| CDS PYQ / CDS PYQs | Practice + archive | `/pyqs/cds` | CDS previous year questions, solved PYQ, online practice, GK PYQ | Scope and CTA clarity | P1 | Public 1,677-question GS inventory; founder page baseline |
| CAPF AC PYQ / CAPF PYQ / CAPF PYQs | Practice + archive | `/pyqs/capf` | CAPF Paper 1 PYQ, UPSC CAPF previous year papers, solved questions | Explicit AC/Paper I, trustworthy claims | P1 | Public 867-question inventory; demand unverified |
| CDS preparation / exam guide | Informational | `/exams/cds` | Pattern, syllabus, preparation | Keep informational focus; link archive | P2 | Existing guide |
| CAPF AC exam guide | Informational | `/exams/capf` | Exam pattern, Paper I preparation | Same intent boundary | P2 | Existing guide |
| CDS / CAPF year papers | Archive | Existing `/pyqs/{exam}/{year}` | Year-specific previous questions | No complete-paper claim without inventory proof | P2 | Year cards + status checks |
| CDS Polity / History / Geography PYQ | Subject practice | Existing subject canonical | Subject-wise, topic-wise PYQs | #151 review; large HTML; verify actual query demand | Phase 2 | Questions SSR; no new pages in this patch |
| CAPF History / Polity / Geography / Science PYQ | Subject practice | Existing `/pyqs/capf/history`, `/polity`, `/geography`, `/science-technology` | Topic practice and answers | Demand, content quality and performance | Phase 2 | Existing archive cards |
| CDS English PYQ / Mathematics PYQ | Paper practice | No verified public SEO archive; app paper tabs exist | English previous papers, maths practice | Requires paper-aware public IA and inventory audit | Separate approval | GS filter explicitly excludes these papers |
| Defence exam question bank | Product discovery | Homepage → exam archives → `/dashboard/question-bank` (noindex) | CDS/CAPF question bank | Consider substantial public feature explainer only after demand proof | Phase 2 | Guest Explorer exists, JS-dependent |
| Defence exam performance analysis | Product explanation/comparison | Homepage/current product journey; no new canonical | Practice insights, mistakes | Verify authenticated behavior and conversion before marketing | Phase 2 | Source implementation, live results unverified |
| AFCAT mock tests | Practice/product | `/afcat` | AFCAT online mock | Separate #137/#138 acceptance | Separate release | Public landing verified |
| Defence current affairs | Educational | `/current-affairs` and existing edition/month pages | Daily CA, monthly capsule | Distinct from PYQ intent | Maintain | Public routes and sitemap |

Cannibalisation assessment: homepage owns brand/product breadth; exam guides informational intent; exam archives broad PYQ practice; years/subjects/topics narrow distinct intent. Competition in actual query results is **unverified without GSC query/page rows**. Avoid a new `/pyq/cds` or `/pyq/capf`; the existing `/pyq/[questionId]` is a different session feature.

### Before/after metadata

| Page | Before title (without suffix) | After title (without suffix) |
|---|---|---|
| CDS | CDS Previous Year Questions (2020–2026) | CDS PYQs – Previous Year Questions & Practice |
| CAPF | CAPF Previous Year Questions (2020–2026) | CAPF AC PYQs – Previous Year Questions & Practice |

The root appends ` | Defence Pathshala` once (62/66 characters respectively). Display truncation depends on pixels; no fixed character rule guarantees visibility.

The approved production descriptions include “performance insights”. Authenticated insights were not demonstrated during this audit. The proposed patch therefore uses these narrower alternatives for review:

- CDS: **Browse UPSC CDS GK previous year questions by year and subject, with available answers and explanations. Choose a topic and continue to PYQ practice.**
- CAPF: **Browse UPSC CAPF AC Paper I previous year questions by year and subject, with available answers and explanations. Continue to targeted PYQ practice.**

Credentials are visible but subordinate to student utility. These descriptions are proposals in the draft, not published changes. Google may rewrite titles/snippets.

## F. Implementation and QA

Changed files are listed by the PR diff. Product changes are limited to existing landing pages/navbar, SEO data/sitemap failure handling, existing protected reporting, and removal of the data-writing build invocation. Tests/fixtures/docs are additive. No new subject/topic pages, migrations, auth changes or AFCAT changes.

Local evidence before final PR CI:

- Clean `npm ci --prefix frontend --ignore-scripts`: PASS, pinned Next 16.4.1.
- `npx --prefix frontend tsc --noEmit --project frontend/tsconfig.json`: PASS.
- Scoped ESLint: PASS; full repository lint: 37 errors / 46 warnings in existing surfaces (not a whole-repo green claim).
- Production `next build`: PASS with synthetic loopback Supabase settings, no ingestion hook.
- `node --test scripts/test-seo-foundation.cjs`: 8 PASS (unsupported routes, thresholds, partial reads, sitemap errors, social metadata, reporting validation, prototype route names).
- Existing practice/auth/OTP/AFCAT suites selected for regression: 92 PASS.
- Built HTTP smoke: PASS for both SSR pages, titles/canonicals, breadcrumb JSON, CTA origin, invalid-route 404/noindex, sitemap and protected admin 401; `evidence/built-http.json`.
- Mobile/desktop browser CI: pending until exact-commit workflow result is attached. Live authenticated acceptance, rich-results validator and field CWV remain unverified.

Risks: fail-closed sitemap returns an error on cold upstream outage; monitor and restore upstream rather than returning misleading empty success. Existing cache provides no independently proven durable last-good XML guarantee. Source changes overlap #154/#127. Full lint debt remains. Do not redesign or paginate subject archives without a separate decision: their large SSR payload is outside this minimal patch.

Rollback after an explicitly approved release: revert this branch's merge commit and redeploy the previous accepted revision. No DB reversal required. Retain the read-only build command if reverting would reintroduce ingestion writes; do not restore that hook without a separate explicit data-load instruction.

## G–H. Indexing manifest and founder checklist

See `indexing-manifest.md` for exact URLs and observed HTTP eligibility. **All Google indexing states are unknown**, not “not indexed”. Technical eligibility and sitemap inclusion do not establish indexing.

After a separately approved release and successful live checks:

1. In property `sc-domain:defencepathshala.in`, verify **https://www.defencepathshala.in/sitemap.xml** is successful. Submit only if missing or needing resubmission after the fix; confirm Google can fetch it.
2. Inspect **https://www.defencepathshala.in/pyqs/cds** and **https://www.defencepathshala.in/pyqs/capf**. Run Test Live URL after deployment. Compare user-declared and Google-selected canonicals with the exact WWW `/pyqs/` URLs.
3. Request Indexing for these two changed pages if live eligibility passes and Google's last crawl predates the release, or the page is not indexed. Do not request indexing of preview URLs, redirects, empty/noindex pages or app routes.
4. If already indexed with the correct canonical and fresh crawl, monitor; no repeated request is needed. We cannot identify that set without inspection results.
5. For exclusions, separate Crawled–currently not indexed (quality/selection), Discovered–currently not indexed (discovery/crawl scheduling), duplicate/canonical conflicts, robots block, noindex, redirect, and genuine 404. Fix the actual reason before requesting again.
6. Performance → Search results → Web → exact Page filter. Compare exact `cds pyq` vs `cds pyqs`; repeat `capf ac pyq`, `capf pyq`, `capf pyqs`. Keep country/device/date windows consistent. Use queries+pages to investigate cannibalisation. Query-filtered impressions/position are different from page totals.
7. Review at release +7, +14, +28 and +56 days. Dates are relative to the actual approved release, not this draft's creation date.

The URL Inspection API reads state; it cannot request indexing. Submission/inspection is not a ranking guarantee.

## I–J. Review and release gate

One draft PR and its exact-SHA preview are to be attached to the final handoff. **NO-GO for merge/production until** isolated CI, preview HTTP/mobile/desktop checks, overlap reconciliation and founder release approval. No need to buy GSC Wizard: the existing free direct Google integration can supply the baseline once an authorised operator accesses it.

## Measurement plan

Founder-supplied CDS historical baseline: **54 impressions, 7 clicks, ~13% CTR, average position 10.2 over three months**. This is page-wide, date bounds unspecified, not a keyword ranking or directly comparable 28-day baseline. CAPF baseline unavailable. Do not fabricate conversions.

| Review | Measurement / decision |
|---|---|
| Before release | Export latest complete 28 days and same-length prior window for each exact page, queries and devices; record dates/timezone, index state and deployment SHA |
| +7 days | Crawl/sitemap success, canonical agreement, redirect/error regressions, real student path; collect counts without attributing short-term ranking causality |
| +14 days | Query impressions/clicks/CTR/position split by singular/plural and device; inspect pages losing coverage |
| +28 days | Equal-window comparison; consented organic landing sessions → practice_launch → confirmed practice_start; separately measure starts per landing session and launches per landing session |
| +56 days | Evaluate sustained query coverage and practice engagement; decide which existing subjects merit deeper content and performance work |

Use GA4 organic source/medium plus the landing page and archive origin. A cross-page origin alone cannot classify traffic as Google organic. Exclude internal/preview traffic, avoid user identifiers in URLs, do not interpret anonymous-query omissions as zero demand. Validate collection/consent and event delivery before publishing conversion figures. PostHog integration/identity work remains with #20.

## K. Separately approved expansion roadmap

1. **Existing CDS/CAPF subject pages first:** join verified GSC query demand with actual eligible inventory and question quality. Review #151; prioritise history, polity, geography and science only if impressions and usefulness support it. Investigate large HTML with real mobile performance data before scaling.
2. **English and Maths:** inventory papers, explanations, key provenance, passage support and app filters; design paper-aware URLs without colliding with existing subject/year resolver. Separate design approval before implementation.
3. **Topics:** retain existing minimum 10-question technical threshold, but require editorial uniqueness, useful explanation, real query evidence and conversion relevance. Ten questions alone is not a quality guarantee. No mass generation.
4. **Public feature explainers:** only if current product supports the advertised experience and the page can demonstrate it meaningfully. Keep learner histories/results private.
5. **AFCAT/later exams:** wait for the separate release gates and real inventory. Do not label mocks as PYQs or invent years/questions.

Sources: [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [Search Analytics query API](https://developers.google.com/webmaster-tools/v1/searchanalytics/query), bundled Next.js 16.4.1 metadata/sitemap/cache documentation. Implementation retains current architecture; no Cache Components migration.

## Preview acceptance follow-up

Initial candidate `df712df783152f68ade9d5227fb694387574a6c9` deployed to https://defence-pathshala-webapp-9tuo8ixv2-rohitkmr18.vercel.app (READY, Preview, not production). HTTP checks: both archives 200, new titles/H1, production canonical URLs, origin-preserving CTAs and native menu; invalid routes 404; admin API 401. Preview sends X-Robots-Tag: noindex. Shared Chrome desktop rendering inspected successfully.

Preview sitemap has 267 URLs versus the 272 production baseline. Missing entries are exclusively Current Affairs 2026-11-07 through 2026-11-11; all PYQ URLs match. Treat this as an unresolved preview data/cache parity check until the backing source is verified; do not silently accept missing editions or write production data to make the test pass.

Initial CI failures were test-harness defects: URL matching assumed query parameter order, and the general editorial runner collected SEO tests against its unrelated fixture. Repair checks the semantic pathname/exam/origin and isolates the SEO spec to its own runner. Existing application code was not changed for these failures. All six initial viewport cases passed the overflow, mobile-menu, H1, canonical and breadcrumb assertions before the navigation assertion where failures occurred; complete cases still require the corrected rerun.
