-- Staging-only: mirror the existing DP role immutability guard.
begin;
create function public.prevent_role_change() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if auth.role() = 'service_role' then return new; end if;
 if new.role is distinct from old.role then
  raise exception 'Role changes are not allowed.' using errcode='42501';
 end if;
 return new;
end;$$;
revoke all on function public.prevent_role_change() from public,anon,authenticated;
create trigger prevent_role_change_trigger before update on public.profiles for each row execute function public.prevent_role_change();
commit;