import { seedSampleMovies } from './clients/supabase.js';

console.log('Seeding sample movies...');

try {
  await seedSampleMovies();
  console.log('Done!');
  process.exit(0);
} catch (error) {
  console.error('Seed failed:', error.message);
  process.exit(1);
}
