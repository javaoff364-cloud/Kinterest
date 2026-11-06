-- Kinterest Supabase schema. Apply once to a fresh project.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null default '',
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists public.saved_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  collection_id uuid references public.collections(id) on delete set null,
  provider text not null,
  provider_photo_id text not null,
  image_url text not null,
  thumb_url text not null,
  alt text not null default '',
  photographer text not null default '',
  source_url text not null,
  created_at timestamptz not null default now(),
  unique(user_id, provider, provider_photo_id)
);

alter table public.profiles enable row level security;
alter table public.collections enable row level security;
alter table public.saved_photos enable row level security;

create policy "Profiles are readable" on public.profiles
  for select to anon, authenticated using (true);
create policy "Users insert own profile" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);
create policy "Users update own profile" on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "Users delete own profile" on public.profiles
  for delete to authenticated using ((select auth.uid()) = id);

create policy "Public and own collections readable" on public.collections
  for select to anon, authenticated using (is_public or (select auth.uid()) = user_id);
create policy "Users create own collections" on public.collections
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users update own collections" on public.collections
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users delete own collections" on public.collections
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Users read own saved photos" on public.saved_photos
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users save own photos" on public.saved_photos
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users update own saved photos" on public.saved_photos
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users remove own saved photos" on public.saved_photos
  for delete to authenticated using ((select auth.uid()) = user_id);

-- This function is invoked only by the auth.users insert trigger.
revoke all on function public.handle_new_user() from public, anon, authenticated;