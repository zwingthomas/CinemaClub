const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'API error');
  }
  return res.json();
}

export async function fetchMovies() {
  const res = await fetch(`${API_BASE}/movies`);
  return handleResponse(res);
}

export async function fetchMovie(slugOrId) {
  const res = await fetch(`${API_BASE}/movies/${slugOrId}`);
  return handleResponse(res);
}

export async function createCheckout(movieId, payload) {
  const res = await fetch(`${API_BASE}/movies/${movieId}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function fetchWatchData(movieId, email) {
  const url = new URL(`${API_BASE}/movies/${movieId}/watch`);
  if (email) url.searchParams.set('email', email);
  const res = await fetch(url.toString());
  return handleResponse(res);
}
