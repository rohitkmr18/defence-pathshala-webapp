
create view public.v_dp_question_intelligence_v2
with (security_invoker=true)
as
select
  q.id, q.question_id, q.exam, q.year, q.cycle, q.paper, q.q_num,
  q.subject, q.topic, q.subtopic, q.theme,
  q.question, q.opt_a, q.opt_b, q.opt_c, q.opt_d,
  q.q_type, q.q_pattern, q.llm_opt, q.official_opt, q.final_opt,
  q.key_discrepancy, q.explanation, q.source, q.is_negative, q.tags,
  q.verified_status, q.static_current_link,
  q.difficulty_score, q.difficulty_category,
  q.created_at, q.updated_at, q.content_hash,
  q.dataset_version, q.source_version,
  coalesce(i.production_eligible, true) as production_eligible,
  coalesce(i.intelligence_eligible, false) as intelligence_eligible,
  coalesce(i.human_review_required, true) as human_review_required,
  coalesce(i.release_version, 'DP_PYQ_CORPUS_v1') as release_version
from public.questions q
left join public.dp_question_intelligence_v1 i on i.question_id=q.question_id
where q.is_active is true;

grant select on public.v_dp_question_intelligence_v2 to service_role;
comment on view public.v_dp_question_intelligence_v2 is
'Production PYQ read model v2. Eligibility is sourced from the imported frozen intelligence release snapshot and is not recomputed by application code.';

