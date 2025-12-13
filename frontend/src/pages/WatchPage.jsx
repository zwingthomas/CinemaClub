import { useEffect, useState, useRef } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import MuxPlayer from '@mux/mux-player-react';
import { fetchMovie, fetchWatchData, startWatchSession } from '../services/api.js';

function WatchPage() {
  const { movieId } = useParams();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [movie, setMovie] = useState(null);
  const [playbackId, setPlaybackId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const sessionStartedRef = useRef(false);

  useEffect(() => {
    fetchMovie(movieId)
      .then((res) => setMovie(res.movie))
      .catch(() => setError('Could not load this film.'));
  }, [movieId]);

  useEffect(() => {
    // If we have a session_id (just paid), verify it immediately
    if (sessionId) {
      setLoading(true);
      fetchWatchData(movieId, { sessionId })
        .then((res) => {
          setPlaybackId(res.playbackId);
          if (res.email) setEmail(res.email);
          setError('');
        })
        .catch(() => setError('We could not verify your payment.'))
        .finally(() => setLoading(false));
      return;
    }

    // Otherwise, check by email if provided
    if (!email) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchWatchData(movieId, { email })
      .then((res) => {
        setPlaybackId(res.playbackId);
        setError('');
      })
      .catch(() => setError('We could not verify your access.'))
      .finally(() => setLoading(false));
  }, [movieId, email, sessionId]);

  const handleAccess = () => {
    setLoading(true);
    fetchWatchData(movieId, { email })
      .then((res) => {
        setPlaybackId(res.playbackId);
        setError('');
      })
      .catch(() => setError('Access still not confirmed.'))
      .finally(() => setLoading(false));
  };

  const handlePlay = () => {
    if (sessionStartedRef.current) return;
    sessionStartedRef.current = true;

    const userEmail = email || searchParams.get('email');
    if (userEmail) {
      startWatchSession(movieId, userEmail).catch((err) => {
        console.error('Failed to start watch session:', err);
      });
    }
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
            onPlay={handlePlay}
          />
        )}
        {!loading && !playbackId && !error && <p className="muted">Enter your email to unlock the film.</p>}
      </div>
    </main>
  );
}

export default WatchPage;
