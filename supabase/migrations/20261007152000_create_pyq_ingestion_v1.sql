begin;

create schema if not exists dp_ingest;
revoke all on schema dp_ingest from public, anon, authenticated;
grant usage on schema dp_ingest to service_role;

create table if not exists dp_ingest.batches (
  id uuid primary key default gen_random_uuid(),
  batch_code text not null unique,
  exam text not null check (exam in ('CDS','CAPF-AC')),
  year integer not null check (year between 2000 and 2100),
  cycle text not null,
  paper text not null,
  expected_question_count integer not null check (expected_question_count > 0),
  source_question_url text not null,
  source_answer_key_url text,
  source_question_sha256 text,
  source_answer_key_sha256 text,
  source_version text not null,
  extraction_prompt_version text,
  taxonomy_prompt_version text,
  intelligence_prompt_version text,
  extraction_model text,
  taxonomy_model text,
  intelligence_model text,
  status text not null default 'CREATED'
    check (status in (
      'CREATED','EXTRACTED','NORMALIZED','KEYED','TAXONOMIZED',
      'ENRICHED','VALIDATED','RELEASE_READY','PROMOTED','BLOCKED'
    )),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists dp_ingest.rows (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references dp_ingest.batches(id) on delete cascade,
  q_num integer not null check (q_num > 0),

  source_page integer check (source_page is null or source_page > 0),
  source_fragment text,
  raw_question text,
  raw_opt_a text,
  raw_opt_b text,
  raw_opt_c text,
  raw_opt_d text,
  extraction_confidence numeric(5,4) check (
    extraction_confidence is null or extraction_confidence between 0 and 1
  ),
  extraction_flags text[] not null default '{}',

  question_id text,
  question text,
  opt_a text,
  opt_b text,
  opt_c text,
  opt_d text,
  content_hash text,

  official_opt text check (official_opt is null or official_opt in ('A','B','C','D','X')),
  llm_opt text check (llm_opt is null or llm_opt in ('A','B','C','D')),
  final_opt text check (final_opt is null or final_opt in ('A','B','C','D')),
  key_discrepancy boolean not null default false,

  subject text,
  topic text,
  subtopic text,
  theme text,
  q_type text,
  q_pattern text,
  pattern_id text references public.dp_pattern_dictionary(pattern_id),
  explanation text,
  source text,
  is_negative boolean,
  tags text[] not null default '{}',
  static_current_link text,
  difficulty_score numeric check (
    difficulty_score is null or difficulty_score between 0 and 100
  ),
  difficulty_category text check (
    difficulty_category is null or difficulty_category in ('Easy','Moderate','Hard')
  ),

  source_fidelity_confidence numeric(5,4) check (
    source_fidelity_confidence is null or source_fidelity_confidence between 0 and 1
  ),
  taxonomy_confidence numeric(5,4) check (
    taxonomy_confidence is null or taxonomy_confidence between 0 and 1
  ),
  intelligence_confidence numeric(5,4) check (
    intelligence_confidence is null or intelligence_confidence between 0 and 1
  ),

  taxonomy_new_node_candidate jsonb,
  model_audit jsonb not null default '{}'::jsonb,
  validation_issues text[] not null default '{}',
  review_required boolean not null default true,
  row_status text not null default 'EXTRACTED'
    check (row_status in (
      'EXTRACTED','NORMALIZED','KEYED','TAXONOMIZED',
      'ENRICHED','VALIDATED','RELEASE_READY','PROMOTED','BLOCKED'
    )),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (batch_id, q_num)
);

create index if not exists idx_dp_ingest_rows_batch_status
  on dp_ingest.rows(batch_id, row_status);
create index if not exists idx_dp_ingest_rows_question_id
  on dp_ingest.rows(question_id);
create index if not exists idx_dp_ingest_rows_content_hash
  on dp_ingest.rows(content_hash);
create index if not exists idx_dp_ingest_rows_review
  on dp_ingest.rows(batch_id, review_required);

alter table dp_ingest.batches enable row level security;
alter table dp_ingest.rows enable row level security;

revoke all on dp_ingest.batches, dp_ingest.rows from public, anon, authenticated;
grant select, insert, update, delete on dp_ingest.batches, dp_ingest.rows to service_role;

create or replace view dp_ingest.v_row_validation
with (security_invoker = true) as
with base as (
  select
    r.*,
    b.exam,
    b.year,
    b.cycle,
    b.paper,
    b.expected_question_count,
    array_remove(array[
      case when coalesce(trim(r.raw_question),'') = '' then 'MISSING_RAW_QUESTION' end,
      case when exists (
        select 1 from unnest(array[r.raw_opt_a,r.raw_opt_b,r.raw_opt_c,r.raw_opt_d]) x
        where coalesce(trim(x),'') = ''
      ) then 'MISSING_RAW_OPTION' end,
      case when coalesce(trim(r.question),'') = '' then 'MISSING_CANONICAL_QUESTION' end,
      case when exists (
        select 1 from unnest(array[r.opt_a,r.opt_b,r.opt_c,r.opt_d]) x
        where coalesce(trim(x),'') = ''
      ) then 'MISSING_CANONICAL_OPTION' end,
      case when r.final_opt not in ('A','B','C','D') then 'INVALID_FINAL_ANSWER' end,
      case when r.official_opt not in ('A','B','C','D') then 'OFFICIAL_KEY_NOT_RECONCILED' end,
      case when r.key_discrepancy then 'ANSWER_KEY_DISCREPANCY' end,
      case when coalesce(trim(r.subject),'') = ''
             or coalesce(trim(r.topic),'') = ''
             or coalesce(trim(r.subtopic),'') = ''
        then 'MISSING_TAXONOMY' end,
      case when r.pattern_id is null
             or not exists (
               select 1
               from public.dp_pattern_dictionary p
               where p.pattern_id = r.pattern_id and p.active
             )
        then 'INVALID_PATTERN' end,
      case when r.difficulty_score is null then 'MISSING_DIFFICULTY' end,
      case when r.difficulty_score is not null
             and r.difficulty_category is distinct from
               case
                 when r.difficulty_score <= 20 then 'Easy'
                 when r.difficulty_score <= 50 then 'Moderate'
                 else 'Hard'
               end
        then 'DIFFICULTY_CATEGORY_MISMATCH' end,
      case when r.extraction_confidence is null or r.extraction_confidence < 0.98
        then 'LOW_EXTRACTION_CONFIDENCE' end,
      case when r.source_fidelity_confidence is null or r.source_fidelity_confidence < 0.98
        then 'LOW_SOURCE_FIDELITY_CONFIDENCE' end,
      case when r.taxonomy_confidence is null or r.taxonomy_confidence < 0.85
        then 'LOW_TAXONOMY_CONFIDENCE' end,
      case when r.intelligence_confidence is null or r.intelligence_confidence < 0.80
        then 'LOW_INTELLIGENCE_CONFIDENCE' end,
      case when cardinality(r.extraction_flags) > 0 then 'EXTRACTION_FLAGGED' end,
      case when r.taxonomy_new_node_candidate is not null then 'NEW_TAXONOMY_NODE_PROPOSED' end,
      case when r.content_hash is not null and exists (
        select 1 from public.questions q
        where q.content_hash = r.content_hash
      ) then 'DUPLICATE_PRODUCTION_CONTENT_HASH' end,
      case when r.question_id is not null and exists (
        select 1 from public.questions q
        where q.question_id = r.question_id
      ) then 'DUPLICATE_PRODUCTION_QUESTION_ID' end
    ], null) as computed_issues
  from dp_ingest.rows r
  join dp_ingest.batches b on b.id = r.batch_id
)
select
  base.*,
  array(
    select distinct issue
    from unnest(base.validation_issues || base.computed_issues) issue
    where issue is not null
    order by issue
  ) as all_validation_issues,
  cardinality(array(
    select distinct issue
    from unnest(base.validation_issues || base.computed_issues) issue
    where issue is not null
  )) = 0 as release_eligible
from base;

create or replace view dp_ingest.v_batch_validation
with (security_invoker = true) as
select
  b.id as batch_id,
  b.batch_code,
  b.exam,
  b.year,
  b.cycle,
  b.paper,
  b.expected_question_count,
  count(r.id)::integer as extracted_rows,
  count(*) filter (where v.release_eligible)::integer as release_eligible_rows,
  count(*) filter (where not v.release_eligible)::integer as blocked_rows,
  array_remove(array[
    case when count(r.id) <> b.expected_question_count then 'QUESTION_COUNT_MISMATCH' end,
    case when count(r.id) <> count(distinct r.q_num) then 'DUPLICATE_QUESTION_NUMBER' end,
    case when min(r.q_num) is distinct from 1 then 'QUESTION_NUMBER_DOES_NOT_START_AT_1' end,
    case when max(r.q_num) is distinct from b.expected_question_count then 'QUESTION_NUMBER_RANGE_MISMATCH' end
  ], null) as batch_issues,
  (
    count(r.id) = b.expected_question_count
    and count(r.id) = count(distinct r.q_num)
    and min(r.q_num) = 1
    and max(r.q_num) = b.expected_question_count
    and count(*) filter (where not v.release_eligible) = 0
  ) as release_ready
from dp_ingest.batches b
left join dp_ingest.rows r on r.batch_id = b.id
left join dp_ingest.v_row_validation v on v.id = r.id
group by b.id, b.batch_code, b.exam, b.year, b.cycle, b.paper, b.expected_question_count;

revoke all on dp_ingest.v_row_validation, dp_ingest.v_batch_validation
  from public, anon, authenticated;
grant select on dp_ingest.v_row_validation, dp_ingest.v_batch_validation
  to service_role;

comment on schema dp_ingest is
'Private Defence Pathshala PYQ ingestion workspace. Raw AI output never writes directly to learner-facing production tables.';

comment on table dp_ingest.batches is
'One authoritative source-paper ingestion run with source provenance, model/prompt versions and release state.';

comment on table dp_ingest.rows is
'Raw extraction plus canonical normalized/enriched candidate row. Production promotion occurs only after deterministic validation.';

comment on view dp_ingest.v_row_validation is
'Deterministic row-level release gate for PYQ ingestion. AI confidence can route review but cannot bypass source/key/schema checks.';

comment on view dp_ingest.v_batch_validation is
'Batch-level release gate enforcing expected paper completeness and zero blocked rows before promotion.';

commit;
