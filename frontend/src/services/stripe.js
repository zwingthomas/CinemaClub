import { loadStripe } from '@stripe/stripe-js';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
let stripePromise;

function ensurePublishableKey() {
  if (!publishableKey) {
    throw new Error('Missing Stripe publishable key. Set VITE_STRIPE_PUBLISHABLE_KEY in the frontend environment.');
  }
  return publishableKey;
}

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(ensurePublishableKey());
  }
  return stripePromise;
}
