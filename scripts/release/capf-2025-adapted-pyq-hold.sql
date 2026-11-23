-- CAPF 2025 Paper I adapted Q62/Q98/Q108: guarded data-only release.
-- Must be reviewed and manually executed on the intended project ONLY.
-- Does not alter answers, text, identifiers, historical attempts or any other exam.
-- Staging rehearsal completed on pxfstrzceyxnweeaydvz on 2026-11-23.
-- DO NOT EXECUTE IN PRODUCTION WITHOUT EXPLICIT RELEASE APPROVAL.
BEGIN;
DO $hold$
DECLARE
  n integer;
  already_held integer;
BEGIN
  SELECT COUNT(*), COUNT(*) FILTER (WHERE content_status = 'WITHHELD')
  INTO n, already_held
  FROM public.questions
  WHERE question_id IN ('CAPF_2025_P1_062','CAPF_2025_P1_098','CAPF_2025_P1_108')
    AND exam = 'CAPF-AC' AND year = 2025 AND cycle = 'I' AND paper = 'Paper I'
    AND is_active IS TRUE AND verified_status = 'Verified' AND final_opt = 'C'
    AND content_status IN ('UNCHECKED','WITHHELD');

  IF n <> 3 OR already_held NOT IN (0,3) THEN
    RAISE EXCEPTION 'Content hold aborted: expected three matching records in a uniform original/withheld state; found %, held %', n, already_held;
  END IF;

  IF already_held = 0 THEN
    UPDATE public.questions SET content_status = 'WITHHELD'
    WHERE question_id IN ('CAPF_2025_P1_062','CAPF_2025_P1_098','CAPF_2025_P1_108')
      AND exam = 'CAPF-AC' AND year = 2025 AND cycle = 'I' AND paper = 'Paper I'
      AND is_active IS TRUE AND verified_status = 'Verified'
      AND content_status = 'UNCHECKED' AND final_opt = 'C';
    GET DIAGNOSTICS n = ROW_COUNT;
    IF n <> 3 THEN RAISE EXCEPTION 'Content hold aborted: modified % rows instead of 3', n; END IF;
  END IF;

  SELECT COUNT(*) INTO n FROM public.v_dp_question_intelligence_v2
  WHERE question_id IN ('CAPF_2025_P1_062','CAPF_2025_P1_098','CAPF_2025_P1_108')
    AND content_eligible IS FALSE;
  IF n <> 3 THEN RAISE EXCEPTION 'Content hold eligibility postcondition failed: % rows', n; END IF;
END $hold$;
COMMIT;

-- Verification (run separately): the three item IDs must remain present but
-- report content_eligible=false. Expected CAPF-AC 2025 eligible count: 122.
-- IMPORTANT: this is a reversible temporary hold, not a migration to an
-- adapted-question product. Do not release them again without independent QA.
