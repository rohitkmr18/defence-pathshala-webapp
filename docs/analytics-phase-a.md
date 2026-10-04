# Analytics Phase A: Preview acceptance

The frontend emits one DP product event through `trackProductEvent()` (or the
legacy learning-event bridge). GA4's existing dataLayer and `posthog-js` receive
that event. Supabase remains the source of educational truth: attempts,
server-scored correctness, practice sessions and learner intelligence. Browser
telemetry must not replace these records. No clickstream table is required.

## Browser initialization and identity

Next.js 16 runs `src/instrumentation-client.ts` before hydration. It initializes
`posthog-js` once, using `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and
`NEXT_PUBLIC_POSTHOG_HOST` (US ingestion by default). Missing token means no
PostHog capture; provider and context errors never block a learner action.

DP's existing anonymous ID is bootstrapped into the SDK as an anonymous distinct
ID. It persists in localStorage, with an in-memory fallback when storage is
blocked. Only Supabase's confirmed user UUID is passed to `posthog.identify()`;
no profile properties, email, OTP or credentials are passed. Supported identify
semantics associate the anonymous history with the UUID. Each page starts with
the visitor identity until Supabase establishes the authenticated identity.
Logout resets the SDK, device ID and session, rotates the DP anonymous ID, and
clears DP event deduplication keys. Switching accounts also resets first.
Repeated auth callbacks do not identify twice; stale initial auth lookups cannot
restore a signed-out user.

Events carry v1, route, source surface, timestamp, anonymous/auth identity,
device/viewport context, and release metadata. `mode` is also enriched as
`practice_mode`; session events retain `practice_session_id`. Vercel stamps
`NEXT_PUBLIC_DP_DEPLOYMENT_ENV` from `VERCEL_ENV` and SHA from
`VERCEL_GIT_COMMIT_SHA` (GitHub SHA is the CI fallback). Local runs use NODE_ENV,
including development/test. Acceptance queries must filter
`deployment_environment = preview` and the accepted `git_sha`.

## Replay privacy and project settings

The SDK includes session replay capability but does not force recording or
bypass sampling. In the intended PostHog project's Session Replay settings:

- Enable **Record user sessions** and choose Preview acceptance sampling/minimum
  duration appropriate for the test; confirm URL/flag triggers allow the Preview.
- Keep console recording, network headers/bodies and canvas recording disabled.
- Retain input/text masking. Do not add unmasking rules for authentication/setup.
- For analytics dashboards, require an environment filter before interpreting
  acquisition, activation, learning loop or retention behavior.

Repository defaults mask all input values, all DOM text and attributes; input,
textarea, select and contenteditable elements are additionally blocked. This
intentionally reduces replay visual fidelity. Canvas and JSON-LD capture are
disabled. No safe-text exceptions have been introduced. Console recording,
performance/network capture, autocapture, automatic pageviews, surveys and
exception capture are disabled. Network recording hooks discard requests;
headers and bodies are disabled explicitly. SDK URL masking covers auth query
parameters and strips fragments, and outgoing URL/referrer metadata is reduced
to origin/path. Canonical payloads reject sensitive property names as defense in
depth; call sites must continue constructing bounded non-sensitive properties.

No PostHog project-level settings or production Vercel settings were changed by
this implementation. Replay's actual availability and masking must be inspected
in a real Preview recording before acceptance.

References: [Next.js setup](https://posthog.com/docs/libraries/next-js),
[identity](https://posthog.com/docs/product-analytics/identify),
[replay privacy](https://posthog.com/docs/session-replay/privacy), and
[network recording](https://posthog.com/docs/session-replay/network-recording).

## Live acceptance still required

Use ordinary Preview actions: logged-out dashboard → Explore → exam/subject/topic
→ Practice CTA → OTP auth → practice → answer → Check → Next → dashboard →
Next Best Action → mistakes → related practice. Verify actual ingestion, one
logical Check/Next event, session lineage, UUID linking and a logout/account-switch
boundary. Inspect the recording for masked email/OTP/password/profile content
and absent credentials/network payloads. Verify GA4 still receives the same
canonical events. Do not fabricate events or dashboards; create the four planned
dashboards only after actual Preview events exist.

## Repair after failed live acceptance at 83cb67d

Live acceptance of that commit failed. The repository repairs below require a
fresh targeted Preview retest; these engineering checks do not establish live
acceptance PASS.

- New sessions propose a UUID to the existing session API. The confirmed row ID
  replaces browser identity before the authenticated player/lifecycle events
  mount. Local-only guest/offline events use `local_session_id`, never a device
  identifier in `practice_session_id`. Existing durable snapshots normalize to
  their `server_id`.
- Guest checks remain pending. Authentication restores the preserved questions,
  creates an owned row through the existing API and replays checked answers with
  server scoring. Legacy guest snapshots marked saved are also reconciled.
- `practice_started` describes entry into a newly created durable session.
  `practice_resumed` requires an existing session with prior progress and uses
  a stable entry transition key across effect reruns. Addressable URL updates
  do not re-enter the player. Zero-progress restoration does not imply resume.
- Explore exposure uses one key per page entry; filter changes have separate
  selection events. New visits get a new exposure key.
- Shared context reads selected filters or actual session state, including entry
  origin and question IDs. NBA navigation and click attribution use the same
  recommendation target URL; resume links retain saved filters.
- `mistake_resolved` requires confirmed durable persistence, server-scored
  correctness and the latest prior durable attempt being incorrect. The response
  includes bounded canonical question/session context and the durable attempt ID
  used for event deduplication. Idempotent attempt retries preserve the original
  attempt rather than overwriting its timestamp. Later correct attempts do not
  resolve again unless a new incorrect attempt intervenes.

`scripts/test-analytics-acceptance.cjs` exercises real session/attempt API and
client code with isolated in-memory Supabase responses. It covers durable
lineage, guest claim and reload, lifecycle separation, repeated effect replay,
Explore selections/CTA context, NBA target attribution and verified resolution.
GitHub CI runs it alongside all existing learning, auth, onboarding, migration
and backend regressions and the production build.

Targeted live retest: Explore exposure and filter context → Practice start and
Supabase UUID reconciliation → guest/auth continuation and saved attempt →
interrupted Resume once → Next question lineage → NBA attribution → incorrect
to correct mistake resolution. Query PostHog by the new Preview SHA/environment.
GA4 and replay remain separate evidence checks; no project settings are changed.
