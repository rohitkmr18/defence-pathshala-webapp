# Current Affairs private editorial workflow

The reporting interval is half-open, from the previous day’s 09:00 IST through the current day’s 09:00 IST. An event at exactly 09:00 belongs to the following edition. A delayed run takes the original intended edition date. Pass that date explicitly to the runner. A later reporting window can include related explanatory material up to 72 hours old when it is separately labeled and tied to a fresh event.

## Trusted runner

Run from the repository root with the locked frontend dependencies installed. Provide the existing server-side Supabase URL and service-role key through the trusted runner’s environment. Keep the input, review output and stage evidence in an access-controlled directory. Use isolated database credentials for rehearsal.

```sh
umask 077
node scripts/run-current-affairs-editorial.mjs YYYY-MM-DD adapters.json > review.json
```

The manifest has three keys, `discover`, `verify` and `assemble`. Each value is a path to a private JSON artifact or a trusted local command expressed as an argument array, such as `["node", "/secure/discover.mjs"]`. Commands get one JSON object on stdin with the edition date, interval, rubric and previous successful checkpoints. They return one JSON object on stdout. The runner supplies a minimal environment, enforces a four-minute command timeout and caps artifact size. Use commands under operator control and provision any provider access separately.

- **Discover** returns the exact `window`, a `coverage` array describing the sources checked and outages, and a `candidates` array. Check PIB and relevant Indian and international primary sources, plus independent discovery from sources such as The Hindu, Indian Express and Reuters where available. Keep the full interval and respect paywalls. The coverage record is an editorial assertion.
- **Verify** returns `{ stories, warnings }`. Each selected story has `headline`, an exact `eventAt` with timezone, `sources` with `url`, `checkedAt` and the claims or answers the source `supports`, and `context` items with `publishedAt`, `label` and `linkage`. Record the eight rubric components under `scores` using the keys supplied by the runner. Record deductions as `penalties: [{ points, reason }]`, and a written `justification` for scores of 68–74. Source evidence must cover each story and MCQ. Review individual claims and distractors against the cited primary sources. Maintain verdicts and warnings for unavailable evidence.
- **Assemble** returns the complete editorial fields described in [Issue 47 acceptance](current-affairs-issue-47.md), with headlined verification records in the same order. The actual publishing validator checks the manuscript, metadata and 3–5 VERIFIED MCQs. Use exact eligible PYQ IDs where verified, or an empty array with a warning.
- **Package** revalidates the assembly and checks the exact linked IDs against the eligible canonical read model. It stores the full evidence and edition with a SHA-256 over the exact review snapshot. The publication source retains its own SHA-256 for compatibility with the learner-facing publisher.

On a stage failure, fix the input or transient dependency and rerun the same command. PostgreSQL retains successful checkpoints and records attempts, starts, failures, completions and expired leases. A concurrent runner gets `busy` while the stage owner holds its lease. The lease expires after five minutes and fences late completions. Three attempts are available for each stage. After exhaustion, inspect the recorded history and use a reviewed correction only once verification and assembly have been completed.

To store a corrected revision after editorial review, use the same validation and PYQ eligibility checks:

```sh
node scripts/run-current-affairs-editorial.mjs YYYY-MM-DD --revise verified.json editorial.json > review.json
```

Identical snapshots reuse the original revision. A corrected revision requires fresh founder review. Review the full parsed `snapshot` alongside its `draftId` and package `sha256` through a private channel.

## Founder approval and publication

After explicit approval of the displayed review, the trusted founder GitHub account opens the existing issue titled `DP Current Affairs: publish YYYY-MM-DD` with a reference-only JSON body:

```json
{"schemaVersion":2,"operation":"publish","approved":true,"draftId":"<edition-date>-<package-sha256>","sha256":"<package-sha256>"}
```

The signed GitHub workflow and production Vercel handler authenticate the existing founder account and workflow, revalidate the immutable stored edition, and invoke the existing atomic PostgreSQL publisher through a wrapper. The wrapper serializes publication with revision insertion and rejects stale or missing references. A legacy v1 envelope remains available for dates without a private draft. Approval binds the reference in a founder-authored GitHub request. GitHub OIDC authenticates the workflow and actor identity. The existing connector’s assertion that a specific ChatGPT message represented founder approval remains a trust dependency.

Check the GitHub run, stored publication hash and public dated story page after a real approved release. An uncertain response requires independent verification before retry.

## Automation and release

The enabled ChatGPT task can continue its scheduled research. Its inspected configuration showed no attached runner, and the proven GitHub issue capability covers reference publication only. A reliable private path for scheduled stage outputs and returning the review package to the founder in ChatGPT still needs an authenticated integration. Keep private research and manuscripts out of GitHub issue bodies, workflow artifacts and logs. The trusted runner supports staged file intake for rehearsal while this integration is pending. The automated component currently depends on trusted research adapters or inputs and does not claim to have searched or verified sources itself.

Release requires explicit migration approval, then app deployment and a reference-only replay in isolation. The additive migration in `supabase/pending/20261128050329_current_affairs_editorial_workflow.sql` creates three RLS-enabled tables and service-role-only operations. Its pending location follows the repository’s applied-migration ledger convention. Anonymous and learner access is revoked. Existing approved editorial source and learner data require no backfill. The updated handler depends on the new database wrapper, so apply the reviewed migration before deploying the handler. Preserve the private tables on app rollback.

The runner uses the existing database and deployment stack. At one maximum-sized 512 KB review daily, the draft plus a copy in the final checkpoint use approximately 31 MB per 30 days before intermediate checkpoints, indexes, storage compression and retention. Provider charges and runner time depend on the selected adapters. This change adds no paid research provider.


The private-draft CI starts a disposable PostgreSQL 17 container with no published network port. It tests concurrent requests on separate connections, role denials, exact byte preservation, retries and the reference-based publication path. The regular Current Affairs regressions cover signed OIDC identities, the historical bridge, publisher rollback and reader behavior.
