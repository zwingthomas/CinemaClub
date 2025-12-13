import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCheckout, fetchMovie } from '../services/api.js';

function MoviePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchMovie(slug)
      .then((res) => setMovie(res.movie))
      .catch(() => setError('Unable to load this film right now.'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleCheckout = async () => {
    if (!email) {
      setError('Add your email so we can confirm access.');
      return;
    }
    if (!movie) return;
    setProcessing(true);
    setError('');
    try {
      const successUrl = `${window.location.origin}/watch/${movie.id}?email=${encodeURIComponent(email)}`;
      const cancelUrl = `${window.location.origin}/movies/${movie.slug}`;
      const res = await createCheckout(movie.id, { email, successUrl, cancelUrl });
      window.location.href = res.checkoutUrl;
    } catch (e) {
      setError('Checkout could not start. Try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <main className="page"><p className="muted">Loading film…</p></main>;
  if (error && !movie) return <main className="page"><p className="error">{error}</p></main>;

  return (
    <main className="page">
      <section className="movie-hero">
        <img src={movie.hero_image_url || movie.still_image_url} alt={movie.title} className="movie-hero-img" />
        <div className="movie-hero-overlay" />
        <div className="movie-hero-content">
          <p className="eyebrow">{movie.release_year} · {movie.runtime_minutes}m</p>
          <h1>{movie.title}</h1>
          <p className="lede">{movie.synopsis}</p>
          <div className="pill-row">
            {(movie.tags || []).map((tag) => (
              <span className="pill" key={tag}>{tag}</span>
            ))}
          </div>
          <div className="detail-grid">
            <div>
              <p className="meta-eyebrow">Director</p>
              <p className="meta-body">{movie.director || '—'}</p>
            </div>
            <div>
              <p className="meta-eyebrow">Cast</p>
              <p className="meta-body">{(movie.cast || []).join(', ') || '—'}</p>
            </div>
            <div>
              <p className="meta-eyebrow">Rating</p>
              <p className="meta-body">{movie.rating || 'Not rated'}</p>
            </div>
          </div>
          <div className="purchase-box">
            <div>
              <p className="meta-eyebrow">Stream access</p>
              <p className="price">${((movie.price_cents || 1200) / 100).toFixed(2)}</p>
            </div>
            <div className="checkout-row">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="button primary" onClick={handleCheckout} disabled={processing}>
                {processing ? 'Redirecting…' : 'Rent via Stripe'}
              </button>
            </div>
            {error && <p className="error">{error}</p>}
            <button className="button ghost" onClick={() => navigate(-1)}>Back to collection</button>
          </div>
        </div>
      </section>
      <section className="stills">
        {movie.still_image_url && <img src={movie.still_image_url} alt={`${movie.title} still`} />}
      </section>
    </main>
  );
}

export default MoviePage;
