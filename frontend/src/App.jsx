import { Link, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import MoviePage from './pages/MoviePage.jsx';
import WatchPage from './pages/WatchPage.jsx';
import './App.css';

function NavBar() {
  const location = useLocation();

  return (
    <header className="nav-shell">
      <div className="nav-brand">
        <Link to="/" className="brand-mark">
          <span className="brand-dot" />
          <span>CinemaClub</span>
        </Link>
        <p className="brand-sub">Indie stories. Intimate screens.</p>
      </div>
      <nav className="nav-links">
        <Link className={location.pathname === '/' ? 'active' : ''} to="/">
          Now Showing
        </Link>
        <a href="#about">About</a>
        <a href="#collection">Collection</a>
      </nav>
    </header>
  );
}

function App() {
  return (
    <div className="page-shell">
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies/:slug" element={<MoviePage />} />
        <Route path="/watch/:movieId" element={<WatchPage />} />
      </Routes>
    </div>
  );
}

export default App;
