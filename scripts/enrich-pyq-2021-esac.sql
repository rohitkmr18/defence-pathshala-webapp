-- DP PYQ 2021 — ESAC model-only difficulty enrichment
-- Applies to private dp_ingest staging only.
-- Empirical SA/MSA correctness is unavailable for these new papers, so this uses
-- the previously locked deterministic ESAC proxy and labels results MODEL_DERIVED.
--
-- E = Expected Knowledge
-- S = Source Accessibility
-- A = Accessibility in Preparation
-- C = Cognitive Complexity
--
-- model_difficulty = 0.30E + 0.20(100-S) + 0.25(100-A) + 0.25C
-- ESAC score       = 100 - model_difficulty
--
-- Production category convention:
--   Easy     <= 20
--   Moderate > 20 and <= 50
--   Hard     > 50
--
-- For 2021, E/S/A/C are calibrated from the existing production intelligence
-- corpus using the most specific available median anchor:
-- node+q_type+q_pattern -> node+q_type -> node -> topic -> subject.
-- This avoids inventing observed SA/MSA percentages and keeps the new batch on
-- the same scale as the existing corpus.

with existing as (
  select q.subject,q.topic,q.subtopic,q.q_type,
         coalesce(pd.display_label,q.q_pattern) as q_pattern,
         i.expected_knowledge::numeric as e,
         i.source_accessibility::numeric as s,
         i.preparation_accessibility::numeric as a,
         i.cognitive_complexity::numeric as c
  from public.questions q
  join public.dp_question_intelligence_v1 i on i.question_id=q.question_id
  left join public.dp_pattern_dictionary pd on pd.pattern_id=i.pattern_id and pd.active
  where q.is_active
    and i.expected_knowledge is not null
    and i.source_accessibility is not null
    and i.preparation_accessibility is not null
    and i.cognitive_complexity is not null
),
anchors as (
  select n.id,
    coalesce(
      (select percentile_cont(0.5) within group(order by e) from existing x where x.subject=n.subject and x.topic=n.topic and x.subtopic=n.subtopic and x.q_type=n.q_type and x.q_pattern=n.q_pattern),
      (select percentile_cont(0.5) within group(order by e) from existing x where x.subject=n.subject and x.topic=n.topic and x.subtopic=n.subtopic and x.q_type=n.q_type),
      (select percentile_cont(0.5) within group(order by e) from existing x where x.subject=n.subject and x.topic=n.topic and x.subtopic=n.subtopic),
      (select percentile_cont(0.5) within group(order by e) from existing x where x.subject=n.subject and x.topic=n.topic),
      (select percentile_cont(0.5) within group(order by e) from existing x where x.subject=n.subject)
    ) as e,
    coalesce(
      (select percentile_cont(0.5) within group(order by s) from existing x where x.subject=n.subject and x.topic=n.topic and x.subtopic=n.subtopic and x.q_type=n.q_type and x.q_pattern=n.q_pattern),
      (select percentile_cont(0.5) within group(order by s) from existing x where x.subject=n.subject and x.topic=n.topic and x.subtopic=n.subtopic and x.q_type=n.q_type),
      (select percentile_cont(0.5) within group(order by s) from existing x where x.subject=n.subject and x.topic=n.topic and x.subtopic=n.subtopic),
      (select percentile_cont(0.5) within group(order by s) from existing x where x.subject=n.subject and x.topic=n.topic),
      (select percentile_cont(0.5) within group(order by s) from existing x where x.subject=n.subject)
    ) as s,
    coalesce(
      (select percentile_cont(0.5) within group(order by a) from existing x where x.subject=n.subject and x.topic=n.topic and x.subtopic=n.subtopic and x.q_type=n.q_type and x.q_pattern=n.q_pattern),
      (select percentile_cont(0.5) within group(order by a) from existing x where x.subject=n.subject and x.topic=n.topic and x.subtopic=n.subtopic and x.q_type=n.q_type),
      (select percentile_cont(0.5) within group(order by a) from existing x where x.subject=n.subject and x.topic=n.topic and x.subtopic=n.subtopic),
      (select percentile_cont(0.5) within group(order by a) from existing x where x.subject=n.subject and x.topic=n.topic),
      (select percentile_cont(0.5) within group(order by a) from existing x where x.subject=n.subject)
    ) as a,
    coalesce(
      (select percentile_cont(0.5) within group(order by c) from existing x where x.subject=n.subject and x.topic=n.topic and x.subtopic=n.subtopic and x.q_type=n.q_type and x.q_pattern=n.q_pattern),
      (select percentile_cont(0.5) within group(order by c) from existing x where x.subject=n.subject and x.topic=n.topic and x.subtopic=n.subtopic and x.q_type=n.q_type),
      (select percentile_cont(0.5) within group(order by c) from existing x where x.subject=n.subject and x.topic=n.topic and x.subtopic=n.subtopic),
      (select percentile_cont(0.5) within group(order by c) from existing x where x.subject=n.subject and x.topic=n.topic),
      (select percentile_cont(0.5) within group(order by c) from existing x where x.subject=n.subject)
    ) as c,
    case
      when exists(select 1 from existing x where x.subject=n.subject and x.topic=n.topic and x.subtopic=n.subtopic and x.q_type=n.q_type and x.q_pattern=n.q_pattern) then 'NODE_TYPE_PATTERN_MEDIAN'
      when exists(select 1 from existing x where x.subject=n.subject and x.topic=n.topic and x.subtopic=n.subtopic and x.q_type=n.q_type) then 'NODE_TYPE_MEDIAN'
      when exists(select 1 from existing x where x.subject=n.subject and x.topic=n.topic and x.subtopic=n.subtopic) then 'NODE_MEDIAN'
      when exists(select 1 from existing x where x.subject=n.subject and x.topic=n.topic) then 'TOPIC_MEDIAN'
      else 'SUBJECT_MEDIAN'
    end as anchor_level
  from dp_ingest.rows n
  join dp_ingest.batches b on b.id=n.batch_id
  where b.batch_code in ('CAPF_AC_2021_I_GAI','CDS_2021_I_GK','CDS_2021_II_GK')
)
update dp_ingest.rows r
set difficulty_score = round((
      0.30*anchors.e
    + 0.20*(100-anchors.s)
    + 0.25*(100-anchors.a)
    + 0.25*anchors.c
  )::numeric,2),
  difficulty_category = case
    when (0.30*anchors.e + 0.20*(100-anchors.s) + 0.25*(100-anchors.a) + 0.25*anchors.c) <= 20 then 'Easy'
    when (0.30*anchors.e + 0.20*(100-anchors.s) + 0.25*(100-anchors.a) + 0.25*anchors.c) <= 50 then 'Moderate'
    else 'Hard'
  end,
  intelligence_confidence = case
    when anchors.anchor_level='NODE_TYPE_PATTERN_MEDIAN' then 0.94
    when anchors.anchor_level='NODE_TYPE_MEDIAN' then 0.91
    when anchors.anchor_level='NODE_MEDIAN' then 0.88
    when anchors.anchor_level='TOPIC_MEDIAN' then 0.84
    else 0.80
  end,
  model_audit = coalesce(r.model_audit,'{}'::jsonb) || jsonb_build_object(
    'esac',jsonb_build_object(
      'method','deterministic_esac_proxy_v1_model_only',
      'anchor_level',anchors.anchor_level,
      'expected_knowledge',round(anchors.e::numeric,2),
      'source_accessibility',round(anchors.s::numeric,2),
      'preparation_accessibility',round(anchors.a::numeric,2),
      'cognitive_complexity',round(anchors.c::numeric,2),
      'difficulty_formula','0.30E + 0.20(100-S) + 0.25(100-A) + 0.25C',
      'esac_formula','100 - difficulty_score',
      'empirical_sa_msa_available',false,
      'confidence_label','MODEL_DERIVED'
    )
  ),
  updated_at=now()
from anchors
where r.id=anchors.id;
