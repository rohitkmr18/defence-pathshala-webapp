create table if not exists public.dp_pyq_v1_production_release (
  question_id text primary key references public.questions(question_id) on delete cascade,
  release_version text not null,
  production_eligible boolean not null default false,
  intelligence_eligible boolean not null default false,
  human_review_required boolean not null default true,
  promoted_at timestamptz not null default now(),
  constraint dp_pyq_v1_production_release_version_check
    check (release_version = 'DP_PYQ_CORPUS_v1')
);

create index if not exists idx_dp_pyq_v1_production_release_intelligence
  on public.dp_pyq_v1_production_release (intelligence_eligible);

create index if not exists idx_dp_pyq_v1_production_release_review
  on public.dp_pyq_v1_production_release (human_review_required);

alter table public.dp_pyq_v1_production_release enable row level security;
revoke all on public.dp_pyq_v1_production_release from anon, authenticated;

comment on table public.dp_pyq_v1_production_release is
'Materialized production promotion contract for DP_PYQ_CORPUS_v1. Eligibility is promoted from the frozen intelligence-lab release; application code must not recompute release eligibility.';
