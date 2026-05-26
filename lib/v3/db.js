import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL);

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS v3_users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      avatar_color TEXT DEFAULT '#6366f1',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      last_login TIMESTAMPTZ
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS v3_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES v3_users(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}
