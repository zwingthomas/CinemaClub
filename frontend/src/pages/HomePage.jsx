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

  const gallery = useMemo(() => movies.filter((m) => m.id), [movies ]);

  return (
    <main>
      <section className="hero">
        <div className="hero-grid">
          <div>
            <p className="lede">
            Yeah, let's watch some movies
            </p>
            <div className="hero-cta">
              <Link to="#collection" className="button primary">Browse collection</Link>
            </div>
            <div className="stats">
              <div>
                <span className="stat-number">{movies.length || '—'}</span>
                <span className="stat-label">Titles live</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="collection" className="collection">
        <div className="section-heading">
          <div>
            <h3>Now Showing</h3>
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
    </main>
  );
}

export default HomePage;
