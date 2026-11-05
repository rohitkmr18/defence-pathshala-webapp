-- Mirror of production public.questions (5 Nov 2026) for rehearsal
create schema if not exists dp_content_private;
create table public.questions (
 id uuid primary key default gen_random_uuid(), question_id text not null, exam text not null, year integer not null,
 cycle text, paper text, q_num integer not null, subject text not null, topic text not null, subtopic text, theme text,
 question text not null, opt_a text not null, opt_b text not null, opt_c text not null, opt_d text not null,
 q_type text, q_pattern text, llm_opt text, official_opt text, final_opt text, key_discrepancy boolean default false,
 explanation text, source text, is_negative boolean default true, tags text[], verified_status text, static_current_link text,
 difficulty_score numeric, difficulty_category text, created_at timestamptz default now(), content_hash text,
 is_active boolean default true, updated_at timestamptz default now(), dataset_version text, source_version text,
 content_status text not null default 'UNCHECKED', content_version integer not null default 1,
 constraint questions_question_id_unique unique (question_id),
 constraint questions_exam_year_qnum_unique unique (exam, year, cycle, q_num),
 constraint questions_content_status_check check (content_status = any (array['UNCHECKED','SOURCE_MATCHED','WITHHELD'])),
 constraint questions_content_version_check check (content_version > 0)
);
create table public.user_attempts (id bigserial primary key, question_id uuid references public.questions(id) on delete cascade);
create table public.dp_pattern_dictionary (pattern_id text primary key, display_label text, active boolean);
insert into public.dp_pattern_dictionary values ('PATTERN.DIRECT','Single MCQ',true);
create table dp_content_private.revisions (id bigserial primary key, question_id text not null, before_row jsonb not null,
 after_row jsonb not null, evidence text, changed_at timestamptz not null default now(), actor text not null default current_user);

create or replace function public.validate_question_taxonomy_contract() returns trigger language plpgsql set search_path = public as $$
begin
  if new.subtopic ~ '^\s*\d+(\.\d+)+\s+' then raise exception 'Legacy numbered subtopic is not allowed: %', new.subtopic; end if;
  if new.theme ~ '^\s*\d+(\.\d+)+\s+' then raise exception 'Legacy numbered theme is not allowed: %', new.theme; end if;
  if new.q_pattern is not null and btrim(new.q_pattern) <> '' and not exists (
    select 1 from public.dp_pattern_dictionary d where d.display_label = btrim(new.q_pattern) and d.active) then
    raise exception 'Invalid q_pattern display label: %', new.q_pattern; end if;
  return new;
end; $$;
create trigger trg_validate_question_taxonomy_contract before insert or update of subtopic, theme, q_pattern
 on public.questions for each row execute function public.validate_question_taxonomy_contract();

-- verbatim from production
CREATE OR REPLACE FUNCTION dp_content_private.track_revision() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $function$
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
end $function$;
CREATE TRIGGER dp_content_revision BEFORE UPDATE ON public.questions FOR EACH ROW EXECUTE FUNCTION dp_content_private.track_revision();
-- Supabase-like roles used by policies
do $$ begin if not exists (select 1 from pg_roles where rolname='anon') then create role anon; end if; end $$;
