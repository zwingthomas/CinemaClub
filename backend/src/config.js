import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
const requiredEnv = ['SUPABASE_URL', 'STRIPE_SECRET_KEY'];

const missing = requiredEnv.filter((key) => !process.env[key]);
if (!supabaseKey) {
  missing.push('SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY');
}

if (missing.length) {
  console.warn(`Missing env vars: ${missing.join(', ')}`);
}

export const config = {
  port: process.env.PORT || 4000,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceKey: supabaseKey,
  supabaseSecretKey: supabaseKey,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripePriceDefault: Number(process.env.STRIPE_PRICE_DEFAULT || 1200),
  stripeCurrency: process.env.STRIPE_CURRENCY || 'usd',
  muxTokenId: process.env.MUX_TOKEN_ID,
  muxTokenSecret: process.env.MUX_TOKEN_SECRET,
  // Support a comma-separated list so staging/prod/frontends can all be allowed.
  frontendOrigins: (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((val) => val.trim().replace(/\/+$/, ''))
    .filter(Boolean),
};

// Primary frontend origin for redirects/return URLs (first in list).
config.frontendOrigin = config.frontendOrigins[0] || 'http://localhost:5173';
