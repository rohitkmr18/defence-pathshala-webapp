create or replace view public.v_dp_question_intelligence_v2
with (security_invoker = true)
as
select
  q.id, q.question_id, q.exam, q.year, q.cycle, q.paper, q.q_num,
  q.subject, q.topic, q.subtopic, q.theme, q.question,
  q.opt_a, q.opt_b, q.opt_c, q.opt_d, q.q_type,
  coalesce(pd.display_label, q.q_pattern) as q_pattern,
  q.llm_opt, q.official_opt, q.final_opt, q.key_discrepancy,
  q.explanation, q.source, q.is_negative, q.tags, q.verified_status,
  q.static_current_link, q.difficulty_score, q.difficulty_category,
  q.created_at, q.updated_at, q.content_hash, q.dataset_version, q.source_version,
  coalesce(i.production_eligible, true) as production_eligible,
  coalesce(i.intelligence_eligible, false) as intelligence_eligible,
  coalesce(i.human_review_required, true) as human_review_required,
  coalesce(i.release_version, 'DP_PYQ_CORPUS_v1'::text) as release_version,
  i.pattern_id, i.taxonomy_subject, i.taxonomy_topic, i.taxonomy_subtopic,
  i.taxonomy_concept, i.competency_id, i.source_id, i.temporal_context_id,
  i.expected_knowledge, i.source_accessibility, i.preparation_accessibility,
  i.cognitive_complexity, i.esac_score, i.relation_degree,
  i.same_concept_degree, i.cross_exam_variant_degree, i.conceptual_variant_degree,
  i.intelligence_readiness, i.requires_content_review, i.release_eligible,
  i.intelligence_confidence, i.intelligence_verified,
  case
    when coalesce(i.intelligence_verified, false)
      and coalesce(i.human_review_required, true) = false
      and coalesce(i.requires_content_review, true) = false
      then 'HUMAN_VERIFIED'
    when coalesce(i.human_review_required, true)
      or coalesce(i.requires_content_review, true)
      or i.intelligence_readiness = 'REVIEW_REQUIRED'
      then 'REVIEW_REQUIRED'
    when coalesce(i.intelligence_eligible, false)
      and i.intelligence_readiness = 'READY'
      then 'MODEL_READY'
    else 'NOT_ELIGIBLE'
  end as intelligence_trust_tier,
  case
    when coalesce(i.intelligence_verified, false) then 'VERIFIED'
    when coalesce(i.human_review_required, true)
      or coalesce(i.requires_content_review, true)
      then 'REVIEW_REQUIRED'
    when coalesce(i.intelligence_eligible, false) then 'UNVERIFIED_READY'
    else 'NOT_ELIGIBLE'
  end as intelligence_verification_status,
  case
    when coalesce(i.production_eligible, true)
      and coalesce(i.release_eligible, false)
      then 'RELEASED'
    else 'WITHHELD'
  end as student_release_status
from public.questions q
left join public.dp_question_intelligence_v1 i on i.question_id = q.question_id
left join public.dp_pattern_dictionary pd on pd.pattern_id = i.pattern_id and pd.active = true
where q.is_active is true;

comment on view public.v_dp_question_intelligence_v2 is
'Canonical student-facing PYQ intelligence read model. Eligibility/release fields describe availability; intelligence_trust_tier and intelligence_verification_status describe trust and human verification independently.';
