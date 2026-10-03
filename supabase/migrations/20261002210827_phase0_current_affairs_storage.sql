-- Preserve public image viewing; restrict editorial asset writes to protected admins.
alter policy "Authenticated can upload CA slides" on storage.objects
with check (bucket_id = 'current-affairs' and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
alter policy "Authenticated can update CA slides" on storage.objects
using (bucket_id = 'current-affairs' and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin')) with check (bucket_id = 'current-affairs' and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
alter policy "Authenticated can delete CA slides" on storage.objects
using (bucket_id = 'current-affairs' and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));
