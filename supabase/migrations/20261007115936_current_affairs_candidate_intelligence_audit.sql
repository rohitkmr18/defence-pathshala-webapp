
create table if not exists public.current_affairs_candidates (
  id uuid primary key default gen_random_uuid(),
  edition_date date not null,
  discovered_at timestamptz not null default now(),
  source_date timestamptz,
  headline text not null,
  canonical_event text not null,
  source_name text not null,
  source_url text not null,
  source_tier smallint not null check (source_tier between 1 and 3),
  underlying_actor text,
  underlying_action text,
  event_location text,
  substantive_change text,
  subject text,
  topic text,
  subtopic text,
  concept text,
  knowledge_object text,
  temporal_type text check (temporal_type is null or temporal_type in ('CURRENT_DEVELOPMENT','STATIC_CURRENT_LINK','CURRENT_EVENT')),
  likely_pyq_patterns text[] not null default '{}',
  closest_pyq_ids text[] not null default '{}',
  closest_pyq_evidence jsonb not null default '[]'::jsonb check (jsonb_typeof(closest_pyq_evidence) = 'array'),
  pyq_likelihood_score smallint not null default 0 check (pyq_likelihood_score between 0 and 30),
  static_current_score smallint not null default 0 check (static_current_score between 0 and 20),
  question_yield_score smallint not null default 0 check (question_yield_score between 0 and 20),
  cross_exam_score smallint not null default 0 check (cross_exam_score between 0 and 10),
  factual_density_score smallint not null default 0 check (factual_density_score between 0 and 8),
  novelty_score smallint not null default 0 check (novelty_score between 0 and 5),
  defence_bonus_score smallint not null default 0 check (defence_bonus_score between 0 and 5),
  significance_score smallint not null default 0 check (significance_score between 0 and 2),
  base_score smallint generated always as (
    pyq_likelihood_score + static_current_score + question_yield_score + cross_exam_score +
    factual_density_score + novelty_score + defence_bonus_score + significance_score
  ) stored,
  penalty_score smallint not null default 0 check (penalty_score between -46 and 0),
  final_score smallint generated always as (
    greatest(0, least(100,
      pyq_likelihood_score + static_current_score + question_yield_score + cross_exam_score +
      factual_density_score + novelty_score + defence_bonus_score + significance_score + penalty_score
    ))
  ) stored,
  score_breakdown jsonb not null default '{}'::jsonb check (jsonb_typeof(score_breakdown) = 'object'),
  penalties jsonb not null default '[]'::jsonb check (jsonb_typeof(penalties) = 'array'),
  hard_gate_source boolean not null default false,
  hard_gate_substantive_change boolean not null default false,
  hard_gate_syllabus_bridge boolean not null default false,
  hard_gate_questionability boolean not null default false,
  hard_gate_distinctive boolean not null default false,
  hard_gate_knowledge_value boolean not null default false,
  hard_gates_passed boolean generated always as (
    hard_gate_source and hard_gate_substantive_change and hard_gate_syllabus_bridge and
    hard_gate_questionability and hard_gate_distinctive and hard_gate_knowledge_value
  ) stored,
  decision text not null default 'review_required'
    check (decision in ('selected','reserve','rejected','review_required')),
  decision_reason text,
  rejection_reason text,
  selection_rank integer check (selection_rank is null or selection_rank > 0),
  confidence text not null default 'MEDIUM' check (confidence in ('HIGH','MEDIUM','LOW')),
  mcq_ready boolean not null default false,
  published_story_id uuid references public.current_affairs_stories(id) on delete set null,
  content_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (edition_date, content_hash)
);

create index if not exists current_affairs_candidates_edition_decision_idx
  on public.current_affairs_candidates (edition_date desc, decision, final_score desc);

create index if not exists current_affairs_candidates_taxonomy_idx
  on public.current_affairs_candidates (subject, topic, subtopic);

create index if not exists current_affairs_candidates_score_idx
  on public.current_affairs_candidates (final_score desc, edition_date desc);

alter table public.current_affairs_candidates enable row level security;

grant select, insert, update, delete on public.current_affairs_candidates to authenticated;

drop policy if exists "current affairs candidates admin access" on public.current_affairs_candidates;
create policy "current affairs candidates admin access"
on public.current_affairs_candidates
for all
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

comment on table public.current_affairs_candidates is
'Internal editorial audit log for Defence Pathshala current-affairs discovery, PYQ-based scoring, selection/rejection and later precision analysis. Not learner-facing.';
