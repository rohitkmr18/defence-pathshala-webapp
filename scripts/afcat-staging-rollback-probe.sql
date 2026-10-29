-- Staging only. All synthetic writes are rolled back by the inner exception block.
create or replace function pg_temp.afcat_gate_probe() returns jsonb language plpgsql as $$
declare u uuid:=gen_random_uuid(); o uuid:=gen_random_uuid(); t uuid; s uuid; e uuid; q uuid[]; r record; r2 record; rejected boolean; outcome jsonb;
begin
 begin
  select id into strict t from public.afcat_tests where code is not null and title='SYNTHETIC QA Mock — Not For Learners' and expected_questions=100;
  if (select count(*) from public.afcat_test_items i join public.afcat_questions x on x.id=i.question_id where i.test_id=t and x.stem->>'text' like 'STAGING ONLY. Synthetic question%')<>100 then raise exception 'Synthetic fixture check failed'; end if;
  insert into auth.users(id,raw_user_meta_data) values(u,'{"full_name":"AFCAT synthetic transaction QA"}'),(o,'{"full_name":"AFCAT synthetic transaction QA other"}');
  perform set_config('request.jwt.claim.sub',u::text,true);
  perform public.complete_onboarding('Synthetic QA',2027,array['AFCAT','CDS']);
  if not exists(select 1 from public.profiles where id=u and onboarding_completed) or (select count(*) from public.user_exam_preferences where user_id=u and exam in ('AFCAT','CDS'))<>2 then raise exception 'Profile/preferences persistence failed'; end if;
  select array_agg(question_id order by position) into q from public.afcat_test_items where test_id=t;
  insert into public.afcat_sessions(user_id,test_id,test_release_version) select u,t,release_version from public.afcat_tests where id=t returning id into s;
  insert into public.afcat_responses(session_id,user_id,question_id,selected_option,marked_for_review) values(s,u,q[1],'A',true),(s,u,q[2],'B',false),(s,u,q[3],'C',false);
  update public.afcat_responses set selected_option=null,marked_for_review=true where session_id=s and question_id=q[3];
  if not exists(select 1 from public.afcat_responses where session_id=s and question_id=q[3] and selected_option is null and marked_for_review) then raise exception 'Clear/review failed'; end if;
  rejected:=false; begin perform public.afcat_finalize_session(s,o); exception when others then rejected:=true; end;
  if not rejected then raise exception 'Cross-user finalization accepted'; end if;
  select * into strict r from public.afcat_finalize_session(s,u);
  if (r.score,r.correct_count,r.incorrect_count,r.unanswered_count,r.max_marks) is distinct from (2,1,1,98,300) then raise exception 'Score assertion failed'; end if;
  select * into strict r2 from public.afcat_finalize_session(s,u);
  if to_jsonb(r) is distinct from to_jsonb(r2) then raise exception 'Idempotency failed'; end if;
  rejected:=false; begin update public.afcat_responses set selected_option='B' where session_id=s and question_id=q[1]; exception when others then rejected:=true; end;
  if not rejected then raise exception 'Post submit edit accepted'; end if;
  insert into public.afcat_sessions(user_id,test_id,test_release_version,started_at) select o,t,release_version,now()-interval '121 minutes' from public.afcat_tests where id=t returning id into e;
  rejected:=false; begin insert into public.afcat_responses(session_id,user_id,question_id,selected_option) values(e,o,q[1],'A'); exception when others then rejected:=true; end;
  if not rejected then raise exception 'Expired response accepted'; end if;
  select * into strict r2 from public.afcat_finalize_session(e,o);
  if r2.status<>'EXPIRED' then raise exception 'Expired finalization failed'; end if;
  outcome:=jsonb_build_object('status','PASS','checks',array['100 synthetic questions','AFCAT + CDS onboarding persisted','save clear review','cross-user finalize rejected','score 2/300 (1 correct,1 incorrect,98 unanswered)','repeat submission identical','post-submit save rejected','expired save rejected','EXPIRED terminal state'],'writes','rolled back','authentication','SQL auth.uid context, not OTP');
  raise sqlstate 'PZ001';
 exception when sqlstate 'PZ001' then return outcome;
 end;
end; $$;
select pg_temp.afcat_gate_probe() as acceptance;
