import { Link } from 'react-router-dom';

function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie.slug}`} className="movie-card">
      <div className="movie-thumb">
        <img src={movie.hero_image_url || movie.still_image_url} alt={movie.title} loading="lazy" />
        <div className="thumb-overlay" />
      </div>
      <div className="movie-meta">
        <div>
          <p className="meta-eyebrow">{movie.release_year} · {movie.runtime_minutes}m</p>
          <h3>{movie.title}</h3>
          <p className="meta-synopsis">{movie.synopsis}</p>
        </div>
        <div className="meta-footer">
          <span className="price">${((movie.price_cents || 1200) / 100).toFixed(2)}</span>
          <span className="cta">Details →</span>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
