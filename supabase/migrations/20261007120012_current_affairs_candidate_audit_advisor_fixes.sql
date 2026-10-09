
create index if not exists current_affairs_candidates_published_story_idx
  on public.current_affairs_candidates (published_story_id);

drop policy if exists "current affairs candidates admin access" on public.current_affairs_candidates;
create policy "current affairs candidates admin access"
on public.current_affairs_candidates
for all
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
