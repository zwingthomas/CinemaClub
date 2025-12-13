import Stripe from 'stripe';
import { config } from '../config.js';

if (!config.stripeSecretKey) {
  console.warn('Stripe is not configured. Set STRIPE_SECRET_KEY.');
}

export const stripe = new Stripe(config.stripeSecretKey || '', {
  apiVersion: '2024-06-20',
});
