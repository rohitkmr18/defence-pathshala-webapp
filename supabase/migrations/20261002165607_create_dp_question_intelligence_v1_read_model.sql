
create table if not exists public.dp_question_intelligence_v1 (
  question_id text primary key references public.questions(question_id) on delete cascade,
  taxonomy_subject text not null,
  taxonomy_topic text not null,
  taxonomy_subtopic text not null,
  taxonomy_concept text not null,
  competency_id text not null,
  pattern_id text not null,
  source_id text not null,
  temporal_context_id text not null,
  expected_knowledge numeric,
  source_accessibility numeric,
  preparation_accessibility numeric,
  cognitive_complexity numeric,
  esac_score numeric,
  difficulty_score numeric,
  difficulty_category text not null check (difficulty_category in ('Easy','Moderate','Hard')),
  relation_degree bigint not null default 0,
  same_concept_degree bigint not null default 0,
  cross_exam_variant_degree bigint not null default 0,
  conceptual_variant_degree bigint not null default 0,
  intelligence_readiness text,
  requires_content_review boolean not null default false,
  release_eligible boolean not null default false,
  production_eligible boolean not null default true,
  intelligence_eligible boolean not null default false,
  human_review_required boolean not null default true,
  release_version text not null default 'DP_PYQ_CORPUS_v1',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_dp_qi_v1_subject on public.dp_question_intelligence_v1(taxonomy_subject);
create index if not exists idx_dp_qi_v1_topic on public.dp_question_intelligence_v1(taxonomy_subject, taxonomy_topic);
create index if not exists idx_dp_qi_v1_subtopic on public.dp_question_intelligence_v1(taxonomy_subject, taxonomy_topic, taxonomy_subtopic);
create index if not exists idx_dp_qi_v1_competency on public.dp_question_intelligence_v1(competency_id);
create index if not exists idx_dp_qi_v1_pattern on public.dp_question_intelligence_v1(pattern_id);
create index if not exists idx_dp_qi_v1_source on public.dp_question_intelligence_v1(source_id);
create index if not exists idx_dp_qi_v1_temporal on public.dp_question_intelligence_v1(temporal_context_id);
create index if not exists idx_dp_qi_v1_intelligence_eligible on public.dp_question_intelligence_v1(intelligence_eligible);
create index if not exists idx_dp_qi_v1_exam_filters on public.dp_question_intelligence_v1(question_id, difficulty_category);

alter table public.dp_question_intelligence_v1 enable row level security;
revoke all on public.dp_question_intelligence_v1 from anon, authenticated;
grant select, insert, update, delete on public.dp_question_intelligence_v1 to service_role;

comment on table public.dp_question_intelligence_v1 is
'Production snapshot of DP_PYQ_CORPUS_v1 intelligence. Intelligence Lab is the derivation factory; this table is the production read model. Eligibility flags are imported from the frozen release and must not be recomputed independently in application code.';

