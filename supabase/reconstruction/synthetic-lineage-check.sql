-- Local PostgreSQL harness only. All fixture IDs/content are synthetic.
begin;
insert into public.questions (id,question_id,exam,year,cycle,q_num,subject,topic,subtopic,theme,question,opt_a,opt_b,opt_c,opt_d,q_pattern,final_opt,official_opt)
values
('10000000-0000-0000-0000-000000000001','OFFLINE_1','CDS',2025,'I',1,'Polity','Constitution','Rights','Preamble','Offline fixture?','A','B','C','D','Single MCQ','B','A'),
('10000000-0000-0000-0000-000000000002','OFFLINE_2','CDS',2025,'I',2,'Polity','Constitution','Rights','Preamble','Offline fixture 2?','A','B','C','D','Single MCQ','C','C');
insert into public.dp_pyq_v1_production_release(question_id,release_version,production_eligible,intelligence_eligible,human_review_required)
values ('OFFLINE_1','DP_PYQ_CORPUS_v1',true,true,true),('OFFLINE_2','DP_PYQ_CORPUS_v1',false,false,true);
insert into public.dp_question_intelligence_v1(question_id,taxonomy_subject,taxonomy_topic,taxonomy_subtopic,taxonomy_concept,competency_id,pattern_id,source_id,temporal_context_id,difficulty_category,production_eligible,intelligence_eligible)
values ('OFFLINE_1','Polity','Constitution','Rights','Preamble','TEST.COMP','PATTERN.DIRECT','TEST.SRC','TEST.TIME','Moderate',true,true),
('OFFLINE_2','Polity','Constitution','Rights','Preamble','TEST.COMP','PATTERN.DIRECT','TEST.SRC','TEST.TIME','Easy',false,false);
insert into auth.users(id) values ('20000000-0000-0000-0000-000000000001'),('20000000-0000-0000-0000-000000000002');
insert into public.practice_sessions(id,user_id,question_ids,total_questions)
values ('30000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','["10000000-0000-0000-0000-000000000001"]',1);
insert into public.user_attempts(user_id,question_id,session_id,selected_option,is_correct)
values ('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','B',true);
do $$ begin
  begin
    insert into public.user_attempts(user_id,question_id,session_id,selected_option,is_correct)
    values ('20000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','A',false);
    raise exception 'Cross-user linkage unexpectedly allowed';
  exception when check_violation then null; end;
  if (select count(*) from public.v_dp_question_intelligence_v2) <> 2 then raise exception 'Canonical count mismatch'; end if;
  if (select final_opt from public.v_dp_question_intelligence_v2 where question_id='OFFLINE_1') <> 'B' then raise exception 'Answer authority lost'; end if;
  if (select production_eligible from public.v_dp_question_intelligence_v2 where question_id='OFFLINE_2') then raise exception 'Eligibility recomputed'; end if;
  if (select q_pattern from public.v_dp_question_intelligence_v2 where question_id='OFFLINE_1') <> 'Single MCQ' then raise exception 'Pattern lineage lost'; end if;
end $$;
set local role authenticated;
select set_config('request.jwt.claim.sub','20000000-0000-0000-0000-000000000002',true);
select set_config('request.jwt.claim.role','authenticated',true);
do $$ begin
  if exists(select 1 from public.practice_sessions) or exists(select 1 from public.user_attempts) then raise exception 'Cross-user history visible'; end if;
  begin
    insert into public.current_affairs_posts(date,title,slug) values ('2000-01-01','Offline denied','offline-denied');
    raise exception 'Learner editorial write unexpectedly allowed';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.practice_sessions(user_id) values ('20000000-0000-0000-0000-000000000001');
    raise exception 'Cross-user session insert unexpectedly allowed';
  exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claim.sub','20000000-0000-0000-0000-000000000001',true);
do $$ begin
  if (select count(*) from public.practice_sessions) <> 1 or (select count(*) from public.user_attempts) <> 1 then raise exception 'Owner history inaccessible'; end if;
end $$;
reset role;
select 'PASS: synthetic lineage, canonical answer, ownership trigger, owner RLS and denied learner editorial writes' as result;
rollback;
