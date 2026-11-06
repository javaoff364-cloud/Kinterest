# Kinterest

A warm, modern visual discovery platform for exploring, saving, and organizing inspiring images.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Neon PostgreSQL for application data
- Neon Auth (Managed Better Auth) for accounts and sessions
- Unsplash, Pexels, and Pixabay provider adapters
- Vercel deployment

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `DATABASE_URL`, `NEON_AUTH_BASE_URL`, and `NEON_AUTH_COOKIE_SECRET` in `.env.local`. The Neon database schema is in `database/schema.sql`.

The app runs in demo mode without image-provider API keys, using curated sample photography. Add provider API keys to enable live image search.

## Authentication

Neon Auth handles sign-up, sign-in, and sessions. Email verification is disabled for this project. Passwords and sessions from the previous Supabase Auth project are not transferred; existing users need to create a new Kinterest account.

## Data access

Database access is server-side only. Protected API routes verify the Neon Auth session before reading or changing saved photos. Never expose `DATABASE_URL` or `NEON_AUTH_COOKIE_SECRET` to browser code.
