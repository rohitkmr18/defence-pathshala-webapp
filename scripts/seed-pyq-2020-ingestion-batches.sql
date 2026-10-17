-- Seed 2020 PYQ ingestion batches.
-- UnlockIAS is retained as TRUSTED_SECONDARY extraction/key provenance only.
-- Learner-facing source references must be normalized before promotion.

insert into dp_ingest.batches (
  batch_code, exam, year, cycle, paper, expected_question_count,
  source_question_url, source_answer_key_url, source_question_sha256,
  source_version, status
)
values
(
  'CAPF_AC_2020_I_GAI',
  'CAPF-AC',
  2020,
  'I',
  'General Ability and Intelligence',
  125,
  'https://www.unlockias.in/capf-2020-general-ability',
  'https://www.unlockias.in/capf-2020-general-ability',
  null,
  'UNLOCKIAS_TRUSTED_SECONDARY_UPSC_ARCHIVE_CORROBORATED_2026-10-09',
  'CREATED'
),
(
  'CDS_2020_I_GK',
  'CDS',
  2020,
  'I',
  'General Knowledge',
  120,
  'https://www.unlockias.in/cds-2020-i-general-knowledge',
  'https://www.unlockias.in/cds-2020-i-general-knowledge',
  null,
  'UNLOCKIAS_TRUSTED_SECONDARY_UPSC_ARCHIVE_CORROBORATED_2026-10-09',
  'CREATED'
),
(
  'CDS_2020_II_GK',
  'CDS',
  2020,
  'II',
  'General Knowledge',
  120,
  'https://www.unlockias.in/cds-2020-ii-general-knowledge',
  'https://www.unlockias.in/cds-2020-ii-general-knowledge',
  null,
  'UNLOCKIAS_TRUSTED_SECONDARY_UPSC_ARCHIVE_CORROBORATED_2026-10-09',
  'CREATED'
)
on conflict (batch_code) do nothing;
