import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard.jsx';
import { fetchMovies } from '../services/api.js';

function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMovies()
      .then((res) => setMovies(res.movies || []))
      .catch(() => setError('Unable to load the collection right now.'))
      .finally(() => setLoading(false));
  }, []);

  const featured = useMemo(() => movies.find((m) => m.featured) || movies[0], [movies]);
  const gallery = useMemo(() => movies.filter((m) => m.id !== featured?.id), [movies, featured]);

  return (
    <main>
      <section className="hero">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">Curated by CinemaClub</p>
            <h1>Indie premieres made streamable with reverence.</h1>
            <p className="lede">
              Pay once, watch in a setting that feels like the cinema: bold typography, cinematic pacing,
              and streams served by Mux. Supabase tracks every frame of metadata so your catalog stays sharp.
            </p>
            <div className="hero-cta">
              <Link to="#collection" className="button primary">Browse collection</Link>
              <a className="button ghost" href="#about">Why filmmakers trust us</a>
            </div>
            <div className="stats">
              <div>
                <span className="stat-number">{movies.length || '—'}</span>
                <span className="stat-label">Titles live</span>
              </div>
              <div>
                <span className="stat-number">4K</span>
                <span className="stat-label">Mux streams</span>
              </div>
              <div>
                <span className="stat-number">Stripe</span>
                <span className="stat-label">Checkout ready</span>
              </div>
            </div>
          </div>
          {featured && (
            <Link to={`/movies/${featured.slug}`} className="feature-card" aria-label={`View ${featured.title}`}>
              <img src={featured.hero_image_url || featured.still_image_url} alt={featured.title} />
              <div className="feature-overlay" />
              <div className="feature-content">
                <p className="eyebrow">Featured premiere</p>
                <h2>{featured.title}</h2>
                <p>{featured.synopsis}</p>
                <div className="pill-row">
                  {(featured.tags || []).map((tag) => (
                    <span className="pill" key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="feature-meta">
                  <span>{featured.release_year}</span>
                  <span>·</span>
                  <span>{featured.runtime_minutes} min</span>
                  <span>·</span>
                  <span>${((featured.price_cents || 1200) / 100).toFixed(2)}</span>
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>

      <section id="collection" className="collection">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Watchlist ready</p>
            <h3>Every film has a proper room to breathe.</h3>
          </div>
          <Link to="/" className="link subtle">View all →</Link>
        </div>
        {loading && <p className="muted">Loading curated titles…</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && (
          <div className="grid">
            {gallery.map((movie) => (
              <MovieCard movie={movie} key={movie.id} />
            ))}
          </div>
        )}
      </section>

      <section id="about" className="about">
        <div>
          <p className="eyebrow">Built for independents</p>
          <h3>Supabase-powered metadata, Mux delivery, and Stripe-backed access control.</h3>
          <p className="lede">
            Pair a modern Postgres core with cinema-grade streaming. Titles, pricing, and playback IDs live in Supabase;
            transactions run through Stripe; Mux keeps every frame smooth. All wrapped in a frontend that feels intentional.
          </p>
        </div>
        <div className="pill-stack">
          <span className="pill">Supabase Postgres</span>
          <span className="pill">Stripe Checkout</span>
          <span className="pill">Mux Playback</span>
          <span className="pill">Dockerized services</span>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
