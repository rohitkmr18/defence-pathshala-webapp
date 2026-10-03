-- Fresh disposable database reconstruction only. Never apply to production.

-- Captured production prerequisites on 2026-10-03; no learner rows included.

create table public.profiles (
  id uuid not null,
  full_name text,
  role text not null default 'student'::text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  target_year integer,
  onboarding_completed boolean not null default false,
  constraint profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE,
  constraint profiles_pkey PRIMARY KEY (id),
  constraint profiles_role_check CHECK ((role = ANY (ARRAY['student'::text, 'admin'::text])))
);

alter table public.profiles enable row level security;

create table public.user_exam_preferences (
  user_id uuid not null,
  exam text not null,
  created_at timestamp with time zone not null default now(),
  constraint user_exam_preferences_pkey PRIMARY KEY (user_id, exam),
  constraint user_exam_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
  constraint valid_exam CHECK ((exam = ANY (ARRAY['CDS'::text, 'CAPF-AC'::text, 'NDA'::text, 'AFCAT'::text, 'UPSC-CSE'::text])))
);

alter table public.user_exam_preferences enable row level security;

create table public.current_affairs_posts (
  id uuid not null default gen_random_uuid(),
  date date not null,
  title text not null,
  slug text not null,
  summary text,
  total_stories integer default 0,
  total_slides integer default 0,
  published boolean default false,
  created_at timestamp with time zone default now(),
  constraint current_affairs_posts_date_key UNIQUE (date),
  constraint current_affairs_posts_pkey PRIMARY KEY (id),
  constraint current_affairs_posts_slug_key UNIQUE (slug)
);

alter table public.current_affairs_posts enable row level security;

create table public.current_affairs_stories (
  id uuid not null default gen_random_uuid(),
  post_id uuid not null,
  story_number integer not null,
  headline text not null,
  summary text,
  category text,
  subject text,
  topic text,
  subtopic text,
  theme text,
  exam_relevance text,
  future_angle text,
  keywords text[],
  created_at timestamp with time zone default now(),
  constraint current_affairs_stories_pkey PRIMARY KEY (id),
  constraint current_affairs_stories_post_id_fkey FOREIGN KEY (post_id) REFERENCES current_affairs_posts(id) ON DELETE CASCADE
);

alter table public.current_affairs_stories enable row level security;

create table public.current_affairs_slides (
  id uuid not null default gen_random_uuid(),
  story_id uuid not null,
  slide_number integer not null,
  image_url text not null,
  created_at timestamp with time zone default now(),
  constraint current_affairs_slides_pkey PRIMARY KEY (id),
  constraint current_affairs_slides_story_id_fkey FOREIGN KEY (story_id) REFERENCES current_affairs_stories(id) ON DELETE CASCADE
);

alter table public.current_affairs_slides enable row level security;

create table public.current_affairs_mcqs (
  id uuid not null default gen_random_uuid(),
  story_id uuid not null,
  question text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option character(1),
  explanation text,
  difficulty text,
  created_at timestamp with time zone default now(),
  constraint current_affairs_mcqs_pkey PRIMARY KEY (id),
  constraint current_affairs_mcqs_story_id_fkey FOREIGN KEY (story_id) REFERENCES current_affairs_stories(id) ON DELETE CASCADE
);

alter table public.current_affairs_mcqs enable row level security;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
    insert into public.profiles (id, full_name)
    values (
        new.id,
        coalesce(new.raw_user_meta_data ->> 'full_name', '')
    );

    return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.prevent_role_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
    -- Allow backend/service-role operations.
    if auth.role() = 'service_role' then
        return new;
    end if;

    -- Prevent authenticated users from changing their own role.
    if new.role <> old.role then
        raise exception 'Role changes are not allowed.';
    end if;

    return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
    new.updated_at = now();
    return new;
end;
$function$;

CREATE TRIGGER prevent_role_change_trigger BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION prevent_role_change();

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

create policy "Authenticated manage mcqs" on public.current_affairs_mcqs for ALL to authenticated using ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND (p.role = 'admin'::text))))) with check ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND (p.role = 'admin'::text)))));

create policy "Authenticated manage posts" on public.current_affairs_posts for ALL to authenticated using ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND (p.role = 'admin'::text))))) with check ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND (p.role = 'admin'::text)))));

create policy "Read published posts" on public.current_affairs_posts for SELECT to public using ((published = true));

