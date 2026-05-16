-- MFLH Collective — richer member profiles + avatar storage

alter table profiles add column if not exists first_name text;
alter table profiles add column if not exists last_name text;

-- Keep handle_new_user in sync: capture first/last from signup metadata
-- and compose sensible full_name / display_name defaults.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  fn text := coalesce(new.raw_user_meta_data->>'first_name', '');
  ln text := coalesce(new.raw_user_meta_data->>'last_name', '');
  composed text := trim(both ' ' from (fn || ' ' || ln));
begin
  insert into public.profiles (id, first_name, last_name, full_name, display_name)
  values (
    new.id,
    nullif(fn, ''),
    nullif(ln, ''),
    coalesce(
      nullif(new.raw_user_meta_data->>'full_name', ''),
      nullif(composed, ''),
      ''
    ),
    coalesce(
      nullif(new.raw_user_meta_data->>'display_name', ''),
      nullif(fn, ''),
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Avatar storage: public-read bucket, owner-scoped writes by uid folder.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "avatars public read" on storage.objects;
create policy "avatars public read" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "avatars owner insert" on storage.objects;
create policy "avatars owner insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars owner update" on storage.objects;
create policy "avatars owner update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars owner delete" on storage.objects;
create policy "avatars owner delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
