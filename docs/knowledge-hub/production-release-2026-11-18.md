# Knowledge Hub production rollout — 18 November 2026 (IST)

## Verified changes

- Feature branch `feature/knowledge-hub-foundation`, draft PR #183, reviewed and merged by squash.
- Production merge SHA: `8972cec1119bd7c01383c9fe9ed17b82e3e21e4a`.
- Latest pre-merge test SHA: `99bc5f14de5892d46c216310318e384302ae9de4`; both main CI and SEO acceptance passed, including synthetic Chromium tests at 320px, 390px and 1440px.
- Vercel production deployment `dpl_HScs7yTZtcDWE1bo4nkXrgfaiq4E` reached READY.
- Supabase **production** project `afhwegrxnvgsqbqadvwr`: migration recorded under version `20261117203816`, name `knowledge_hub_foundation`. Staging version was `20261117170636`.
- The applied SQL originates from `supabase/pending/knowledge-hub/20261117170636_knowledge_hub_foundation.sql` and contains no DROP operation.
- Production `knowledge_articles` has RLS enabled, one published-only SELECT policy, zero public write grants to `anon` and `authenticated`.
- Approved article `how-to-analyse-cds-pyqs` inserted into production with `published` status and 27 blocks; content copied from approved staging article.
- Production sitemap includes canonical article URL. A production HTTP read made immediately after the database insert returned an empty hub / cached 404 on the article page, consistent with the 300-second `unstable_cache` TTL. After the 300-second application cache expired, the production `/learn` listing and `/learn/how-to-analyse-cds-pyqs` both returned HTTP 200 with the article content.

## Migration-ledger governance

The protected `scripts/test-migration-ledger.cjs` test enforces the exact **historical observed production baseline** recorded in `docs/auth/production-migration-history.json`, whose last expected version is `20261104084122`. The production migration database also contains newer applied versions (including 20261106, 20261110 and the Knowledge Hub migration). **Do not simply append the Knowledge Hub migration to the historical snapshot or change the last-version assertion in isolation.**

A separate database-lineage reconciliation must capture all post-baseline migrations in actual apply order, verify SQL equality against `supabase_migrations.schema_migrations`, and update reconstruction fixtures/test contracts together. The baseline check must remain immutable until a complete approved reconciliation.

## Rollback strategy

- If the Knowledge Hub frontend regresses, roll back or redeploy the previous Vercel production commit, without dropping the new table. The additive schema can safely remain unused.
- If the published article itself is defective, set its status to `archived` through an authorized server-side database workflow, preserving content/revisions. Do not remove or mutate learner data.
- Follow production rollback with live HTTP checks for legacy PYQ, AFCAT and Current Affairs journeys.

## Release acceptance still required

- **PASSED:** Production /learn listing and article return HTTP 200 and actual article HTML after cache expiry.
- **PASSED:** Article and BreadcrumbList JSON-LD, self-canonical and sitemap URL on production. Source destinations need separate link-integrity monitoring.
- **PASSED:** Unknown article URL returns 404 with noindex. Separate staging-only asset/admin route tests remain deferred.
- **PASSED (HTTP smoke):** `/pyqs/cds`, `/pyqs/capf`, `/current-affairs`, `/afcat`, `/library/economy-decoded` and `/robots.txt` returned HTTP 200. Full logged-in learner flow tests remain separately required. Avoid indexing claims until independently verified in Search Console.
