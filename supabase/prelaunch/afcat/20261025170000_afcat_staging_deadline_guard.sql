-- AFCAT staging-only: guard autosaves at the database clock, not just API clock.
-- Promotes consistent enforcement for slow/concurrent requests.
begin;
create or replace function public.afcat_validate_response() returns trigger
language plpgsql security invoker set search_path = '' as $$
declare v_status text; v_test uuid; v_owner uuid; v_started timestamptz; v_duration integer;
begin
 select status,test_id,user_id,started_at into v_status,v_test,v_owner,v_started
 from public.afcat_sessions where id=new.session_id for update;
 if v_status is distinct from 'IN_PROGRESS' or v_owner is distinct from new.user_id
    or not exists(select 1 from public.afcat_test_items
                  where test_id=v_test and question_id=new.question_id)
 then raise exception 'Invalid or closed AFCAT response'; end if;
 select duration_seconds into v_duration from public.afcat_tests where id=v_test;
 if v_duration is null or clock_timestamp() >= v_started + make_interval(secs => v_duration)
 then raise exception 'AFCAT response deadline passed'; end if;
 if tg_op='UPDATE' and (old.session_id,old.user_id,old.question_id)
    is distinct from (new.session_id,new.user_id,new.question_id)
 then raise exception 'AFCAT response identity immutable'; end if;
 return new;
end; $$;
commit;
