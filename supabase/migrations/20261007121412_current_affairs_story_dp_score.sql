alter table public.current_affairs_stories
  add column if not exists dp_score smallint;

alter table public.current_affairs_stories
  drop constraint if exists current_affairs_stories_dp_score_check;

alter table public.current_affairs_stories
  add constraint current_affairs_stories_dp_score_check
  check (dp_score is null or dp_score between 0 and 100);

update public.current_affairs_stories s
set dp_score = v.score,
    updated_at = now()
from (values
  ('DRDO flight-tests indigenous High-Altitude Platform at 21 km'::text, 94::smallint),
  ('MoD signs ₹661.50 crore BrahMos systems contract for Indian Navy ships'::text, 92::smallint),
  ('Cabinet approves Integrated Transport & Logistics Authority'::text, 89::smallint),
  ('Cabinet approves ₹10,000 crore Government commitment to SME Growth Fund'::text, 87::smallint),
  ('World Bank projects India to grow 7.1% in FY27'::text, 84::smallint)
) as v(headline,score)
where s.headline=v.headline
  and s.post_id=(select id from public.current_affairs_posts where date='2026-10-07');
