-- ============================================================
-- Defence Pathshala
-- Migration 001: Create user profiles
-- ============================================================

create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,

    full_name text,

    role text not null default 'student'
        check (role in ('student', 'admin')),

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now()
);


-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles enable row level security;


-- Users can read their own profile.
create policy "Users can view own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);


-- Users can update their own profile.
create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);


-- ============================================================
-- Automatically create a profile when a user signs up.
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (id, full_name)
    values (
        new.id,
        coalesce(new.raw_user_meta_data ->> 'full_name', '')
    );

    return new;
end;
$$;


create trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute function public.handle_new_user();


-- ============================================================
-- Keep updated_at current.
-- ============================================================

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;


create trigger profiles_updated_at
    before update on public.profiles
    for each row
    execute function public.update_updated_at_column();