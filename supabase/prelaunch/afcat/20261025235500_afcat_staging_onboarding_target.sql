-- Staging only. Enable AFCAT as a permitted onboarding target in the existing DP RPC.
create or replace function dp_onboarding_private.save_preparation_profile(p_full_name text,p_target_year integer,p_target_exams text[],p_setup boolean)
returns jsonb language plpgsql security definer set search_path='' as $$
declare
 v_uid uuid:=auth.uid();
 v_exams text[];
 v_name text;
 v_completed boolean;
begin
 if v_uid is null or p_setup is null then raise exception 'Authentication required' using errcode='42501'; end if;
 insert into public.profiles(id,role,onboarding_completed) values(v_uid,'student',false) on conflict(id) do nothing;
 select onboarding_completed into strict v_completed from public.profiles where id=v_uid for update;
 if p_setup and v_completed then
  return (select jsonb_build_object('id',p.id,'full_name',p.full_name,'target_year',p.target_year,'onboarding_completed',true,'target_exams',coalesce((select array_agg(exam order by exam) from public.user_exam_preferences where user_id=v_uid),'{}'::text[])) from public.profiles p where p.id=v_uid);
 end if;
 if not p_setup and not v_completed then raise exception 'Complete setup before editing targets' using errcode='22023'; end if;
 v_name:=nullif(btrim(p_full_name),'');
 if length(v_name)>200 or (p_target_year is not null and (p_target_year<2026 or p_target_year>2032))
    or p_target_exams is null or cardinality(p_target_exams)=0
    or array_ndims(p_target_exams)<>1 or array_position(p_target_exams,null) is not null
    or (p_setup and not p_target_exams <@ array['CDS','CAPF-AC','AFCAT']::text[])
    or (not p_setup and not p_target_exams <@ array['CDS','CAPF-AC','NDA','AFCAT','UPSC-CSE']::text[]) then
   raise exception 'Invalid preparation preferences' using errcode='22023';
 end if;
 select array_agg(distinct exam order by exam) into v_exams from unnest(p_target_exams) as exam;
 delete from public.user_exam_preferences where user_id=v_uid;
 insert into public.user_exam_preferences(user_id,exam) select v_uid,exam from unnest(v_exams) as exam;
 update public.profiles set full_name=coalesce(v_name,full_name),target_year=p_target_year,onboarding_completed=true,updated_at=now() where id=v_uid;
 return (select jsonb_build_object('id',p.id,'full_name',p.full_name,'target_year',p.target_year,'onboarding_completed',p.onboarding_completed,'target_exams',v_exams) from public.profiles p where p.id=v_uid);
end;$$;

notify pgrst,'reload schema';
