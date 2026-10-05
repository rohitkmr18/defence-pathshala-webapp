begin;
lock table public.questions, public.dp_question_intelligence_v1 in share row exclusive mode;
alter table public.questions drop constraint questions_difficulty_category_check;
alter table public.questions add constraint questions_difficulty_category_check
check (difficulty_score is null or (difficulty_score between 0 and 100 and difficulty_category is not null and difficulty_category=case when difficulty_score<=20 then 'Easy' when difficulty_score<=50 then 'Moderate' else 'Hard' end)) not valid;
create table dp_quality.difficulty_category_repair_log (
question_id text primary key,
repaired_at timestamptz not null default now(),
question_before jsonb not null,
intelligence_before jsonb not null,
expected_category text not null);
alter table dp_quality.difficulty_category_repair_log enable row level security;
revoke all on dp_quality.difficulty_category_repair_log from public,anon,authenticated;
grant select on dp_quality.difficulty_category_repair_log to service_role;
create policy service_role_read on dp_quality.difficulty_category_repair_log for select to service_role using(true);
create policy service_role_read on dp_quality.review_auto_clear_log for select to service_role using(true);
insert into dp_quality.difficulty_category_repair_log(question_id,question_before,intelligence_before,expected_category)
select q.question_id,to_jsonb(q),to_jsonb(i),case when q.difficulty_score<=20 then 'Easy' when q.difficulty_score<=50 then 'Moderate' else 'Hard' end
from public.questions q join public.dp_question_intelligence_v1 i using(question_id)
where q.is_active and q.difficulty_score between 0 and 100 and i.difficulty_score=q.difficulty_score
and q.difficulty_category is distinct from case when q.difficulty_score<=20 then 'Easy' when q.difficulty_score<=50 then 'Moderate' else 'Hard' end;
update public.questions q set difficulty_category=l.expected_category
from dp_quality.difficulty_category_repair_log l where l.question_id=q.question_id;
update public.dp_question_intelligence_v1 i set difficulty_category=l.expected_category
from dp_quality.difficulty_category_repair_log l where l.question_id=i.question_id;
do $$ begin
if exists(select 1 from dp_quality.difficulty_category_repair_log l join public.questions q using(question_id)
where (to_jsonb(q)-'difficulty_category') is distinct from (l.question_before-'difficulty_category'))
then raise exception 'Category repair modified another question field'; end if;
if exists(select 1 from dp_quality.difficulty_category_repair_log l join public.dp_question_intelligence_v1 i using(question_id)
where (to_jsonb(i)-'difficulty_category') is distinct from (l.intelligence_before-'difficulty_category'))
then raise exception 'Category repair modified another intelligence field'; end if;
end $$;
alter table public.questions validate constraint questions_difficulty_category_check;
commit;