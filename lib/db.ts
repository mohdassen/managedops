import postgres from 'postgres';

let client: ReturnType<typeof postgres> | null = null;

export function db() {
  if (!process.env.DATABASE_URL) return null;
  if (!client) client = postgres(process.env.DATABASE_URL, { ssl: 'require', max: 5 });
  return client;
}

export async function healthcheck() {
  const sql = db();
  if (!sql) return { connected: false, reason: 'DATABASE_URL not configured' };
  try {
    await sql`select 1`;
    return { connected: true };
  } catch (error) {
    return { connected: false, reason: error instanceof Error ? error.message : 'Database connection failed' };
  }
}
