import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const requiredEnv = ['SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'STRIPE_SECRET_KEY'];
const missing = requiredEnv.filter((key) => !process.env[key]);

if (missing.length) {
  console.warn(`Missing env vars: ${missing.join(', ')}`);
}

export const config = {
  port: process.env.PORT || 4000,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseSecretKey: process.env.SUPABASE_SECRET_KEY,
  supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripePriceDefault: Number(process.env.STRIPE_PRICE_DEFAULT || 1200),
  stripeCurrency: process.env.STRIPE_CURRENCY || 'usd',
  muxTokenId: process.env.MUX_TOKEN_ID,
  muxTokenSecret: process.env.MUX_TOKEN_SECRET,
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
};
