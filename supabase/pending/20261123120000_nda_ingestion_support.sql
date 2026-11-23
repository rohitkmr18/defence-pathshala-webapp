-- NDA ingestion support (PENDING, not applied to any environment).
-- 1) Allow exam 'NDA' in dp_ingest.batches. promote_batches() and the validation views
--    are exam-agnostic; the only exam-specific object is this CHECK constraint.
-- 2) Registry rows for nda-maths / nda-gat and their sections already exist in
--    public.exam_papers / exam_sections (status coming_soon), so no registry change here.
-- 3) PATTERN.LINKED_SET already exists in dp_pattern_dictionary.
-- Apply to staging first; production only with founder approval.
begin;
alter table dp_ingest.batches drop constraint batches_exam_check;
alter table dp_ingest.batches add constraint batches_exam_check
  check (exam = any (array['CDS'::text, 'CAPF-AC'::text, 'NDA'::text]));
commit;

-- AFTER promote_batches() for an NDA GK release, set the registry ids
-- (promote_batches does not set paper_id/section_id; same pattern as the 20261105 backfill):
--   select set_config('dp.content_evidence','NDA GK registry ids after promotion',true);
--   update public.questions set paper_id='nda-gat', section_id='nda-gat:gk'
--    where exam='NDA' and paper='General Ability Test' and paper_id is null
--      and question_id like '%\_GK\_%';
-- The paper stays coming_soon in public.exam_papers until the founder flips it to live.
