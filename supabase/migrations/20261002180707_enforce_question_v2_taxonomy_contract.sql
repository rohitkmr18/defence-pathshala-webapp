create or replace function public.validate_question_taxonomy_contract()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.subtopic ~ '^\s*\d+(\.\d+)+\s+' then
    raise exception 'Legacy numbered subtopic is not allowed: %', new.subtopic;
  end if;
  if new.theme ~ '^\s*\d+(\.\d+)+\s+' then
    raise exception 'Legacy numbered theme is not allowed: %', new.theme;
  end if;
  if new.q_pattern is not null and btrim(new.q_pattern) <> '' and not exists (
    select 1 from public.dp_pattern_dictionary d
    where d.display_label = btrim(new.q_pattern) and d.active
  ) then
    raise exception 'Invalid q_pattern display label: %', new.q_pattern;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_validate_question_taxonomy_contract on public.questions;
create trigger trg_validate_question_taxonomy_contract
before insert or update of subtopic, theme, q_pattern
on public.questions
for each row execute function public.validate_question_taxonomy_contract();

create index if not exists idx_dp_pattern_dictionary_active
on public.dp_pattern_dictionary(active, pattern_id);
