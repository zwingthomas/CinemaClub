import express from 'express';
import {
  listMovies,
  getMovieBySlug,
  getMovieById,
  recordPurchase,
  getPlaybackForMovie,
  getValidPurchase,
} from '../clients/supabase.js';
import { stripe } from '../clients/stripe.js';
import { config } from '../config.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const movies = await listMovies();
    res.json({ movies });
  } catch (error) {
    console.error('Error listing movies', error);
    res.status(500).json({ error: 'Unable to load movies' });
  }
});

router.get('/:slugOrId', async (req, res) => {
  try {
    const { slugOrId } = req.params;
    let movie = null;
    if (slugOrId.includes('-')) {
      movie = await getMovieBySlug(slugOrId).catch(() => null);
    }
    if (!movie) {
      movie = await getMovieById(slugOrId);
    }
    res.json({ movie });
  } catch (error) {
    console.error('Error getting movie', error);
    res.status(404).json({ error: 'Movie not found' });
  }
});

router.get('/:movieId/purchase-status', async (req, res) => {
  const { movieId } = req.params;
  const { email } = req.query;

  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const purchase = await getValidPurchase({ movieId, email });
    if (!purchase) {
      return res.json({ purchased: false });
    }
    return res.json({ purchased: true, expiresAt: purchase.expires_at, purchasedAt: purchase.created_at });
  } catch (error) {
    console.error('Error checking purchase status', error);
    return res.status(500).json({ error: 'Unable to verify purchase' });
  }
});

router.post('/:movieId/checkout', async (req, res) => {
  const { movieId } = req.params;
  const { email, successUrl, cancelUrl } = req.body;

  if (!stripe || !config.stripeSecretKey) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }
  if (!email) return res.status(400).json({ error: 'Email required for checkout' });

  try {
    const movie = await getMovieById(movieId);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    const baseOrigin = config.frontendOrigin?.startsWith('http')
      ? config.frontendOrigin
      : `https://${config.frontendOrigin}`;

    const amount = movie.price_cents || config.stripePriceDefault;
    const currency = movie.currency || config.stripeCurrency;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      success_url: successUrl || `${baseOrigin}/watch/${movie.id}?email=${encodeURIComponent(email)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${baseOrigin}/movies/${movie.slug}`,
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: movie.title,
              description: movie.synopsis?.slice(0, 140),
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      return_url: `${baseOrigin}/watch/${movie.id}?session_id={CHECKOUT_SESSION_ID}`,
      metadata: { movieId: movie.id, slug: movie.slug, email },
    });

    await recordPurchase({
      movieId: movie.id,
      email,
      stripeSessionId: session.id,
      amount,
      currency,
    });

    res.json({ checkoutUrl: session.url, sessionId: session.id });
  } catch (error) {
    const message = error?.message || 'Unknown error';
    console.error('Error creating checkout session', {
      message,
      movieId,
      email,
      stack: error?.stack,
    });
    res.status(500).json({ error: 'Unable to create checkout session', detail: message });
  }
});

router.get('/:movieId/watch', async (req, res) => {
  const { movieId } = req.params;
  const { email } = req.query;
  try {
    const purchase = await getValidPurchase({ movieId, email });
    if (!purchase) {
      return res.status(402).json({ error: 'Purchase required or expired' });
    }

    const playbackId = await getPlaybackForMovie(movieId);
    if (!playbackId) return res.status(404).json({ error: 'Playback not found' });

    res.json({
      playbackId,
      muxStreamUrl: `https://stream.mux.com/${playbackId}.m3u8`,
      expiresAt: purchase.expires_at,
    });
  } catch (error) {
    console.error('Error getting watch data', error);
    res.status(500).json({ error: 'Unable to load playback' });
  }
});

export default router;
