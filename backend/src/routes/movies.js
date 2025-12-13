import express from 'express';
import { listMovies, getMovieBySlug, getMovieById, recordPurchase, hasPurchased, getPlaybackForMovie } from '../clients/supabase.js';
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

router.post('/:movieId/checkout', async (req, res) => {
  const { movieId } = req.params;
  const { email, successUrl, cancelUrl } = req.body;

  if (!stripe) return res.status(500).json({ error: 'Stripe not configured' });
  if (!email) return res.status(400).json({ error: 'Email required for checkout' });

  try {
    const movie = await getMovieById(movieId);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: movie.currency || config.stripeCurrency,
            product_data: {
              name: movie.title,
              description: movie.synopsis?.slice(0, 140),
            },
            unit_amount: movie.price_cents || config.stripePriceDefault,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl || `${config.frontendOrigin}/watch/${movie.id}?email=${encodeURIComponent(email)}`,
      cancel_url: cancelUrl || `${config.frontendOrigin}/movies/${movie.slug}`,
      metadata: { movieId: movie.id, slug: movie.slug },
    });

    await recordPurchase({
      movieId: movie.id,
      email,
      stripeSessionId: session.id,
      amount: movie.price_cents || config.stripePriceDefault,
      currency: movie.currency || config.stripeCurrency,
    });

    res.json({ checkoutUrl: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout', error);
    res.status(500).json({ error: 'Unable to create checkout session' });
  }
});

router.get('/:movieId/watch', async (req, res) => {
  const { movieId } = req.params;
  const { email } = req.query;
  try {
    const allowed = await hasPurchased({ movieId, email });
    if (!allowed) {
      return res.status(402).json({ error: 'Purchase required' });
    }

    const playbackId = await getPlaybackForMovie(movieId);
    if (!playbackId) return res.status(404).json({ error: 'Playback not found' });

    res.json({ playbackId, muxStreamUrl: `https://stream.mux.com/${playbackId}.m3u8` });
  } catch (error) {
    console.error('Error getting watch data', error);
    res.status(500).json({ error: 'Unable to load playback' });
  }
});

export default router;
