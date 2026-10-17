# Monthly Current Affairs Intelligence — Phase 1 and next phases

## Phase 1 boundary

Routes follow existing App Router conventions:

- /current-affairs/monthly — catalogue
- /current-affairs/monthly/2026-10 — product detail
- /current-affairs/monthly/2026-10/sample — public interactive sample

Only October is allowlisted; malformed and other edition parameters render Next's
not-found page with noindex. The existing parent Suspense shell can stream HTTP 200
before notFound resolves; this is standard Next behavior, with no lesson rendered.
Daily Current Affairs remains free. ₹79 is the planned full-edition price.
There are no payments, orders, entitlements, commerce tables or migrations in this change.
The release-availability action reports an unavailable purchase state without collecting payment.
No validated PDF artifact was supplied; the page explicitly reports that it is unavailable.
The PDF-click event must be added through trackLearningEvent when an approved artifact is released.

## Public content and provenance

The sample calls getCurrentAffairsByDate, the existing published editorial read model,
and selects only the allowlisted story from the approved edition:

- Date: 2026-10-14
- Post: 852e10da-5c7a-4c0f-b380-67f6312cbb48
- Story: bcadb490-b39a-4f11-befd-fa8e15bf480b
- Title: First BIMSTEC Home Ministers’ Meeting Adopts Delhi Declaration
- Subject: International Relations
- Preserved edition SHA-256: 9c543435b083a0d0be572eaef2bfe867b6ac16f77a4192cfe476bca0023ce112

The same EditorialMarkdown and storyDisplayMarkdown used by daily Current Affairs
render the approved body. There is no replacement summary, rewritten lesson or generated MCQ.
The approved body already contains the official PIB citation, so it is not repeated.
The existing CurrentAffairsQuiz renders the original question, options, explanation and Exam Edge.
The version pin fails closed if the source version changes; a correction requires review and an
allowlist update, rather than exposing an unreviewed revision.

Read-only canonical verification on 14 October 2026 found CDS_I_2026_GK_099 and
CAPF_2022_P1_125 with content_eligible=true and content_status=UNCHECKED.
Structural eligibility and editorial/AI verification are separate in DP.
Do not describe these records as fully verified content. At runtime the sample queries
v_dp_question_intelligence_v2 and applies isContentEligible; missing, withheld,
structurally invalid or ambiguous IDs are never turned into working links.
Only public link identity is serialized, never the PYQ answer key or learner data.
An anon-role read-only query confirmed the view's private underlying intelligence table
denies guest access. Eligibility uses the existing practice API's server-only service-role
read pattern, restricted to the two allowlisted IDs. No database grants or RLS changes.

The QA fixture is a read-only copy of the published preserved source, with only the sample
story's relational rows. It is test infrastructure, not a runtime content source.
Historical PYQ prompts and users in the HTTP test double are synthetic.

## Practice, navigation and analytics

Reuse the existing MCQ attempt endpoint. Guests can check answers and receive explicit
non-persistence feedback. Signed-in users use existing authenticated, RLS-scoped attempts.
Save failures retain learning feedback and clearly indicate that the answer was not saved.
Sample correctness is client-visible because this is freely accessible public content.
Never reuse that model for protected paid assessments without authoritative server validation.

Linked PYQs use the existing /pyq/[questionId] player. The strictly allowlisted
monthly=2026-10 query parameter retains the sample return destination. The complete
question destination remains in next through login and onboarding. Existing daily return
paths are preserved. Sample preview itself never requires login or onboarding.
The shared shell keeps its closed mobile drawer inert for keyboard/screen-reader users.
Monthly pages use a scoped overflow guard so reading progress remains sticky during
document scrolling. The quiz moves keyboard focus to its answer feedback after checking.

