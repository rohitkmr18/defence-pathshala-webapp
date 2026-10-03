-- Trigger-only routines: keep required definer semantics, remove API execution.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.prevent_role_change() from public, anon, authenticated;
alter function public.handle_new_user() set search_path = '';
alter function public.prevent_role_change() set search_path = '';
alter function public.update_updated_at_column() set search_path = '';
alter policy "Users can view own profile" on public.profiles
using ((select auth.uid()) = id);
alter policy "Users can update own profile" on public.profiles
using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
alter policy "Users can read own exam preferences" on public.user_exam_preferences
to authenticated using ((select auth.uid()) = user_id);
alter policy "Users can insert own exam preferences" on public.user_exam_preferences
to authenticated with check ((select auth.uid()) = user_id);
alter policy "Users can delete own exam preferences" on public.user_exam_preferences
to authenticated using ((select auth.uid()) = user_id);
alter policy "Authenticated manage posts" on public.current_affairs_posts
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
alter policy "Authenticated manage stories" on public.current_affairs_stories
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
alter policy "Authenticated manage slides" on public.current_affairs_slides
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
alter policy "Authenticated manage mcqs" on public.current_affairs_mcqs
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
create index if not exists idx_ca_slides_story on public.current_affairs_slides(story_id);
create index if not exists idx_ca_stories_post on public.current_affairs_stories(post_id);
