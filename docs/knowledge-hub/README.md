# Knowledge Hub Packages A+B — Release contract

This branch implements proposed public /learn and /learn/[slug] pages, a typed read-only article model, safe structured data and article-to-practice links.

## Release blockers
1. Staging database migration `20261117170636_knowledge_hub_foundation` was applied successfully to **pxfstrzceyxnweeaydvz** and its SQL is checked in. Production migration remains blocked pending acceptance. Verify migration parity against the repository migration ledger before deployment.
2. RLS role-switch testing on staging passed with disposable draft, published and future-dated rows in a rolled-back transaction: anon/authenticated saw only published, neither could write; zero QA records remained. Still required: real HTTP/RPC tests with anon and authenticated credentials against staging before signoff.
3. Add real reviewed content (the schema has deliberately no fabricated seed articles).
4. Verify preview public HTML contains H1, text, Article and BreadcrumbList JSON-LD, canonical and social tags at 320/390/desktop widths.
5. Check /learn sitemap membership and published articles only. Fail closed if inventory query fails; do not publish a truncated sitemap.
6. Confirm unrelated PYQ/current affairs routes and existing SEO acceptance CI still pass.
7. Capture real Search Console baseline, then separately approve production migration/deployment.

## Deferred
Admin editing interface, approval state transitions, automated research/vidIQ, daily AI drafting, publishing automation, related article engine, advanced categories and analytics events are **not** included in this PR. No navigation changes were made to learner dashboard. Link /learn from one public secondary menu only after content exists and approved UX review.

## Trust constraints
Titles, sources and authors must reflect verified editorial evidence. Only https source URLs rendered, and article content is rendered as React text nodes, not untrusted HTML. RLS is the authority for published-only reads. Publication operations remain server-controlled. A new public route does not imply an SEO ranking or AI citation guarantee.
