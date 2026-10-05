-- Read-only assertions: raises on contract regression; no fixed corpus-size assumption.
do $$
begin
if (select count(*) from public.questions where is_active) <> (select count(*) from public.v_dp_question_intelligence_v2)
then raise exception 'Active/v2 row parity failure'; end if;
if exists(select question_id from public.v_dp_question_intelligence_v2 group by question_id having count(*)<>1)
then raise exception 'Duplicate canonical question ID'; end if;
if (select count(*) from public.v_dp_intelligence_review_triage) <> (select count(*) from public.v_dp_question_intelligence_v2)
then raise exception 'Triage row parity failure'; end if;
if exists(select 1 from public.dp_pyq_v1_production_release r join public.dp_question_intelligence_v1 i using(question_id)
where r.human_review_required is distinct from i.human_review_required)
then raise exception 'Release/intelligence review flag drift'; end if;
if exists(select 1 from public.v_dp_intelligence_review_triage where 'DIFFICULTY_CATEGORY_MISMATCH'=any(structural_issues))
then raise exception 'Difficulty category mismatch'; end if;
if has_table_privilege('anon','public.v_dp_intelligence_review_triage','SELECT')
or has_table_privilege('authenticated','public.v_dp_intelligence_review_triage','SELECT')
or has_schema_privilege('anon','dp_quality','USAGE')
or has_schema_privilege('authenticated','dp_quality','USAGE')
then raise exception 'Review evidence exposed to client roles'; end if;
-- Boundary regression for continuous difficulty scores.
if exists(select 1 from (values (0::numeric,'Easy'),(20,'Easy'),(20.01,'Moderate'),(50,'Moderate'),(50.01,'Hard'),(100,'Hard')) b(score,expected)
where expected <> case when score<=20 then 'Easy' when score<=50 then 'Moderate' else 'Hard' end)
then raise exception 'Difficulty boundary regression'; end if;
end $$;
