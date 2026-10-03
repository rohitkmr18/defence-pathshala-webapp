-- ==============================================================================
-- Migration: 009_create_v_dp_question_intelligence_v1.sql
-- Description: Creates canonical production read model for Question Intelligence
-- ==============================================================================

-- 1. Create or replace the canonical question intelligence read model view
create or replace view public.v_dp_question_intelligence_v1 as
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

    -- Canonical eligibility and quality gate flags
    (
        q.is_active is true
        and q.question is not null
        and q.opt_a is not null
        and q.opt_b is not null
        and q.opt_c is not null
        and q.opt_d is not null
        and q.final_opt is not null
    ) as production_eligible,

    (
        q.is_active is true
        and q.verified_status = 'Verified'
        and q.explanation is not null
        and q.source is not null
        and (q.key_discrepancy is false or q.key_discrepancy is null)
    ) as intelligence_eligible,

    (
        q.verified_status != 'Verified'
        or q.key_discrepancy is true
    ) as human_review_required

from public.questions q
where q.is_active is true;

-- 2. Grant read access to application roles
grant select on public.v_dp_question_intelligence_v1 to anon, authenticated, service_role;

-- 3. Comment for documentation & schema introspection
comment on view public.v_dp_question_intelligence_v1 is
'Canonical production read model for Defence Pathshala PYQ Intelligence platform. Exposes normalized taxonomy, difficulty, pattern, and eligibility flags.';
