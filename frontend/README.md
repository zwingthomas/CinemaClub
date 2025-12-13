# CinemaClub Frontend

React + Vite single-page app for CinemaClub. It renders:
- Aggregate view (grid of films)
- Detail view (pricing + synopsis + checkout entry)
- Watch view (Mux player after verifying purchase)

## Commands
```bash
npm install
npm run dev   # localhost:5173
npm run build
```

Set `VITE_API_BASE_URL` in `.env` to point at the backend (`http://localhost:4000/api` locally).
