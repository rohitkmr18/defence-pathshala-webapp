# CAPF AC 2025 — adapted official-PYQ containment (staging rehearsal)

## Defect and source
Issue [#202](https://github.com/rohitkmr18/defence-pathshala-webapp/issues/202) records three **modified** questions in a corpus presented as authentic UPSC PYQs:

| Item | UPSC Series A key | DP recorded answer | DP modifications |
|---|---|---|---|
| Q62 | A | C | Added “of correct time” to the clock question |
| Q98 | X (officially dropped) | C | Replaced one chemistry statement with a new one |
| Q108 | A | C | Rewrote the hysteresis answer option C |

UPSC key: https://www.upsc.gov.in/uploads/2026/08/AnsKey-CAPFACs-Exam-2025-GAI-110826.pdf

**Crucial**: Do not force DP `final_opt` to UPSC letters. The DP wording/options were modified. These are valid candidates for a future *adapted practice* area, but cannot be counted as verbatim official PYQs without explicit labeling and separation. Full booklet visual inspection of original source PDF is still a review gate.

## Safest immediate containment
Existing `public.dp_content_is_eligible(..., content_status)` refuses `WITHHELD`; the v2 view exposes `content_eligible=false`. Existing SEO pages, practice questions/count endpoints and question-bank metadata use this eligibility flag. No new schema or source-key replacement is necessary for an **interim hold**.

Use the guarded file `scripts/release/capf-2025-adapted-pyq-hold.sql` only after authorization for the exact target environment. It requires three exact question IDs and matching exam, year, cycle, paper, `Verified` status, original answer `C`, and uniform `UNCHECKED` or already `WITHHELD` status; it raises an exception on unexpected records and is safe to rerun. It does NOT delete questions or rewrite answers/attempts.

### Staging execution and verified result (23 Nov 2026)
- **Target** `pxfstrzceyxnweeaydvz` (staging, not production).
- Before: all 3 target records `UNCHECKED` and eligible; CAPF 2025 eligible Paper I count **125**.
- Performed a transaction with exact-ID and field guards, `content_status = 'WITHHELD'` on those 3 rows.
- After: 3 remain in the database, all report `content_eligible=false` in `v_dp_question_intelligence_v2`; eligible count **122**.
- Existing staging `content_version`, `final_opt` and `official_opt` preserved.
- Independent production read: all three remain `UNCHECKED` and eligible; production count **125**. **No production changes.**
- Staging had **0** historical `user_attempts` referencing those three IDs in the read-only preflight; production previously had **1** attempt on Q62. Treat those separately.

### Verification after a later authorized production release
```sql
select question_id, content_status, content_eligible, content_version, final_opt, official_opt
from public.v_dp_question_intelligence_v2
where question_id in ('CAPF_2025_P1_062','CAPF_2025_P1_098','CAPF_2025_P1_108')
order by question_id;

select count(*) as eligible_2025_paper_i
from public.v_dp_question_intelligence_v2
where exam='CAPF-AC' and year=2025 and paper='Paper I' and content_eligible;
```

Acceptance requires 3 records with `content_eligible=false`, count **122** *if source inventory has not otherwise changed*, and preserved historical attempts. Check the exact-item practice API returns a content-unavailable response for a signed-in session; verify targeted practice and archive pages exclude the 3 items. Existing `isCompletePaper` must **fail closed** on the 122-question corpus; do not label it a complete official paper.

### Risks and next gated package
1. **Source sync or import** might reset `content_status` or re-upsert edited rows; test scheduled imports and persistence, and add a permanent provenance field/classification before reintroducing adapted content.
2. Existing `PAPER_CONTENT_MANIFESTS` for CAPF 2025 already excludes 98/106/108/113 from full-paper completeness. Do not weaken it to accommodate adapted items. Need separate full-paper editorial reconciliation.
3. Historical attempt data must remain immutable. Production has 1 prior Q62 attempt and 1 session containing Q62, plus 1 session containing Q98 (from aggregate read). Monitor reconciliation and avoid silent rescores.
4. Server-rendered SEO metadata caches may take up to 3600 seconds to reflect data-only content holds; verify after cache expiration/revalidation.
5. Do not present all `verified_status='Verified'` rows as officially reconciled until editorial checks substantiate them.

## Rollback / recovery
**No automated rollback to public eligibility.** If a release is rolled back, preserve the `WITHHELD` status while authenticity remains unresolved. An authorized editor may separately restore prior `content_status='UNCHECKED'` after a signed-off source decision and impact review. Never wipe historical attempts or swap answer letters to satisfy the official key.

## Release boundary
PR contains a manual data-release SQL script, regression tests and documentation only. It **does not apply the script to production**. Production execution requires a new explicit founder approval after review of the exact source, scope, impact and staging results.
