-- Knowledge Hub schema candidate. NOT APPLIED to staging or production.
-- Create an actual timestamped migration with the Supabase CLI after staging review.
create table if not exists public.knowledge_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 120),
  title text not null check (length(trim(title)) between 10 and 180),
  description text not null check (length(trim(description)) between 40 and 320),
  category text not null,
  exam text,
  author_name text not null,
  reviewed_by text,
  status text not null default 'draft' check (status in ('draft','review','approved','published','archived')),
  blocks jsonb not null default '[]'::jsonb check (jsonb_typeof(blocks) = 'array'),
  sources jsonb not null default '[]'::jsonb check (jsonb_typeof(sources) = 'array'),
  related_practice_url text,
  image_url text,
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint published_requires_date check (status <> 'published' or published_at is not null)
);
create index if not exists knowledge_articles_public_idx
  on public.knowledge_articles (published_at desc)
  where status = 'published';

alter table public.knowledge_articles enable row level security;
revoke all on public.knowledge_articles from anon, authenticated;
grant select on public.knowledge_articles to anon, authenticated;

create policy "public can read live published knowledge"
on public.knowledge_articles for select to anon, authenticated
using (status = 'published' and published_at is not null and published_at <= now());

-- All writes are intentionally service-role-only at this stage.
-- Do not add authenticated INSERT/UPDATE/DELETE policies without a reviewed admin authorization design.
