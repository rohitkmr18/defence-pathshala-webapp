alter table public.dp_question_intelligence_v1
add column if not exists intelligence_confidence text not null default 'MODEL_DERIVED',
add column if not exists intelligence_verified boolean not null default false,
add column if not exists human_review_required boolean not null default true;

create index if not exists idx_dp_qi_v1_review on public.dp_question_intelligence_v1(human_review_required, intelligence_verified);

comment on column public.dp_question_intelligence_v1.intelligence_confidence is
'Provenance state of derived intelligence. MODEL_DERIVED means generated from the frozen structured release but not independently human-verified.';
comment on column public.dp_question_intelligence_v1.intelligence_verified is
'Whether the intelligence fields have passed human verification. This is distinct from intelligence eligibility.';
