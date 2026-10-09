
drop policy if exists "current affairs candidates admin access" on public.current_affairs_candidates;

create policy "current affairs candidates admin access"
on public.current_affairs_candidates
for all
to authenticated
using (
  coalesce(
    nullif(current_setting('request.jwt.claims', true), '')::jsonb
      -> 'app_metadata' ->> 'role',
    ''
  ) = 'admin'
)
with check (
  coalesce(
    nullif(current_setting('request.jwt.claims', true), '')::jsonb
      -> 'app_metadata' ->> 'role',
    ''
  ) = 'admin'
);