create policy "Authenticated manage slides" on public.current_affairs_slides for ALL to authenticated using ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND (p.role = 'admin'::text))))) with check ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND (p.role = 'admin'::text)))));

create policy "Read published slides" on public.current_affairs_slides for SELECT to public using ((EXISTS ( SELECT 1
   FROM (current_affairs_stories s
     JOIN current_affairs_posts p ON ((p.id = s.post_id)))
  WHERE ((s.id = current_affairs_slides.story_id) AND (p.published = true)))));

create policy "Authenticated manage stories" on public.current_affairs_stories for ALL to authenticated using ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND (p.role = 'admin'::text))))) with check ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND (p.role = 'admin'::text)))));

create policy "Read published stories" on public.current_affairs_stories for SELECT to public using ((EXISTS ( SELECT 1
   FROM current_affairs_posts p
  WHERE ((p.id = current_affairs_stories.post_id) AND (p.published = true)))));

create policy "Users can update own profile" on public.profiles for UPDATE to authenticated using ((( SELECT auth.uid() AS uid) = id)) with check ((( SELECT auth.uid() AS uid) = id));

create policy "Users can view own profile" on public.profiles for SELECT to authenticated using ((( SELECT auth.uid() AS uid) = id));

create policy "Users can delete own exam preferences" on public.user_exam_preferences for DELETE to authenticated using ((( SELECT auth.uid() AS uid) = user_id));

create policy "Users can insert own exam preferences" on public.user_exam_preferences for INSERT to authenticated with check ((( SELECT auth.uid() AS uid) = user_id));

create policy "Users can read own exam preferences" on public.user_exam_preferences for SELECT to authenticated using ((( SELECT auth.uid() AS uid) = user_id));

alter table public.questions alter column tags type text[] using case when tags is null then null else array[tags] end;

alter table public.questions add column content_hash text, add column is_active boolean default true, add column updated_at timestamptz default now(), add column dataset_version text, add column source_version text;

CREATE INDEX IF NOT EXISTS idx_ca_mcqs_story ON public.current_affairs_mcqs USING btree (story_id);

CREATE INDEX IF NOT EXISTS idx_ca_posts_date ON public.current_affairs_posts USING btree (date DESC);

CREATE INDEX IF NOT EXISTS idx_ca_slides_story ON public.current_affairs_slides USING btree (story_id);

CREATE INDEX IF NOT EXISTS idx_ca_stories_theme ON public.current_affairs_stories USING btree (theme);

CREATE INDEX IF NOT EXISTS idx_ca_stories_topic ON public.current_affairs_stories USING btree (topic);

CREATE INDEX IF NOT EXISTS idx_ca_stories_post ON public.current_affairs_stories USING btree (post_id);

CREATE INDEX IF NOT EXISTS idx_questions_exam_year ON public.questions USING btree (exam, year);

CREATE INDEX IF NOT EXISTS idx_questions_exam_cycle_year ON public.questions USING btree (exam, cycle, year);

CREATE INDEX IF NOT EXISTS idx_questions_subject_topic ON public.questions USING btree (subject, topic);

CREATE INDEX IF NOT EXISTS idx_questions_topic_subtopic ON public.questions USING btree (topic, subtopic);

CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON public.questions USING btree (difficulty_score);

CREATE INDEX IF NOT EXISTS idx_questions_pattern ON public.questions USING btree (q_pattern);

CREATE INDEX IF NOT EXISTS idx_questions_verified ON public.questions USING btree (verified_status);

CREATE INDEX IF NOT EXISTS idx_questions_content_hash ON public.questions USING btree (content_hash);

CREATE INDEX IF NOT EXISTS idx_user_exam_preferences_user_id ON public.user_exam_preferences USING btree (user_id);

CREATE INDEX IF NOT EXISTS idx_user_exam_preferences_exam ON public.user_exam_preferences USING btree (exam);



create table public.questions_backup_cleanup_20261002 (like public.questions including defaults);

alter table public.questions_backup_cleanup_20261002 enable row level security;

create policy "Public can view CA slides" on storage.objects for select using (bucket_id = 'current-affairs');

create policy "Authenticated can upload CA slides" on storage.objects for insert to authenticated with check (bucket_id = 'current-affairs' and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

create policy "Authenticated can update CA slides" on storage.objects for update to authenticated using (bucket_id = 'current-affairs' and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')) with check (bucket_id = 'current-affairs' and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

create policy "Authenticated can delete CA slides" on storage.objects for delete to authenticated using (bucket_id = 'current-affairs' and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
