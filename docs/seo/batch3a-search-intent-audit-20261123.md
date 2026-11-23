# Batch 3A — Evidence-based CDS / CAPF search-intent audit (23 Nov 2026)

## Evidence

Google Search Console 28-day and 90-day exports were supplied directly by the founder. The 90-day page report had 117 landing URLs and the 28-day report had 116; PYQ page metrics were identical across these windows. This is consistent with recent discovery, **not proof of a ranking trend or the exact first-indexed date**. Query-page exports omitted most page-level traffic because Google does not fully disclose anonymized or long-tail queries.

Relevant observed query examples (28 days): `cds pyq` 0 clicks/25 impressions on the CDS hub, `cds pyqs` 4/42 on the CDS hub, `capf pyq` 0/9 on the CAPF hub and `capf pyqs` 1/12 on the CAPF hub. Multiple pages can rank for one query; do not assume cannibalization. Neither export measures AEO/GEO citations.

## Code findings

- Both /pyqs/cds and /pyqs/capf already have unique indexed canonicals, specific H1s, metadata, year/subject links and scope disclaimers. No basis to rewrite their titles or invent singular-variant destinations.
- Their dynamic year template used `official ... with full answer keys`, described an available dataset as a complete year paper and offered an `Attempt ... Exam Paper` CTA. This overstates what data-backed eligibility proves.
- The subject template described all answers as verified with comprehensive explanations and called a count distribution a verified dataset, despite inventory being eligible rather than necessarily exhaustive.
- The nested year-subject template called percentage of eligible inventory `Paper Weightage`, which users could reasonably mistake for actual official exam-paper weightage.
- These inaccuracies undermine education quality and the credibility of answers quoted in AI search, irrespective of ranking effects.

## Implemented (staging-first)

- Accurate year/subject metadata, visible descriptions and CTA wording that reflect eligible archived questions.
- Rename the year-subject percentage metric to `Share of Available PYQs`; disclose the eligible question denominator.
- Preserve dynamic counts, existing routes, canonicals, indexability, sitemap, RLS, and practice query filters.
- Add SEO browser assertions for representative CDS and CAPF URLs.

## Deferred pending further evidence

- No duplicate `/pyq` pages or forced redirect changes.
- No ranking claims, PYQ topic-frequency extrapolations or third-party citation claims.
- No change to CDS History based on its unusual low-volume operator queries: investigate whether they persist in daily/weekly search data.
- No separate AEO/GEO claims: establish a structured AI-answer citation benchmark, with dated prompts and evidence, before scoring.
- Daily GSC data and exam-specific query-to-URL mapping are recommended as the next measurement enhancement.

## Acceptance

Require green Main CI, green SEO foundation browser suite, READY Vercel preview and inspection of metadata + visible headings at mobile/desktop widths. No production merge until explicit founder approval. 
