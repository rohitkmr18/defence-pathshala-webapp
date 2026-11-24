# Public route performance baseline

Production reference: a028ef35ace728be68444fb9c4636cec1fe0fb13 (verified November 24, 2026).
Previous PageSpeed field metrics reported: LCP 3.5s, FCP 3.3s, TTFB 1.4s, INP 162ms, CLS 0.03. These are historical field measurements, not fresh lab measurements.

## Gate 1: collect baseline
From the repository root on a network-enabled machine with Node 18+ and curl supporting %{json}:
```sh
node scripts/perf-public-baseline.mjs > /tmp/dp-http-baseline.json
```
Record the actual production deployment SHA, test timestamp, location, HTTP status, redirect chain, median TTFB and total time. Repeat on preview with PERF_BASE_URL set to its authorized URL; protected previews need authorized browser testing instead. Repeated samples are not guaranteed cold/warm cache tests. HTTP timings are not browser Web Vitals.

Run mobile Lighthouse five times on homepage, CDS/CAPF/NDA archive, Current Affairs, AFCAT and CDS GK mock entry using the same Chrome/Lighthouse versions, device/network profile and test environment before/after. Save JSON reports and inspect LCP element, waterfall, JS/CSS transfer and main-thread work. Inspect response cache headers independently; no user cookies or credentials in artifacts. Distinguish CrUX field data from lab data.

## Gate 2: scoped implementation
1. PERF-01: replace homepage full CA archive retrieval with minimal published quiz date lookup using public-only data access. Preserve fallback, published visibility, legacy quiz eligibility and latest-date behavior; measure query and payload. Do not alter editorial normalization or existing archive functionality.
2. PERF-02: only after measuring proxy overhead, investigate explicit anonymous public-route fast path. Preserve auth cookies, refresh, guarded redirects, API authorization and RLS.
3. PERF-03: cache only verified non-personalized public content with bounded freshness and publication invalidation. Never cache user state or drafts.

## Gate 3: acceptance
Compare baseline and preview on matched conditions. Proposed mobile targets: LCP <=2s, FCP <=1.5s, TTFB <=600ms, Lighthouse performance >=90, CLS <=0.05; targets not guarantees. Require no material regression on other routes, all CI green, and manual validation of authentication/onboarding, question bank, mock timer/resume, math rendering, current affairs quiz freshness, GA4 events, SEO metadata and unchanged landing-page text. No shared cache of authenticated content. No merge without explicit approval.

No runtime baseline was captured in the initial execution environment because public DNS resolution failed (curl exit 6). Do not interpret this as production downtime. No application changes are authorized by this baseline-only commit.
