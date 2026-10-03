
drop view if exists public.v_dp_question_intelligence_v1;

create view public.v_dp_question_intelligence_v1 as
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
    q.q_pattern,
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
    r.production_eligible,
    r.intelligence_eligible,
    r.human_review_required,
    r.release_version
from public.questions q
join public.dp_pyq_v1_production_release r
  on r.question_id = q.question_id
where q.is_active is true;

alter view public.v_dp_question_intelligence_v1 set (security_invoker = true);

grant select on public.v_dp_question_intelligence_v1 to anon, authenticated, service_role;

comment on view public.v_dp_question_intelligence_v1 is
'Canonical production read model for Defence Pathshala PYQ Intelligence. Eligibility flags are materialized from the promoted frozen release contract and must not be recomputed in application code.';

