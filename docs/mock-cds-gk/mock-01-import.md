# CDS GK Mock 01 staging import

Run from the repository root with Python 3.11 and the pinned openpyxl dependency in backend/requirements.txt. Keep the workbook, approvals, and generated payloads outside source control and deployment bundles.

```sh
python scripts/import_cds_gk_m01.py /private/path/to/workbook.xlsx
python scripts/import_cds_gk_m01.py /private/path/to/workbook.xlsx --rehearse
python scripts/test_cds_gk_m01_staging.py
```

The default command audits locally. The latter two commands require a staging-authorized Supabase Management API access token in SUPABASE_ACCESS_TOKEN and target only project pxfstrzceyxnweeaydvz. The rehearsal verifies the exact workbook against the existing staging schema, then rolls back. The smoke test uses synthetic content and rolls back its draft, learner attempt, and result.

For workbook revisions outside the recorded publisher decision, update the workbook checklist to Passed for gates 1–6 and 9 after editorial review. Fill the blind-solve tab with the resolved answers and confidence, re-audit the workbook, and record named review and evidence for the exact resulting digest in a private JSON file. Required evidence keys are blind_solve, fact_check, parent_provenance, current_affairs, duplicates, blueprint, and founder_approval.

```sh
python scripts/import_cds_gk_m01.py /private/path/to/workbook.xlsx --stage-draft /private/path/to/approval.json
```

The approval object requires workbook_sha256, reviewer, and gate_evidence. Gate evidence entries are references to the records the reviewer has checked. The workbook digest binds those records to the audited revision. The CLI checks the supplied evidence fields, with editorial decisions owned by the named reviewer.

For the exact original workbook covered by [the publisher decision](../../scripts/cds_gk_m01_publisher_approval.json), the checked-in record supplies founder approval and records the three exceptions as accepted. Keep the workbook bytes intact. A private approval file still requires the exact workbook_sha256, a named reviewer, and gate_evidence references for blind_solve, fact_check, parent_provenance, current_affairs, duplicates, and blueprint. Supply resolved_blind_solve as 120 records in paper order, each with an integer position, reconciled A–D answer, and integer confidence from 1 to 5. Attach the original independent blind-solve and any reconciliations to the review record. The importer checks completeness and key alignment. The named reviewer verifies the underlying evidence and records explicitly accepted exceptions in the fact-check sign-off.

The import creates CDS-GK-M01-V1 as DRAFT in a single transaction. The assignment trigger requires APPROVED question rows, so the importer writes them only after the editorial gate or inside a rolled-back rehearsal. The published catalogue excludes drafts. The SQL compares all persisted fields and assignments in workbook order. An exact retry preserves IDs and performs no data writes. Conflicts, changed content, and already published tests require operator review.

The importer does not publish. The existing database publication trigger checks the assigned, approved, contiguous 120-question set and the subject blueprint. Keep Mock 01 in draft until authorized staging learner QA and release review are complete. Use the staging demo to exercise authenticated navigation, autosave, resume, submit, and post-submit result review while Mock 01 is held.
