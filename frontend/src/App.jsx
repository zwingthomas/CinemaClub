import { Link, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import MoviePage from './pages/MoviePage.jsx';
import WatchPage from './pages/WatchPage.jsx';
import './App.css';

function NavBar() {
  const location = useLocation();

  return (
    <header className="nav-shell">
      <div className="header-container gradient">
        <div className="overlay">
          <main>
            <div className="design space-between">
              <img
                src="images/flowers.jpg"
                alt="logo"
                className="header-image"
              />

              <div className="center header-text">
                <h1>Indigo Garden Cinema Club</h1>
                <div className="design space-container">
                  <span>Surprise</span>
                  <hr />
                  <span>Films</span>
                  <hr />
                  <span>Every</span>
                </div>
                <div className="design space-container">
                  <span>Thursday</span>
                  <hr />
                  <span>7pm CST</span>
                </div>
                <div className="shapes">
                  <div className="oval">
                    <p>Directly</p>
                    <p>Support Artists</p>
                  </div>
                  <div className="square"><p>Be there or be square</p></div>
                </div>

                <div className="footer">
                  <h4>perennial films, always blooming.</h4>
                </div>
              </div>

              <img
                src="images/flowers.jpg"
                alt="logo"
                className="header-image"
              />
            </div>
          </main>
        </div>
    </div>
      
      {/* <div className="nav-brand">
        <Link to="/" className="brand-mark">
          <span className="brand-dot" />
          <span>CinemaClub</span>
        </Link>
      </div>
      <nav className="nav-links">
        <Link className={location.pathname === '/' ? 'active' : ''} to="/">
          Now Showing
        </Link>
        <a href="#about">About</a>
        <a href="#collection">Collection</a>
      </nav> */}
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
