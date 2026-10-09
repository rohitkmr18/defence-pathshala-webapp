begin;

drop view if exists dp_ingest.v_batch_validation;
drop view if exists dp_ingest.v_row_validation;

create view dp_ingest.v_row_validation
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
      case when r.source_key_opt is null then 'MISSING_SOURCE_KEY' end,
      case when r.release_disposition='INCLUDE' and r.source_key_opt = 'X' then 'CANCELLED_QUESTION_REQUIRES_POLICY' end,
      case when r.source_key_opt is not null and r.source_key_opt not in ('A','B','C','D','X') then 'INVALID_SOURCE_KEY' end,
      case when r.key_authority not in ('OFFICIAL','TRUSTED_SECONDARY') then 'UNTRUSTED_KEY_AUTHORITY' end,
      case when coalesce(trim(r.key_source_url),'') = '' then 'MISSING_KEY_SOURCE_URL' end,
      case when r.release_disposition='INCLUDE' and r.final_opt not in ('A','B','C','D') then 'INVALID_FINAL_ANSWER' end,
      case when r.release_disposition='INCLUDE' and r.final_opt is distinct from r.source_key_opt then 'SOURCE_KEY_FINAL_MISMATCH' end,
      case when r.release_disposition='INCLUDE' and r.key_discrepancy then 'ANSWER_KEY_DISCREPANCY' end,
      case when r.release_disposition='INCLUDE' and (
             coalesce(trim(r.subject),'') = ''
             or coalesce(trim(r.topic),'') = ''
             or coalesce(trim(r.subtopic),'') = ''
           ) then 'MISSING_TAXONOMY' end,
      case when r.release_disposition='INCLUDE' and (
             r.pattern_id is null
             or not exists (
               select 1
               from public.dp_pattern_dictionary p
               where p.pattern_id = r.pattern_id and p.active
             )
           ) then 'INVALID_PATTERN' end,
      case when r.release_disposition='INCLUDE'
             and (coalesce(trim(r.explanation),'')='' or coalesce(trim(r.source),'')='')
        then 'MISSING_EXPLANATION_OR_SOURCE' end,
      case when r.release_disposition='INCLUDE' and (
             coalesce(trim(r.taxonomy_concept),'')=''
             or coalesce(trim(r.competency_id),'')=''
             or coalesce(trim(r.source_id),'')=''
             or coalesce(trim(r.temporal_context_id),'')=''
           ) then 'MISSING_INTELLIGENCE_IDENTITY' end,
      case when r.release_disposition='INCLUDE' and (
             r.expected_knowledge is null or r.expected_knowledge not between 0 and 100
             or r.source_accessibility is null or r.source_accessibility not between 0 and 100
             or r.preparation_accessibility is null or r.preparation_accessibility not between 0 and 100
             or r.cognitive_complexity is null or r.cognitive_complexity not between 0 and 100
           ) then 'INVALID_ESAC_COMPONENT_SCORE' end,
      case when r.release_disposition='INCLUDE'
             and (r.esac_score is null or r.esac_score not between 0 and 100
                  or abs(r.esac_score + r.difficulty_score - 100) > 0.02)
        then 'ESAC_INCONSISTENCY' end,
      case when r.release_disposition='INCLUDE' and (
             r.relation_degree is null or r.same_concept_degree is null
             or r.cross_exam_variant_degree is null or r.conceptual_variant_degree is null
             or least(r.relation_degree,r.same_concept_degree,r.cross_exam_variant_degree,r.conceptual_variant_degree)<0
             or r.relation_degree <> r.same_concept_degree+r.cross_exam_variant_degree+r.conceptual_variant_degree
           ) then 'INVALID_RELATION_DEGREE' end,
      case when r.release_disposition='INCLUDE' and r.difficulty_score is null then 'MISSING_DIFFICULTY' end,
      case when r.release_disposition='INCLUDE'
             and r.difficulty_score is not null
             and r.difficulty_category is distinct from
               case
                 when r.difficulty_score <= 20 then 'Easy'
                 when r.difficulty_score <= 50 then 'Moderate'
                 else 'Hard'
               end
        then 'DIFFICULTY_CATEGORY_MISMATCH' end,
      case when r.release_disposition='INCLUDE' and (r.extraction_confidence is null or r.extraction_confidence < 0.98)
        then 'LOW_EXTRACTION_CONFIDENCE' end,
      case when r.release_disposition='INCLUDE' and (r.source_fidelity_confidence is null or r.source_fidelity_confidence < 0.98)
        then 'LOW_SOURCE_FIDELITY_CONFIDENCE' end,
      case when r.release_disposition='INCLUDE' and (r.taxonomy_confidence is null or r.taxonomy_confidence < 0.85)
        then 'LOW_TAXONOMY_CONFIDENCE' end,
      case when r.release_disposition='INCLUDE' and (r.intelligence_confidence is null or r.intelligence_confidence < 0.80)
        then 'LOW_INTELLIGENCE_CONFIDENCE' end,
      case when r.release_disposition='INCLUDE'
             and coalesce(r.model_audit->'source_explanation_evidence'->>'captured','false') <> 'true'
        then 'MISSING_SOURCE_EXPLANATION_EVIDENCE' end,
      case when r.release_disposition='INCLUDE' and cardinality(r.extraction_flags) > 0 then 'EXTRACTION_FLAGGED' end,
      case when r.release_disposition='INCLUDE' and r.taxonomy_new_node_candidate is not null then 'NEW_TAXONOMY_NODE_PROPOSED' end,
      case when r.release_disposition='INCLUDE' and r.content_hash is not null and exists (
        select 1 from public.questions q where q.content_hash = r.content_hash
      ) then 'DUPLICATE_PRODUCTION_CONTENT_HASH' end,
      case when r.release_disposition='INCLUDE' and r.question_id is not null and exists (
        select 1 from public.questions q where q.question_id = r.question_id
      ) then 'DUPLICATE_PRODUCTION_QUESTION_ID' end,
      case when r.release_disposition='DROP' and coalesce(btrim(r.drop_reason),'')='' then 'DROP_REASON_REQUIRED' end
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
      and not (
        base.release_disposition='DROP'
        and issue in (
          'CANCELLED_QUESTION_REQUIRES_POLICY',
          'EXTERNAL_KEY_CONFLICT_SERIOUS',
          'INVALID_FINAL_ANSWER',
          'SOURCE_KEY_FINAL_MISMATCH',
          'ANSWER_KEY_DISCREPANCY',
          'MISSING_TAXONOMY',
          'INVALID_PATTERN',
          'MISSING_EXPLANATION_OR_SOURCE',
          'MISSING_INTELLIGENCE_IDENTITY',
          'INVALID_ESAC_COMPONENT_SCORE',
          'ESAC_INCONSISTENCY',
          'INVALID_RELATION_DEGREE',
          'MISSING_DIFFICULTY',
          'DIFFICULTY_CATEGORY_MISMATCH',
          'LOW_TAXONOMY_CONFIDENCE',
          'LOW_INTELLIGENCE_CONFIDENCE',
          'MISSING_SOURCE_EXPLANATION_EVIDENCE'
        )
      )
    order by issue
  ) as all_validation_issues,
  (
    base.release_disposition='INCLUDE'
    and cardinality(array(
      select distinct issue
      from unnest(base.validation_issues || base.computed_issues) issue
      where issue is not null
    )) = 0
  ) as release_eligible
