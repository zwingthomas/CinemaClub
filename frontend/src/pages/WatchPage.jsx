import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import MuxPlayer from '@mux/mux-player-react';
import { fetchMovie, fetchWatchData } from '../services/api.js';

function WatchPage() {
  const { movieId } = useParams();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [movie, setMovie] = useState(null);
  const [playbackId, setPlaybackId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovie(movieId)
      .then((res) => setMovie(res.movie))
      .catch(() => setError('Could not load this film.'));
  }, [movieId]);

  useEffect(() => {
    if (!email) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchWatchData(movieId, email)
      .then((res) => {
        setPlaybackId(res.playbackId);
        setError('');
      })
      .catch(() => setError('We could not verify your access.'))
      .finally(() => setLoading(false));
  }, [movieId, email]);

  const handleAccess = () => {
    setLoading(true);
    fetchWatchData(movieId, email)
      .then((res) => {
        setPlaybackId(res.playbackId);
        setError('');
      })
      .catch(() => setError('Access still not confirmed.'))
      .finally(() => setLoading(false));
  };

  return (
    <main className="watch-page">
      <div className="watch-header">
        <div>
          <p className="eyebrow">Now screening</p>
          <h1>{movie?.title || 'CinemaClub screening room'}</h1>
          <p className="lede">Claim access with the email used at checkout. Your stream comes straight from Mux.</p>
          <div className="access-row">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="button primary" onClick={handleAccess} disabled={loading || !email}>
              {loading ? 'Checking…' : 'Unlock stream'}
            </button>
            <Link className="button ghost" to={movie ? `/movies/${movie.slug}` : '/'}>
              Back to details
            </Link>
          </div>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
      <div className="player-shell">
        {loading && <p className="muted">Preparing your stream…</p>}
        {!loading && playbackId && (
          <MuxPlayer
            streamType="on-demand"
            playbackId={playbackId}
            style={{ width: '100%', maxHeight: '70vh', borderRadius: '18px', overflow: 'hidden' }}
            accentColor="#ff775c"
          />
        )}
        {!loading && !playbackId && !error && <p className="muted">Enter your email to unlock the film.</p>}
      </div>
    </main>
  );
}

export default WatchPage;
