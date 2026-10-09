-- Seed manifests only. Do not run until 20261007152000_create_pyq_ingestion_v1.sql exists.
-- Official answer-key URLs remain NULL until the UPSC archive artifact is resolved and hashed.

insert into dp_ingest.batches (
  batch_code, exam, year, cycle, paper, expected_question_count,
  source_question_url, source_answer_key_url, source_question_sha256,
  source_version, status
)
values
(
  'CAPF_AC_2021_I_GAI',
  'CAPF-AC',
  2021,
  'I',
  'General Ability and Intelligence',
  125,
  'https://www.unlockias.in/capf-2021-general-ability',
  'https://www.unlockias.in/capf-2021-general-ability',
  '3751053c5b4ef4473fa45533f7c9b0e6e99975c89fa4f8ac459c15b71cc7e9ab',
  'UNLOCKIAS_TRUSTED_SECONDARY_UPSC_PDF_CORROBORATED_2026-10-08',
  'CREATED'
),
(
  'CDS_2021_I_GK',
  'CDS',
  2021,
  'I',
  'General Knowledge',
  120,
  'https://www.unlockias.in/cds-2021-i-general-knowledge',
  'https://www.unlockias.in/cds-2021-i-general-knowledge',
  null,
  'UNLOCKIAS_TRUSTED_SECONDARY_2026-10-08',
  'CREATED'
),
(
  'CDS_2021_II_GK',
  'CDS',
  2021,
  'II',
  'General Knowledge',
  120,
  'https://www.unlockias.in/cds-2021-ii-general-knowledge',
  'https://www.unlockias.in/cds-2021-ii-general-knowledge',
  null,
  'UNLOCKIAS_TRUSTED_SECONDARY_2026-10-08',
  'CREATED'
)
on conflict (batch_code) do nothing;
