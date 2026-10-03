
create table if not exists public.dp_pattern_dictionary (
  pattern_id text primary key,
  display_label text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.dp_pattern_dictionary (pattern_id, display_label)
values
  ('PATTERN.DIRECT', 'Single MCQ'),
  ('PATTERN.STATEMENT.2', '2-Statement Combination'),
  ('PATTERN.STATEMENT.3', '3-Statement Combination'),
  ('PATTERN.STATEMENT.4', '4-Statement Combination'),
  ('PATTERN.MATCHING', 'Match the Following'),
  ('PATTERN.COUNT', 'Statement Count'),
  ('PATTERN.CHRONOLOGY', 'Chronology'),
  ('PATTERN.ORDERING', 'Ordering/Sequence'),
  ('PATTERN.ASSERTION_REASON', 'Assertion-Reason')
on conflict (pattern_id) do update
set display_label = excluded.display_label,
    active = true;

alter table public.dp_pattern_dictionary enable row level security;

grant select on public.dp_pattern_dictionary to anon, authenticated, service_role;

drop policy if exists "pattern_dictionary_read" on public.dp_pattern_dictionary;
create policy "pattern_dictionary_read"
on public.dp_pattern_dictionary
for select
to anon, authenticated
using (active = true);

create or replace view public.v_dp_question_intelligence_v2
with (security_invoker = true)
as
select
    q.id,
    q.question_id,
    q.exam,
    q.year,
    q.cycle,
    q.paper,
    q.q_num,
    q.subject,
    q.topic,
    q.subtopic,
    q.theme,
    q.question,
    q.opt_a,
    q.opt_b,
    q.opt_c,
    q.opt_d,
    q.q_type,
    coalesce(pd.display_label, q.q_pattern) as q_pattern,
    q.llm_opt,
    q.official_opt,
    q.final_opt,
    q.key_discrepancy,
    q.explanation,
    q.source,
    q.is_negative,
    q.tags,
    q.verified_status,
    q.static_current_link,
    q.difficulty_score,
    q.difficulty_category,
    q.created_at,
    q.updated_at,
    q.content_hash,
    q.dataset_version,
    q.source_version,
    coalesce(i.production_eligible, true) as production_eligible,
    coalesce(i.intelligence_eligible, false) as intelligence_eligible,
    coalesce(i.human_review_required, true) as human_review_required,
    coalesce(i.release_version, 'DP_PYQ_CORPUS_v1'::text) as release_version,
    i.pattern_id,
    i.taxonomy_subject,
    i.taxonomy_topic,
    i.taxonomy_subtopic,
    i.taxonomy_concept,
    i.competency_id,
    i.source_id,
    i.temporal_context_id,
    i.expected_knowledge,
    i.source_accessibility,
    i.preparation_accessibility,
    i.cognitive_complexity,
    i.esac_score,
    i.relation_degree,
    i.same_concept_degree,
    i.cross_exam_variant_degree,
    i.conceptual_variant_degree,
    i.intelligence_readiness,
    i.requires_content_review,
    i.release_eligible,
    i.intelligence_confidence,
    i.intelligence_verified
from public.questions q
left join public.dp_question_intelligence_v1 i
  on i.question_id = q.question_id
left join public.dp_pattern_dictionary pd
  on pd.pattern_id = i.pattern_id
 and pd.active = true
where q.is_active is true;

grant select on public.v_dp_question_intelligence_v2 to anon, authenticated, service_role;

comment on table public.dp_pattern_dictionary is
'Canonical V2 question-pattern dictionary. pattern_id is machine-readable authority; display_label is UI-facing label.';

comment on view public.v_dp_question_intelligence_v2 is
'Canonical V2 Question Intelligence read model. Machine-readable intelligence fields come from dp_question_intelligence_v1; q_pattern is derived from dp_pattern_dictionary and pattern_id.';

