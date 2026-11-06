-- Run this in the Supabase SQL editor after creating a project.
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
create policy "Profiles are readable" on public.profiles for select using (true);
create policy "Users manage own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "Public collections readable" on public.collections for select using (is_public or auth.uid() = user_id);
create policy "Users manage own collections" on public.collections for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own saved photos" on public.saved_photos for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
