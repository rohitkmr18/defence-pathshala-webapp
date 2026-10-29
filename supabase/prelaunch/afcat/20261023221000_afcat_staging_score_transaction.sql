-- AFCAT staging test finalization. Never apply to production without launch acceptance.
begin;

create table public.afcat_session_results (
 session_id uuid primary key references public.afcat_sessions(id) on delete restrict,
 user_id uuid not null references auth.users(id) on delete restrict,
 correct_count integer not null check (correct_count >= 0),
 incorrect_count integer not null check (incorrect_count >= 0),
 unanswered_count integer not null check (unanswered_count >= 0),
 score integer not null,
 max_marks integer not null check (max_marks > 0),
 completed_at timestamptz not null default clock_timestamp()
);
create index afcat_results_owner_idx on public.afcat_session_results(user_id);
alter table public.afcat_session_results enable row level security;
revoke all on public.afcat_session_results from anon, authenticated;
grant select on public.afcat_session_results to authenticated;
create policy afcat_own_result on public.afcat_session_results
for select to authenticated using ((select auth.uid()) = user_id);

-- Serialize all saves with terminal submissions via session row lock.
create or replace function public.afcat_validate_response() returns trigger
language plpgsql security invoker set search_path = '' as $$
declare v_status text; v_test uuid; v_owner uuid;
begin
 select status,test_id,user_id into v_status,v_test,v_owner
 from public.afcat_sessions where id=new.session_id for update;
 if v_status is distinct from 'IN_PROGRESS' or v_owner is distinct from new.user_id
    or not exists(select 1 from public.afcat_test_items
                  where test_id=v_test and question_id=new.question_id)
 then raise exception 'Invalid or closed AFCAT response'; end if;
 return new;
end; $$;

create unique index afcat_one_active_session_per_user_test
on public.afcat_sessions(user_id,test_id) where status='IN_PROGRESS';

create function public.afcat_finalize_session(
 p_session_id uuid, p_user_id uuid
) returns table (
 status text, correct_count integer, incorrect_count integer,
 unanswered_count integer, score integer, max_marks integer
)
language plpgsql security invoker set search_path = '' as $$
declare
 s record; t record; v_correct integer; v_incorrect integer; v_unanswered integer;
begin
 select * into s from public.afcat_sessions
 where id=p_session_id and user_id=p_user_id for update;
 if not found then raise exception 'AFCAT session not found'; end if;
 if s.status in ('SUBMITTED','EXPIRED') then
   return query select s.status,r.correct_count,r.incorrect_count,
     r.unanswered_count,r.score,r.max_marks
     from public.afcat_session_results r where r.session_id=s.id;
   if not found then raise exception 'AFCAT final result missing'; end if;
   return;
 end if;
 if s.status <> 'IN_PROGRESS' then raise exception 'Invalid session state'; end if;
 select duration_seconds,expected_questions into t from public.afcat_tests where id=s.test_id;
 if not found then raise exception 'AFCAT test not found'; end if;
 if (select count(*) from public.afcat_test_items where test_id=s.test_id) <> t.expected_questions
 then raise exception 'AFCAT test incomplete'; end if;
 select
   count(*) filter(where r.selected_option=q.correct_option),
   count(*) filter(where r.selected_option is not null and r.selected_option<>q.correct_option),
   count(*) filter(where r.selected_option is null)
 into v_correct,v_incorrect,v_unanswered
 from public.afcat_test_items i
 join public.afcat_questions q on q.id=i.question_id
 left join public.afcat_responses r on r.session_id=s.id and r.question_id=i.question_id
 where i.test_id=s.test_id;
 if v_correct+v_incorrect+v_unanswered<>t.expected_questions
 then raise exception 'AFCAT answer aggregation mismatch'; end if;
 insert into public.afcat_session_results(
  session_id,user_id,correct_count,incorrect_count,unanswered_count,score,max_marks
 ) values(
  s.id,s.user_id,v_correct,v_incorrect,v_unanswered,v_correct*3-v_incorrect,t.expected_questions*3
 );
 update public.afcat_sessions
 set status=case when clock_timestamp() >= s.started_at+t.duration_seconds*interval '1 second'
      then 'EXPIRED' else 'SUBMITTED' end,
     finished_at=clock_timestamp()
 where id=s.id;
 return query select x.status,r.correct_count,r.incorrect_count,
   r.unanswered_count,r.score,r.max_marks
 from public.afcat_sessions x
 join public.afcat_session_results r on r.session_id=x.id where x.id=s.id;
end; $$;

revoke all on function public.afcat_finalize_session(uuid,uuid) from public,anon,authenticated;
grant execute on function public.afcat_finalize_session(uuid,uuid) to service_role;
commit;
