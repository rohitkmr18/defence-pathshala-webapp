# Batch 3B: Original PYQ evidence matrix — design and acceptance

## Goal
Add source-limited, machine-readable **visible HTML** to the existing indexed CDS and CAPF PYQ hubs. Original evidence from the eligible question dataset is more valuable than adding speculative FAQ schema.

## Source of truth
Existing `getExamCoverage` and `getYearCoverage` derive counts from `v_dp_question_intelligence_v2` with `content_eligible=true` and existing General Knowledge / Paper I paper filters. Both functions use the existing cached metadata loader and no new private data or endpoints.

## Scope
- Server-rendered, accessible table on `/pyqs/cds` and `/pyqs/capf`, with the five largest subject groups and their counts in each eligible examination year.
- Each year and subject header links to an existing archive.
- Show the actual database eligible total and year count.
- State that zero represents absent **eligible inventory**, not zero official paper questions.
- Display only evidence, no guesses about future question frequencies.
- No database migrations, client-side exposure of private columns, schema inflation, metadata, canonical or redirect changes.

## Acceptance
- Unit/CI and SEO browser acceptance green, including synthetic 2026 history fixture.
- Visually inspect 320px and desktop overflow; the table has horizontal scroll and a caption.
- The main total is the denominator for the eligible corpus, not official paper count.
- Preview must be READY. No merge or prod update without explicit approval.

## Next stages, not in this PR
- Substantive concept explanations linked to verified questions and official source documents.
- Independently measure AI-answer mentions and URL citations; no claims of GEO impact from schema alone.