Use trackLearningEvent exclusively for monthly events; no PostHog or second GA integration.
Dimensions include edition, surface, auth state, environment and story/question identity.
Exam is included for linked-question choices. Do not transmit email, learner IDs or tokens.
GA loads only when VERCEL_ENV=production; preview/development retains a local dataLayer
for assertions without submitting acceptance events to production GA.
View events are deduplicated by session; MCQ completion means a checked answer, including
an incorrect answer. Skips use a distinct event. No PDF event is emitted without an asset.
Release information uses monthly_ca_release_availability_viewed, deduplicated by edition.
It does not emit purchase intent. A purchase-intent event is reserved for a future genuine
purchase journey. Product/price details use monthly_ca_product_viewed; opening the working
sample uses monthly_ca_sample_opened. Illustrative planned workspace rows are static, with
only the approved sample chapter linked, and no invented metrics, coverage or PDF artifacts.
Statement questions use an explicit conservative grammar and lossless source slices;
ordinary, Markdown and ambiguous structures keep their original renderer.

## Phase 2 — canonical snapshot and PDF

Create immutable approved edition versions, independent from the changing daily feed.
Each snapshot must record edition ID (YYYY-MM), version ID, source story IDs, their approved
source hashes, exact editorial text, subject/topic/subtopic taxonomy, exam tags, MCQ identities
and approved versions, validated linked PYQ identities and eligibility evidence, source URLs,
source dates and provenance. Deduplicate by canonical story identity and explicit editorial
review; do not automatically summarize or merge text.

Store approval actor/time, release approval, content digest, revision/correction lineage,
reason for change and replacement version. Corrections produce a new immutable approved
version. Preserve prior versions for audit and learners' attempt attribution.
PDF artifacts record snapshot version, artifact ID, checksum, generator version, storage
identity, creation time, accessibility review and release approval.

Both web rendering and PDF generation consume exactly the same approved snapshot.
The PDF generator must support headings, Unicode, citations, readable tables, page breaks,
bookmarks and answer/explanation placement without silent truncation.
Compare text coverage and source hashes; review representative PDF pages before release.
Do not publish source manuscripts or all editions through a public snapshot endpoint.
Separate approved public sample payloads from protected full-edition payloads.

Phase 2 acceptance: deterministic source inclusion, no duplicates, fidelity tests, corrections
versioning, PDF/web agreement, private artifact access, explicit release approval, and a
validated sample PDF before enabling its download CTA and analytics.

## Phase 3 — learner workspace

Build authenticated edition progress, lesson bookmarks, revision queue and monthly assessment
on snapshot identities. Ownership predicates must scope every learner record to auth.uid().
Use stable versioned MCQ identities and idempotent attempt writes; prevent duplicate progress
from retries. Preserve prior progress through corrections with an explicit reconciliation policy.
Validate answers and assessment access server-side; do not trust client scoring or completion.
Expose only the learner's own progress. Keep dashboard/PYQ practice behavior compatible.
Test recovery, retry, cross-user denial, expired sessions and snapshot corrections.

## Phase 4 — ₹79 commerce and delivery

Use a payment-provider sandbox first. Define orders, payment events, entitlements and delivery
records separately. Server chooses ₹79 (7900 paise), INR, approved edition/version and learner;
never accept price or entitlement from the client.
Verify webhook signatures, provider order identity, amount/currency and final payment status.
Idempotent state transitions grant entitlement only after trusted confirmation, with an audit
trail for refunds, reconciliation and manual corrections.

Check entitlement server-side on every protected content/assessment/PDF request; private storage
uses short-lived signed artifact URLs after authorization. Do not embed complete paid content or
answer keys in public pages, client bundles or shared caches. Service-role use stays server-only.
Use RLS ownership rules and explicit admin authorization rather than editable user metadata.
Test duplicate/delayed webhooks, failed/cancelled payments, refunds, replay attempts, cross-user
access and broken delivery. Production payment activation and release require separate approval.
Free daily Current Affairs must remain accessible throughout all phases.
