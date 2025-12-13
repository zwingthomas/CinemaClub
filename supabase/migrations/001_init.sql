create extension if not exists "uuid-ossp";

create table if not exists public.movies (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  synopsis text,
  runtime_minutes integer,
  release_year integer,
  tags text[] default '{}',
  director text,
  cast text[],
  rating text,
  hero_image_url text,
  still_image_url text,
  price_cents integer default 1200,
  currency text default 'usd',
  mux_playback_id text,
  mux_asset_id text,
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.purchases (
  id uuid primary key default uuid_generate_v4(),
  movie_id uuid references public.movies(id) on delete cascade,
  email text not null,
  stripe_session_id text unique not null,
  amount integer,
  currency text,
  created_at timestamptz default now()
);

create index if not exists purchases_movie_email_idx on public.purchases (movie_id, email);
