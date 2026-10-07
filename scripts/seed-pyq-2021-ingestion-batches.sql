-- Seed manifests only. Do not run until 20261007152000_create_pyq_ingestion_v1.sql exists.
-- Official answer-key URLs remain NULL until the UPSC archive artifact is resolved and hashed.

insert into dp_ingest.batches (
  batch_code, exam, year, cycle, paper, expected_question_count,
  source_question_url, source_answer_key_url, source_version, status
)
values
(
  'CAPF_AC_2021_I_GAI',
  'CAPF-AC',
  2021,
  'I',
  'General Ability and Intelligence',
  125,
  'https://www.upsc.gov.in/sites/default/files/GENERAL%20ABILITY%20AND%20INTELLIGENCE_0.pdf',
  null,
  'UPSC_OFFICIAL_QP_2021',
  'CREATED'
),
(
  'CDS_2021_I_GK',
  'CDS',
  2021,
  'I',
  'General Knowledge',
  120,
  'https://www.upsc.gov.in/sites/default/files/CDS-I-21-Gen_Knowledge.pdf',
  null,
  'UPSC_OFFICIAL_QP_2021',
  'CREATED'
),
(
  'CDS_2021_II_GK',
  'CDS',
  2021,
  'II',
  'General Knowledge',
  120,
  'https://www.upsc.gov.in/sites/default/files/QP-GK-CDS-EXAM-II-2021-161121.pdf',
  null,
  'UPSC_OFFICIAL_QP_2021',
  'CREATED'
)
on conflict (batch_code) do nothing;
