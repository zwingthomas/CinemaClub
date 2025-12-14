# CinemaClub

CinemaClub is a dockerized starter for streaming indie films: a React frontend with a sense of place, a Node/Express API backed by Supabase Postgres for metadata, Stripe for payments, and Mux for playback.

## Stack
- React (Vite) + normal CSS for the aggregate, detail, and watch views
- Node + Express API with Supabase JS client
- Stripe Checkout for paid access
- Mux playback IDs stored per film
- Dockerfiles for frontend and backend; docker-compose to run both

## Local setup
1. Clone and install deps
   ```bash
   npm install --prefix backend
   npm install --prefix frontend
   ```
2. Configure Supabase/Stripe/Mux in `backend/.env` (copy from `.env.example`).
3. Run migrations + seed on your Supabase project (or via Supabase SQL editor):
   ```sql
   -- supabase/migrations/001_init.sql then supabase/seed/movies.sql
   ```
4. Frontend env: copy `frontend/.env.example` and set `VITE_API_BASE_URL` (e.g. `http://localhost:4000/api`).
5. Run services locally:
   ```bash
   npm run start --prefix backend
   npm run dev --prefix frontend
   ```

## Docker
- Build and run everything:
  ```bash
  docker-compose up --build
  ```
- Frontend will be at `http://localhost:5173`, backend at `http://localhost:4000`.
- `VITE_API_BASE_URL` is injected at build time for the frontend image (`http://backend:4000/api` via compose args).

## API (backend)
- `GET /api/movies` – list films
- `GET /api/movies/:slugOrId` – film detail
- `GET /api/movies/:movieId/purchase-status?email=` – check if the email has an active purchase (within the configured window)
- `POST /api/movies/:movieId/checkout` – create Stripe Checkout (body: `{ email, successUrl?, cancelUrl? }`)
- `GET /api/movies/:movieId/watch?email=` – verifies purchase and returns Mux playback id/URL

## Supabase schema
- `movies`: metadata, pricing, mux_playback_id, etc. Migration in `supabase/migrations/001_init.sql`.
- `purchases`: records Stripe session IDs + purchaser email for access checks.
- Sample rows in `supabase/seed/movies.sql`.

## Notes
- Keep the Supabase secret key server-side only (never expose to the frontend).
- Update `mux_playback_id` per film with the ID from your Mux asset.
- Stripe webhook handling is not included; the API records purchases optimistically when creating Checkout sessions.
- Configure the rental window via `PURCHASE_VALIDITY_HOURS` (defaults to 48); access checks only pass if a purchase was made within that window.
