import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import MoviePage from './pages/MoviePage.jsx';
import WatchPage from './pages/WatchPage.jsx';
import './App.css';

function App() {
  return (
    <div className="page-shell">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies/:slug" element={<MoviePage />} />
        <Route path="/watch/:movieId" element={<WatchPage />} />
      </Routes>
    </div>
  );
}

export default App;
