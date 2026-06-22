import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

let db;
try {
  if (process.env.DATABASE_URL) {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    db = drizzle(pool, { schema });
    console.log('PostgreSQL database connection initialized.');
  } else {
    console.warn('DATABASE_URL not set. Database features will not work.');
  }
} catch (error) {
  console.error('Failed to initialize database connection:', error);
}

export { db };
