
import { defineConfig } from 'drizzle-kit';
import type { Config } from 'drizzle-kit';

// Support both local SQLite files and Turso remote databases
const dbUrl = process.env.TURSO_CONNECTION_URL || 'file:./local.db';
const isLocalFile = dbUrl.startsWith('file:');

const dbConfig: Config = defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: isLocalFile ? 'sqlite' : 'turso',
  dbCredentials: {
    url: dbUrl,
    ...(isLocalFile ? {} : { authToken: process.env.TURSO_AUTH_TOKEN! }),
  },
});

export default dbConfig;