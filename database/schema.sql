-- Kinterest application schema for Neon PostgreSQL.
-- Auth identities are owned by Neon Auth in neon_auth."user".
-- Application queries run on the server and must always scope rows by session user_id.

CREATE TABLE IF NOT EXISTS public.profiles (
  user_id uuid PRIMARY KEY REFERENCES neon_auth."user"(id) ON DELETE CASCADE,
  username text UNIQUE,
  display_name text NOT NULL DEFAULT '',
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES neon_auth."user"(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  is_public boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.saved_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES neon_auth."user"(id) ON DELETE CASCADE,
  collection_id uuid REFERENCES public.collections(id) ON DELETE SET NULL,
  provider text NOT NULL CHECK (provider IN ('unsplash', 'pexels', 'pixabay', 'demo')),
  provider_photo_id text NOT NULL,
  image_url text NOT NULL,
  thumb_url text NOT NULL,
  alt text NOT NULL DEFAULT '',
  photographer text NOT NULL DEFAULT '',
  source_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, provider, provider_photo_id)
);

CREATE INDEX IF NOT EXISTS collections_user_created_idx
  ON public.collections(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS saved_photos_user_created_idx
  ON public.saved_photos(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS saved_photos_collection_idx
  ON public.saved_photos(collection_id);
