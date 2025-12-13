insert into public.movies (id, slug, title, synopsis, runtime_minutes, release_year, tags, director, cast, rating, hero_image_url, still_image_url, price_cents, currency, mux_playback_id, featured)
values
  ('11111111-1111-1111-1111-111111111111', 'the-last-reel', 'The Last Reel', 'A projectionist fights to save an indie cinema on closing night.', 104, 2023, '{drama,nostalgia}', 'R. Castillo', '{Mara Voss,Theo Park}', 'PG-13', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80', 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1600&q=80', 1200, 'usd', 'your-mux-playback-id-1', true)
  on conflict (id) do update set title = excluded.title;

insert into public.movies (id, slug, title, synopsis, runtime_minutes, release_year, tags, director, cast, rating, hero_image_url, still_image_url, price_cents, currency, mux_playback_id, featured)
values
  ('22222222-2222-2222-2222-222222222222', 'neon-silence', 'Neon Silence', 'After a blackout, a city learns to listen before the lights return.', 92, 2024, '{sci-fi,arthouse}', 'Kei Morita', '{Aria Chen,Jonas Reed}', 'PG', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80', 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80', 900, 'usd', 'your-mux-playback-id-2', false)
  on conflict (id) do update set title = excluded.title;
