
-- DP intelligence contract hardening
-- Canonical difficulty boundary: 0-<25 Easy, 25-<50 Moderate, 50-100 Hard.

update public.questions
set difficulty_category = case
  when difficulty_score < 25 then 'Easy'
  when difficulty_score < 50 then 'Moderate'
  else 'Hard'
end
where difficulty_score is not null;

alter table public.questions
  drop constraint if exists questions_difficulty_category_check;

alter table public.questions
  add constraint questions_difficulty_category_check
  check (
    difficulty_score is null
    or (
      difficulty_score >= 0 and difficulty_score <= 100
      and difficulty_category =
        case
          when difficulty_score < 25 then 'Easy'
          when difficulty_score < 50 then 'Moderate'
          else 'Hard'
        end
    )
  );

