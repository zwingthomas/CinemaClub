import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { createCheckoutSession, fetchMovie } from '../services/api.js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function MoviePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    fetchMovie(slug)
      .then((res) => setMovie(res.movie))
      .catch(() => setError('Unable to load this film right now.'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleStartCheckout = () => {
    if (!email) {
      setError('Add your email so we can confirm access.');
      return;
    }
    setError('');
    setShowCheckout(true);
  };

  const fetchClientSecret = useCallback(() => {
    return createCheckoutSession(movie.id, email).then((res) => res.clientSecret);
  }, [movie, email]);

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
          <div className="purchase-box">
            {!showCheckout ? (
              <>
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
                  <button className="button primary" onClick={handleStartCheckout}>
                    Rent Now
                  </button>
                </div>
                {error && <p className="error">{error}</p>}
                <button className="button ghost" onClick={() => navigate(-1)}>Back to collection</button>
              </>
            ) : (
              <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            )}
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
