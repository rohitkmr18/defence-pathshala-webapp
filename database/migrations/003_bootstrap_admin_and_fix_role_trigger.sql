-- ============================================================
-- Defence Pathshala
-- Migration: 003_bootstrap_admin_and_fix_role_trigger.sql
--
-- 1. Drop old restrictive trigger on public.profiles.
-- 2. Bootstrap first admin (rohitcool423@gmail.com).
-- 3. Recreate safer prevent_role_change() function and trigger.
--    - Allows service_role and backend administrative operations.
--    - Prevents authenticated users from changing their own role.
-- ============================================================

-- 1. Drop old restrictive trigger if it exists
drop trigger if exists prevent_role_change_trigger on public.profiles;

-- 2. Bootstrap first admin
insert into public.profiles (id, role)
select id, 'admin'
from auth.users
where lower(email) = 'rohitcool423@gmail.com'
on conflict (id) do update
set role = 'admin',
    updated_at = now();

-- 3. Recreate safer prevent_role_change() function
-- Allows service_role operations, but prevents authenticated users from altering user roles.
create or replace function public.prevent_role_change()
returns trigger
language plpgsql
security definer
as $$
begin
    if new.role is distinct from old.role then
        if auth.role() = 'authenticated' then
            raise exception 'Role changes are not allowed.';
        end if;
    end if;

    return new;
end;
$$;

-- 4. Recreate the trigger on public.profiles
create trigger prevent_role_change_trigger
before update on public.profiles
for each row
execute function public.prevent_role_change();
