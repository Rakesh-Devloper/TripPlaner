import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './app.js';
import db from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = process.env.PORT || 5001;

async function bootstrap() {
  await db.connect();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TripPlanner AI Backend] Server running on http://0.0.0.0:${PORT}`);
    console.log(`[TripPlanner AI Backend] API endpoints active at http://localhost:${PORT}/api`);
  });
}

bootstrap();
