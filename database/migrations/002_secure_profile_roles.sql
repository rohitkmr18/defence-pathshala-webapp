-- ============================================================
-- Defence Pathshala
-- Migration 002: Secure profile updates
-- ============================================================

-- Remove the previous broad update policy.
drop policy if exists "Users can update own profile" on public.profiles;

-- Users may update only their own profile.
create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Prevent role changes by ordinary users.
create or replace function public.prevent_role_change()
returns trigger
language plpgsql
as $$
begin
    if new.role <> old.role then
        raise exception 'Role changes are not allowed.';
    end if;

    return new;
end;
$$;

drop trigger if exists prevent_role_change_trigger on public.profiles;

create trigger prevent_role_change_trigger
before update on public.profiles
for each row
execute function public.prevent_role_change();