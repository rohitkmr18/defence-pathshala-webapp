-- Allow a dp_ingest batch to cover a section of a paper that does not start at Q1
-- (e.g. NDA GAT Part B, General Knowledge = Q51-150). Default 1 keeps every existing batch unchanged.
-- The release gate still requires a contiguous, duplicate-free run of exactly expected_question_count
-- questions: first_question_number .. first_question_number + expected_question_count - 1.
alter table dp_ingest.batches
  add column if not exists first_question_number integer not null default 1;
alter table dp_ingest.batches
  drop constraint if exists batches_first_question_number_check;
alter table dp_ingest.batches
  add constraint batches_first_question_number_check check (first_question_number >= 1);

create or replace view dp_ingest.v_batch_validation as
 SELECT b.id AS batch_id,
    b.batch_code,
    b.exam,
    b.year,
    b.cycle,
    b.paper,
    b.expected_question_count,
    count(r.id)::integer AS extracted_rows,
    count(*) FILTER (WHERE r.release_disposition = 'INCLUDE'::text)::integer AS included_rows,
    count(*) FILTER (WHERE r.release_disposition = 'DROP'::text)::integer AS dropped_rows,
    count(*) FILTER (WHERE r.release_disposition = 'INCLUDE'::text AND v.release_eligible)::integer AS release_eligible_rows,
    count(*) FILTER (WHERE r.release_disposition = 'INCLUDE'::text AND NOT v.release_eligible)::integer AS blocked_rows,
    array_remove(ARRAY[
        CASE WHEN count(r.id) <> b.expected_question_count THEN 'QUESTION_COUNT_MISMATCH'::text ELSE NULL::text END,
        CASE WHEN count(r.id) <> count(DISTINCT r.q_num) THEN 'DUPLICATE_QUESTION_NUMBER'::text ELSE NULL::text END,
        CASE WHEN min(r.q_num) IS DISTINCT FROM b.first_question_number THEN 'QUESTION_NUMBER_DOES_NOT_START_AT_1'::text ELSE NULL::text END,
        CASE WHEN max(r.q_num) IS DISTINCT FROM (b.first_question_number + b.expected_question_count - 1) THEN 'QUESTION_NUMBER_RANGE_MISMATCH'::text ELSE NULL::text END,
        CASE WHEN count(*) FILTER (WHERE r.release_disposition = 'DROP'::text AND COALESCE(btrim(r.drop_reason), ''::text) = ''::text) > 0 THEN 'DROP_REASON_MISSING'::text ELSE NULL::text END
    ], NULL::text) AS batch_issues,
    count(r.id) = b.expected_question_count
      AND count(r.id) = count(DISTINCT r.q_num)
      AND min(r.q_num) = b.first_question_number
      AND max(r.q_num) = (b.first_question_number + b.expected_question_count - 1)
      AND count(*) FILTER (WHERE r.release_disposition = 'INCLUDE'::text AND NOT v.release_eligible) = 0
      AND count(*) FILTER (WHERE r.release_disposition = 'DROP'::text AND COALESCE(btrim(r.drop_reason), ''::text) = ''::text) = 0 AS release_ready,
    b.first_question_number
   FROM dp_ingest.batches b
     LEFT JOIN dp_ingest.rows r ON r.batch_id = b.id
     LEFT JOIN dp_ingest.v_row_validation v ON v.id = r.id
  GROUP BY b.id, b.batch_code, b.exam, b.year, b.cycle, b.paper, b.expected_question_count, b.first_question_number;

-- Note: issue code QUESTION_NUMBER_DOES_NOT_START_AT_1 is kept for compatibility; it now means
-- "does not start at the batch's first_question_number".
