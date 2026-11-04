-- AFCAT STAGING ONLY: minimal reconstruction of existing DP auth prerequisites.
-- Never promote this migration to production.
begin;
create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 full_name text,
 role text not null default 'student' check (role in ('student','admin')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 target_year integer,
 onboarding_completed boolean not null default false
);
create table public.user_exam_preferences (
 user_id uuid not null references public.profiles(id) on delete cascade,
 exam text not null check (exam in ('CDS','CAPF-AC','NDA','AFCAT','UPSC-CSE')),
 created_at timestamptz not null default now(),
 primary key(user_id,exam)
);
alter table public.profiles enable row level security;
alter table public.user_exam_preferences enable row level security;
create policy "Users can view own profile" on public.profiles for select to authenticated using ((select auth.uid())=id);
create policy "Users can update own profile" on public.profiles for update to authenticated using ((select auth.uid())=id) with check ((select auth.uid())=id);
create policy "Users can read own exam preferences" on public.user_exam_preferences for select to authenticated using ((select auth.uid())=user_id);
create policy "Users can insert own exam preferences" on public.user_exam_preferences for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Users can delete own exam preferences" on public.user_exam_preferences for delete to authenticated using ((select auth.uid())=user_id);
grant select,update on public.profiles to authenticated;
grant select,insert,delete on public.user_exam_preferences to authenticated;
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.profiles(id,full_name) values (new.id,coalesce(new.raw_user_meta_data->>'full_name','')) on conflict (id) do nothing;
 return new;
end;$$;
revoke all on function public.handle_new_user() from public,anon,authenticated;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
insert into public.profiles(id,full_name) select id,coalesce(raw_user_meta_data->>'full_name','') from auth.users on conflict(id) do nothing;
create schema if not exists dp_onboarding_private;
revoke all on schema dp_onboarding_private from public,anon;
grant usage on schema dp_onboarding_private to authenticated;
create function dp_onboarding_private.save_preparation_profile(p_full_name text,p_target_year integer,p_target_exams text[],p_setup boolean)
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
    or (p_setup and not p_target_exams <@ array['CDS','CAPF-AC']::text[])
    or (not p_setup and not p_target_exams <@ array['CDS','CAPF-AC','NDA','AFCAT','UPSC-CSE']::text[]) then
   raise exception 'Invalid preparation preferences' using errcode='22023';
 end if;
 select array_agg(distinct exam order by exam) into v_exams from unnest(p_target_exams) as exam;
 delete from public.user_exam_preferences where user_id=v_uid;
 insert into public.user_exam_preferences(user_id,exam) select v_uid,exam from unnest(v_exams) as exam;
 update public.profiles set full_name=coalesce(v_name,full_name),target_year=p_target_year,onboarding_completed=true,updated_at=now() where id=v_uid;
 return (select jsonb_build_object('id',p.id,'full_name',p.full_name,'target_year',p.target_year,'onboarding_completed',p.onboarding_completed,'target_exams',v_exams) from public.profiles p where p.id=v_uid);
end;$$;
revoke all on function dp_onboarding_private.save_preparation_profile(text,integer,text[],boolean) from public,anon,service_role;
grant execute on function dp_onboarding_private.save_preparation_profile(text,integer,text[],boolean) to authenticated;
create function public.complete_onboarding(p_full_name text,p_target_year integer,p_target_exams text[]) returns jsonb language sql security invoker set search_path='' as $$select dp_onboarding_private.save_preparation_profile(p_full_name,p_target_year,p_target_exams,true);$$;
create function public.update_preparation_profile(p_full_name text,p_target_year integer,p_target_exams text[]) returns jsonb language sql security invoker set search_path='' as $$select dp_onboarding_private.save_preparation_profile(p_full_name,p_target_year,p_target_exams,false);$$;
revoke all on function public.complete_onboarding(text,integer,text[]) from public,anon,service_role;
revoke all on function public.update_preparation_profile(text,integer,text[]) from public,anon,service_role;
grant execute on function public.complete_onboarding(text,integer,text[]) to authenticated;
grant execute on function public.update_preparation_profile(text,integer,text[]) to authenticated;
notify pgrst,'reload schema';
commit;