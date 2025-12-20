import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMovies } from '../services/api.js';

// Get the next Thursday from a given date
function getNextThursday(fromDate) {
  const date = new Date(fromDate);
  const dayOfWeek = date.getDay();
  const daysUntilThursday = (4 - dayOfWeek + 7) % 7 || 7;
  date.setDate(date.getDate() + daysUntilThursday);
  return date;
}

// Generate array of next N Thursdays
function getUpcomingThursdays(count) {
  const thursdays = [];
  let current = new Date();

  for (let i = 0; i < count; i++) {
    current = getNextThursday(current);
    thursdays.push(new Date(current));
    current.setDate(current.getDate() + 1); // Move past this Thursday
  }

  return thursdays;
}

// Format date as "Mon D"
function formatDate(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

// Calculate days until a date
function daysUntil(date) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  return diff;
}

function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [infoOpen, setInfoOpen] = useState(false);

  useEffect(() => {
    fetchMovies()
      .then((res) => setMovies(res.movies || []))
      .catch(() => setError('Unable to load the collection right now.'))
      .finally(() => setLoading(false));
  }, []);

  // Create array of cells - movies first, then empty cells with Thursday countdowns
  const totalCells = 60;
  const cells = [];

  movies.forEach((movie) => {
    if (movie.id) {
      cells.push({ type: 'movie', movie });
    }
  });

  // Get upcoming Thursdays for empty cells
  const emptyCount = totalCells - cells.length;
  const thursdays = getUpcomingThursdays(emptyCount);

  // Fill remaining cells with Thursday countdowns
  thursdays.forEach((thursday, index) => {
    cells.push({
      type: 'countdown',
      id: `countdown-${index}`,
      date: thursday,
      daysLeft: daysUntil(thursday),
      formatted: formatDate(thursday)
    });
  });

  return (
    <>
      {/* SVG noise filter */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.4"
            numOctaves="2"
            stitchTiles="stitch"
            result="turbulence"
          >
            <animate
              attributeName="seed"
              from="0"
              to="100"
              dur="15s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feGaussianBlur in="turbulence" stdDeviation="0.5" result="blurred" />
          <feColorMatrix in="blurred" type="saturate" values="0" result="grayscale" />
          <feComposite operator="in" in="grayscale" in2="SourceAlpha" result="composite" />
          <feColorMatrix in="composite" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.6 0" result="faded" />
          <feBlend in="SourceGraphic" in2="faded" mode="multiply" />
        </filter>
      </svg>

      <main className="poster-grid-container">
        {loading && <p className="muted">Loading...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && (
          <div className="poster-grid">
            {cells.map((cell) => (
              cell.type === 'movie' ? (
                <Link
                  to={`/movies/${cell.movie.slug}`}
                  className="poster-item"
                  key={cell.movie.id}
                >
                  <img
                    src={cell.movie.hero_image_url || cell.movie.still_image_url}
                    alt={cell.movie.title}
                    loading="lazy"
                  />
                </Link>
              ) : (
                <div className="poster-item countdown" key={cell.id}>
                  <div className="countdown-content">
                    <span className="countdown-days">{cell.daysLeft}</span>
                    <span className="countdown-label">days</span>
                    <span className="countdown-date">{cell.formatted}</span>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </main>

      {/* Flower info trigger */}
      <div className="info-trigger" onClick={() => setInfoOpen(true)}>
        <img src="images/flowers.jpg" alt="Info" />
      </div>

      {/* Info modal */}
      {infoOpen && (
        <div className="info-modal" onClick={() => setInfoOpen(false)}>
          <div className="info-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="info-modal-close" onClick={() => setInfoOpen(false)}>
              &times;
            </button>
            <h2>Indigo Garden Cinema Club</h2>
            <p>Placeholder text about IGCC goes here. This is where you can describe what the cinema club is all about.</p>
          </div>
        </div>
      )}
    </>
  );
}

export default HomePage;
