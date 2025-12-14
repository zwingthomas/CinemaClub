const rawBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

function normalizeApiBase(base) {
  try {
    const url = new URL(base);
    const pathname = url.pathname.replace(/\/+$/, '');
    url.pathname = pathname.endsWith('/api') ? pathname : `${pathname}/api`;
    return url.toString().replace(/\/+$/, '');
  } catch {
    const trimmed = base.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }
}

const API_BASE = normalizeApiBase(rawBase);

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

export async function checkPurchaseStatus(movieId, email) {
  const url = new URL(`${API_BASE}/movies/${movieId}/purchase-status`);
  if (email) url.searchParams.set('email', email);
  const res = await fetch(url.toString());
  return handleResponse(res);
}

export async function createCheckout(movieId, { email, successUrl, cancelUrl }) {
  const res = await fetch(`${API_BASE}/movies/${movieId}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, successUrl, cancelUrl }),
  });
  return handleResponse(res);
}

export async function fetchWatchData(movieId, { email, sessionId } = {}) {
  const url = new URL(`${API_BASE}/movies/${movieId}/watch`);
  if (email) url.searchParams.set('email', email);
  if (sessionId) url.searchParams.set('session_id', sessionId);
  const res = await fetch(url.toString());
  return handleResponse(res);
}

export async function startWatchSession(movieId, email) {
  const res = await fetch(`${API_BASE}/movies/${movieId}/start-watch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return handleResponse(res);
}
