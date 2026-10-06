-- Additive: existing question IDs, attempts and scores are preserved.
create schema if not exists dp_content_private;
revoke all on schema dp_content_private from public, anon, authenticated;
grant usage on schema dp_content_private to service_role;

alter table public.questions
 add column content_status text not null default 'UNCHECKED'
 check (content_status in ('UNCHECKED','SOURCE_MATCHED','WITHHELD')),
 add column content_version integer not null default 1 check (content_version > 0);
alter table public.user_attempts add column content_version integer;

create table dp_content_private.snapshots (
 batch_id text not null, question_id text not null, row_data jsonb not null,
 captured_at timestamptz not null default now(), primary key(batch_id,question_id)
);
insert into dp_content_private.snapshots(batch_id,question_id,row_data)
 select '20261006_baseline',question_id,to_jsonb(q) from public.questions q;
create table dp_content_private.revisions (
 id bigint generated always as identity primary key,
 question_id text not null, before_row jsonb not null, after_row jsonb not null,
 evidence text, changed_at timestamptz not null default now(), actor text not null default current_user
);
create table dp_content_private.review_queue (
 question_id text primary key, severity text not null, reason text not null,
 state text not null default 'OPEN' check (state in ('OPEN','RESOLVED')),
 evidence jsonb, updated_at timestamptz not null default now()
);
alter table dp_content_private.snapshots enable row level security;
alter table dp_content_private.revisions enable row level security;
alter table dp_content_private.review_queue enable row level security;
grant select,insert,update on all tables in schema dp_content_private to service_role;
grant usage,select on all sequences in schema dp_content_private to service_role;

create function public.dp_content_is_eligible(stem text,a text,b text,c text,d text,answer text,status text)
returns boolean language sql immutable security invoker set search_path='' as $$
 select coalesce(status <> 'WITHHELD' and upper(btrim(answer)) in ('A','B','C','D')
 and not exists (select 1 from unnest(array[stem,a,b,c,d]) v
   where v is null or btrim(v) = '' or v ~* '#(ERROR!|REF!|VALUE!|DIV/0!|N/A|NAME[?]|NUM!|NULL!)')
 and (select count(distinct lower(btrim(v))) from unnest(array[a,b,c,d]) v)=4,false)
$$;

create function dp_content_private.track_revision() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 if (to_jsonb(new) - array['content_version','updated_at','content_hash','dataset_version','source_version'])
    is distinct from (to_jsonb(old) - array['content_version','updated_at','content_hash','dataset_version','source_version']) then
   if row(new.question,new.opt_a,new.opt_b,new.opt_c,new.opt_d,new.final_opt,new.official_opt,new.explanation)
      is distinct from row(old.question,old.opt_a,old.opt_b,old.opt_c,old.opt_d,old.final_opt,old.official_opt,old.explanation) then
     new.content_version := old.content_version + 1;
     if coalesce(current_setting('dp.content_evidence',true),'') = '' and new.content_status <> 'WITHHELD' then
       new.content_status := 'UNCHECKED';
     end if;
   else
     new.content_version := old.content_version;
   end if;
   insert into dp_content_private.revisions(question_id,before_row,after_row,evidence,actor)
   values(old.question_id,to_jsonb(old),to_jsonb(new),nullif(current_setting('dp.content_evidence',true),''),session_user);
 else
   new.content_version := old.content_version;
 end if;
 return new;
end $$;
revoke all on function dp_content_private.track_revision() from public,anon,authenticated;
create trigger dp_content_revision before update on public.questions
 for each row execute function dp_content_private.track_revision();

-- Append columns without changing the established v2 column order or joins.
do $$ declare definition text; begin
 select pg_get_viewdef('public.v_dp_question_intelligence_v2'::regclass,true) into definition;
 if position('FROM questions q' in definition)=0 then raise exception 'Unexpected v2 view definition'; end if;
 definition := replace(definition,'FROM questions q',
 ', q.content_status, q.content_version,
 public.dp_content_is_eligible(q.question,q.opt_a,q.opt_b,q.opt_c,q.opt_d,q.final_opt,q.content_status) AS content_eligible FROM questions q');
 execute 'create or replace view public.v_dp_question_intelligence_v2 with (security_invoker=true) as ' || definition;
end $$;
