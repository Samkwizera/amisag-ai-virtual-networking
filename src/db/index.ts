
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@/db/schema';

// Support both local SQLite files and Turso remote databases
const dbUrl = process.env.TURSO_CONNECTION_URL || 'file:./local.db';
const isLocalFile = dbUrl.startsWith('file:');

const client = createClient({
  url: dbUrl,
  ...(isLocalFile ? {} : { authToken: process.env.TURSO_AUTH_TOKEN! }),
});

export const db = drizzle(client, { schema });

export type Database = typeof db;