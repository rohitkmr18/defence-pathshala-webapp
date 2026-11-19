-- Exported verbatim from STAGING (pxfstrzceyxnweeaydvz) version 20261119185348 "mock_finalize_fix_column_conflict".
-- Already applied on staging; do NOT re-apply there.

create or replace function public.mock_finalize_session(p_session_id uuid, p_user_id uuid)
returns table (status text, correct_count integer, incorrect_count integer,
 unanswered_count integer, score numeric, max_marks numeric)
language plpgsql security invoker set search_path = '' as $$
#variable_conflict use_column
declare s record; t record; v_c integer; v_w integer; v_u integer;
begin
 select * into s from public.mock_sessions ms where ms.id=p_session_id and ms.user_id=p_user_id for update;
 if not found then raise exception 'Mock session not found'; end if;
 if s.status in ('SUBMITTED','EXPIRED') then
   return query select s.status,r.correct_count,r.incorrect_count,r.unanswered_count,r.score,r.max_marks
     from public.mock_session_results r where r.session_id=s.id;
   if not found then raise exception 'Mock final result missing'; end if;
   return;
 end if;
 if s.status<>'IN_PROGRESS' then raise exception 'Invalid session state'; end if;
 select mt.duration_seconds,mt.expected_questions,mt.correct_points,mt.wrong_points,mt.points_divisor,mt.max_marks as mm
   into t from public.mock_tests mt where mt.id=s.test_id;
 if not found then raise exception 'Mock test not found'; end if;
 if (select count(*) from public.mock_test_items ti where ti.test_id=s.test_id)<>t.expected_questions
 then raise exception 'Mock test incomplete'; end if;
 select count(*) filter(where r.selected_option=q.correct_option),
        count(*) filter(where r.selected_option is not null and r.selected_option<>q.correct_option),
        count(*) filter(where r.selected_option is null)
   into v_c,v_w,v_u
 from public.mock_test_items i join public.mock_questions q on q.id=i.question_id
 left join public.mock_responses r on r.session_id=s.id and r.question_id=i.question_id
 where i.test_id=s.test_id;
 if v_c+v_w+v_u<>t.expected_questions then raise exception 'Mock answer aggregation mismatch'; end if;
 insert into public.mock_session_results(session_id,user_id,correct_count,incorrect_count,unanswered_count,score,max_marks)
 values(s.id,s.user_id,v_c,v_w,v_u,
   round((v_c*t.correct_points-v_w*t.wrong_points)::numeric/t.points_divisor,2),t.mm);
 update public.mock_sessions set status=case when clock_timestamp()>=s.started_at+t.duration_seconds*interval '1 second'
   then 'EXPIRED' else 'SUBMITTED' end, finished_at=clock_timestamp() where id=s.id;
 return query select x.status,r.correct_count,r.incorrect_count,r.unanswered_count,r.score,r.max_marks
 from public.mock_sessions x join public.mock_session_results r on r.session_id=x.id where x.id=s.id;
end; $$;
revoke all on function public.mock_finalize_session(uuid,uuid) from public,anon,authenticated;
grant execute on function public.mock_finalize_session(uuid,uuid) to service_role;
