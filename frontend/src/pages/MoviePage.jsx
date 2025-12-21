import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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

  if (loading) return <main className="detail-page"><p className="muted">Loading film…</p></main>;
  if (error && !movie) return <main className="detail-page"><p className="error">{error}</p></main>;

  return (
    <main className="detail-page">
        <div className="detail-container">
          <Link to="/" className="back-link">← Back to collection</Link>

          <div className="detail-layout">
            <div className="detail-poster">
              <img src={movie.hero_image_url || movie.still_image_url} alt={movie.title} />
            </div>

            <div className="detail-info">
              <p className="detail-meta">{movie.release_year} · {movie.runtime_minutes} min</p>
              <h1>{movie.title}</h1>
              <p className="detail-synopsis">{movie.synopsis}</p>

              <div className="purchase-box">
                <div className="purchase-header">
                  <span className="purchase-label">Stream access</span>
                  <span className="purchase-price">${((movie.price_cents || 1200) / 100).toFixed(2)}</span>
                </div>
                <div className="purchase-form">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button className="btn-primary" onClick={handleCheckout} disabled={processing}>
                    {processing ? 'Redirecting…' : 'Rent via Stripe'}
                  </button>
                </div>
                <p className="purchase-note">If you already rented recently, we will skip Stripe and take you straight to the stream.</p>
                {error && <p className="error">{error}</p>}
              </div>
            </div>
          </div>

          {movie.still_image_url && (
            <div className="detail-still">
              <img src={movie.still_image_url} alt={`${movie.title} still`} />
            </div>
          )}
        </div>
      </main>
  );
}

export default MoviePage;