from base;

create view dp_ingest.v_batch_validation
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
  count(*) filter (where r.release_disposition='INCLUDE')::integer as included_rows,
  count(*) filter (where r.release_disposition='DROP')::integer as dropped_rows,
  count(*) filter (where r.release_disposition='INCLUDE' and v.release_eligible)::integer as release_eligible_rows,
  count(*) filter (where r.release_disposition='INCLUDE' and not v.release_eligible)::integer as blocked_rows,
  array_remove(array[
    case when count(r.id) <> b.expected_question_count then 'QUESTION_COUNT_MISMATCH' end,
    case when count(r.id) <> count(distinct r.q_num) then 'DUPLICATE_QUESTION_NUMBER' end,
    case when min(r.q_num) is distinct from 1 then 'QUESTION_NUMBER_DOES_NOT_START_AT_1' end,
    case when max(r.q_num) is distinct from b.expected_question_count then 'QUESTION_NUMBER_RANGE_MISMATCH' end,
    case when count(*) filter (where r.release_disposition='DROP' and coalesce(btrim(r.drop_reason),'')='') > 0 then 'DROP_REASON_MISSING' end
  ], null) as batch_issues,
  (
    count(r.id) = b.expected_question_count
    and count(r.id) = count(distinct r.q_num)
    and min(r.q_num) = 1
    and max(r.q_num) = b.expected_question_count
    and count(*) filter (where r.release_disposition='INCLUDE' and not v.release_eligible) = 0
    and count(*) filter (where r.release_disposition='DROP' and coalesce(btrim(r.drop_reason),'')='') = 0
  ) as release_ready
from dp_ingest.batches b
left join dp_ingest.rows r on r.batch_id = b.id
left join dp_ingest.v_row_validation v on v.id = r.id
group by b.id, b.batch_code, b.exam, b.year, b.cycle, b.paper, b.expected_question_count;

revoke all on dp_ingest.v_row_validation, dp_ingest.v_batch_validation from public, anon, authenticated;
grant select on dp_ingest.v_row_validation, dp_ingest.v_batch_validation to service_role;

commit;