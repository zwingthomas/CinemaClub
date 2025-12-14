import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { checkPurchaseStatus, createCheckout, fetchMovie } from '../services/api.js';

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
      .then((res) => {
        setMovie(res.movie);
        setError('');
      })
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
      const status = await checkPurchaseStatus(movie.id, email);
      if (status?.purchased) {
        navigate(`/watch/${movie.id}?email=${encodeURIComponent(email)}`);
        return;
      }
    } catch (err) {
      setError('We could not verify your access. Please try again.');
      setProcessing(false);
      return;
    }
    try {
      const successUrl = `${window.location.origin}/watch/${movie.id}?email=${encodeURIComponent(email)}`;
      const cancelUrl = `${window.location.origin}/movies/${movie.slug}`;
      const res = await createCheckout(movie.id, { email, successUrl, cancelUrl });
      if (!res.checkoutUrl) throw new Error('Checkout URL missing');
      window.location.href = res.checkoutUrl;
    } catch (err) {
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
            <p className="muted">If you already rented recently, we will skip Stripe and take you straight to the stream.</p>
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
