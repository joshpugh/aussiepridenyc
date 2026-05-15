import { createClient, type Client } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

let _client: Client | null = null;
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getClient(): Client {
  if (_client) return _client;
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) throw new Error('TURSO_DATABASE_URL is not set');
  _client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
  return _client;
}

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_t, prop: string) {
    if (!_db) _db = drizzle(getClient(), { schema });
    const value = _db[prop as keyof typeof _db];
    return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(_db) : value;
  },
});

export { schema };
