begin;
lock table public.questions,public.dp_question_intelligence_v1,public.dp_pyq_v1_production_release in share row exclusive mode;
create schema if not exists dp_quality;
revoke all on schema dp_quality from public,anon,authenticated;
create table if not exists dp_quality.review_auto_clear_log (
rule_version text not null,
question_id text not null,
cleared_at timestamptz not null default now(),
intelligence_before jsonb not null,
release_before jsonb,
question_before jsonb not null,
primary key(rule_version,question_id));
alter table dp_quality.review_auto_clear_log enable row level security;
revoke all on dp_quality.review_auto_clear_log from public,anon,authenticated;
grant usage on schema dp_quality to service_role;
grant select on dp_quality.review_auto_clear_log to service_role;
create or replace view public.v_dp_intelligence_review_triage with (security_invoker=true) as
with checks as (
select v.*, array_remove(array[
case when coalesce(trim(v.question),'')='' then 'MISSING_QUESTION' end,
case when exists(select 1 from unnest(array[v.opt_a,v.opt_b,v.opt_c,v.opt_d]) o where coalesce(trim(o),'')='') then 'MISSING_OPTION' end,
case when coalesce(trim(v.explanation),'')='' or coalesce(trim(v.source),'')='' then 'MISSING_EXPLANATION_OR_SOURCE' end,
case when coalesce(upper(trim(v.final_opt)),'') not in ('A','B','C','D') then 'INVALID_FINAL_ANSWER' end,
case when exists(select 1 from unnest(array[v.taxonomy_subject,v.taxonomy_topic,v.taxonomy_subtopic,v.taxonomy_concept,v.competency_id,v.source_id,v.temporal_context_id]) t where coalesce(trim(t),'')='') then 'MISSING_INTELLIGENCE' end,
case when not exists(select 1 from public.dp_pattern_dictionary p where p.pattern_id=v.pattern_id and p.active) then 'INVALID_PATTERN' end,
case when v.subject is distinct from v.taxonomy_subject or v.topic is distinct from v.taxonomy_topic or v.subtopic is distinct from v.taxonomy_subtopic then 'TAXONOMY_DRIFT' end,
case when v.difficulty_score is null or v.difficulty_score not between 0 and 100 or v.difficulty_category is distinct from case when v.difficulty_score<=20 then 'Easy' when v.difficulty_score<=50 then 'Moderate' else 'Hard' end then 'DIFFICULTY_CATEGORY_MISMATCH' end,
case when i.difficulty_score is distinct from v.difficulty_score or i.difficulty_category is distinct from v.difficulty_category then 'INTELLIGENCE_DIFFICULTY_DRIFT' end,
case when v.esac_score is null or v.esac_score not between 0 and 100 or abs(v.esac_score+ i.difficulty_score-100)>0.02 then 'ESAC_INCONSISTENCY' end,
case when v.expected_knowledge is null or v.source_accessibility is null or v.preparation_accessibility is null or v.cognitive_complexity is null or v.expected_knowledge not between 0 and 100 or v.source_accessibility not between 0 and 100 or v.preparation_accessibility not between 0 and 100 or v.cognitive_complexity not between 0 and 100 then 'INVALID_COMPONENT_SCORE' end,
case when v.relation_degree is null or v.same_concept_degree is null or v.cross_exam_variant_degree is null or v.conceptual_variant_degree is null or least(v.relation_degree,v.same_concept_degree,v.cross_exam_variant_degree,v.conceptual_variant_degree)<0 then 'INVALID_RELATION_DEGREE' end
],null) as structural_issues
from public.v_dp_question_intelligence_v2 v join public.dp_question_intelligence_v1 i using(question_id)
)
select question_id,exam,year,cycle,paper,human_review_required,intelligence_trust_tier,
structural_issues,
case when coalesce(upper(trim(official_opt)),'')='' then 'MISSING'
when upper(trim(official_opt))='X' then 'X_REQUIRES_SOURCE_RECONCILIATION'
when upper(trim(official_opt)) not in ('A','B','C','D') then 'INVALID'
when upper(trim(official_opt))=upper(trim(final_opt)) then 'MATCH'
else 'CONFLICT' end as answer_key_status,
case when cardinality(structural_issues)>0 then 'STRUCTURAL_REPAIR'
when key_discrepancy is distinct from false then 'ANSWER_DISCREPANCY_REVIEW'
when coalesce(upper(trim(official_opt)),'') not in ('A','B','C','D') then 'BULK_OFFICIAL_KEY_RECONCILIATION'
when upper(trim(official_opt))<>upper(trim(final_opt)) then 'ANSWER_CONFLICT_REVIEW'
when verified_status is distinct from 'Verified' then 'CONTENT_REVIEW'
when human_review_required then 'AUTO_CLEAR_CANDIDATE'
else 'NO_PENDING_REVIEW' end as review_action
from checks;
revoke all on public.v_dp_intelligence_review_triage from public,anon,authenticated;
grant select on public.v_dp_intelligence_review_triage to service_role;
comment on view public.v_dp_intelligence_review_triage is 'Rule v1 structural triage; MATCH means agreement with stored key, not independently verified official provenance. X never counts as a valid answer. Model-derived taxonomy is not human verified.';

create temporary table clear_candidates on commit drop as
select t.question_id from public.v_dp_intelligence_review_triage t
where t.review_action='AUTO_CLEAR_CANDIDATE'
and not exists(select 1 from dp_quality.review_auto_clear_log l where l.question_id=t.question_id and l.rule_version='stored-key-structural-v1');
insert into dp_quality.review_auto_clear_log(rule_version,question_id,intelligence_before,release_before,question_before)
select 'stored-key-structural-v1',c.question_id,to_jsonb(i),to_jsonb(r),to_jsonb(q)
from clear_candidates c join public.dp_question_intelligence_v1 i using(question_id)
join public.questions q using(question_id)
left join public.dp_pyq_v1_production_release r using(question_id);
update public.dp_question_intelligence_v1 i
set intelligence_readiness='READY',requires_content_review=false,human_review_required=false,updated_at=now()
from clear_candidates c where i.question_id=c.question_id;
update public.dp_pyq_v1_production_release r set human_review_required=false
from clear_candidates c where r.question_id=c.question_id;
do $$ begin
if exists(select 1 from clear_candidates c join public.dp_question_intelligence_v1 i using(question_id) where i.intelligence_verified is distinct from false or i.intelligence_confidence is distinct from 'MODEL_DERIVED') then
raise exception 'Auto-clear must not change verification or confidence'; end if;
if exists(select 1 from dp_quality.review_auto_clear_log l join clear_candidates c using(question_id) join public.questions q using(question_id) where l.rule_version='stored-key-structural-v1' and to_jsonb(q) is distinct from l.question_before) then raise exception 'Question content changed'; end if;
end $$;
commit;