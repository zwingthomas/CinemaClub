import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';

if (!config.supabaseUrl || !config.supabaseSecretKey) {
  console.warn('Supabase not fully configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY.');
}

const supabase = createClient(config.supabaseUrl || '', config.supabaseSecretKey || '');

export async function listMovies() {
  const { data, error } = await supabase
    .from('movies')
    .select('id, slug, title, synopsis, runtime_minutes, release_year, hero_image_url, still_image_url, price_cents, currency')
    .order('release_year', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getMovieById(movieId) {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('id', movieId)
    .single();

  if (error) throw error;
  return data;
}

export async function getMovieBySlug(slug) {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
}

export async function recordPurchase({ movieId, email, stripeSessionId, amount, currency, rentalLength, watchExpiration }) {
  const { error } = await supabase.from('purchases').upsert(
    {
      movie_id: movieId,
      email,
      stripe_session_id: stripeSessionId,
      amount,
      currency,
      rental_length: rentalLength,
      watch_experation: watchExpiration,
    },
    { onConflict: 'stripe_session_id' }
  );

  if (error) throw error;
}

export async function hasPurchased({ movieId, email }) {
  if (!email) return false;
  const { data, error } = await supabase
    .from('purchases')
    .select('id')
    .eq('movie_id', movieId)
    .eq('email', email)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
}

export async function getPlaybackForMovie(movieId) {
  const { data, error } = await supabase
    .from('movies')
    .select('mux_playback_id')
    .eq('id', movieId)
    .single();

  if (error) throw error;
  return data?.mux_playback_id;
}

export async function seedSampleMovies() {
  const now = new Date().toISOString();
  const { data, error } = await supabase.from('movies').upsert(
    [
      {
        id: '11111111-1111-1111-1111-111111111111',
        slug: 'the-last-reel',
        title: 'The Last Reel',
        synopsis: 'A projectionist fights to save an indie cinema on closing night.',
        runtime_minutes: 104,
        release_year: 2023,
        hero_image_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
        still_image_url: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1600&q=80',
        price_cents: 1200,
        currency: 'usd',
        mux_playback_id: 'your-mux-playback-id-1',
        created_at: now,
        updated_at: now,
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        slug: 'neon-silence',
        title: 'Neon Silence',
        synopsis: 'After a blackout, a city learns to listen before the lights return.',
        runtime_minutes: 92,
        release_year: 2024,
        hero_image_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
        still_image_url: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80',
        price_cents: 900,
        currency: 'usd',
        mux_playback_id: 'your-mux-playback-id-2',
        created_at: now,
        updated_at: now,
      },
    ],
    { onConflict: 'id' }
  );

  if (error) throw error;
  return data;
}
