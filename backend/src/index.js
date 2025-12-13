import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import moviesRouter from './routes/movies.js';
import { config } from './config.js';

const app = express();

app.use(helmet());
// Handle multiple allowed origins and skip checks for non-browser clients (no Origin header).
app.use(cors({
  credentials: true,
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    const normalizedOrigin = origin.replace(/\/+$/, '');
    const allowed = config.frontendOrigins.some((o) => o === normalizedOrigin);
    if (!allowed) {
      console.warn(`CORS blocked origin: ${origin}`);
    }
    return allowed ? callback(null, true) : callback(new Error('Not allowed by CORS'));
  },
}));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'cinemaclub-api' });
});

app.use('/api/movies', moviesRouter);

app.use((err, _req, res, _next) => {
  console.error('Unhandled error', err);
  res.status(500).json({ error: 'Server error' });
});

app.listen(config.port, () => {
  console.log(`API listening on http://0.0.0.0:${config.port}`);
});
