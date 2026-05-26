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

  // Patreon alanları (yoksa ekle)
  await sql`ALTER TABLE v3_users ADD COLUMN IF NOT EXISTS patreon_id TEXT`;
  await sql`ALTER TABLE v3_users ADD COLUMN IF NOT EXISTS patreon_name TEXT`;
  await sql`ALTER TABLE v3_users ADD COLUMN IF NOT EXISTS is_supporter BOOLEAN DEFAULT FALSE`;
  await sql`ALTER TABLE v3_users ADD COLUMN IF NOT EXISTS patron_status TEXT`;
  await sql`ALTER TABLE v3_users ADD COLUMN IF NOT EXISTS pledge_cents INTEGER DEFAULT 0`;
  await sql`ALTER TABLE v3_users ADD COLUMN IF NOT EXISTS lifetime_cents INTEGER DEFAULT 0`;
  await sql`ALTER TABLE v3_users ADD COLUMN IF NOT EXISTS patreon_access_token TEXT`;
  await sql`ALTER TABLE v3_users ADD COLUMN IF NOT EXISTS patreon_linked_at TIMESTAMPTZ`;

  // E-posta doğrulama + şifre sıfırlama alanları
  await sql`ALTER TABLE v3_users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE`;
  await sql`ALTER TABLE v3_users ADD COLUMN IF NOT EXISTS verification_token TEXT`;
  await sql`ALTER TABLE v3_users ADD COLUMN IF NOT EXISTS verification_token_expires TIMESTAMPTZ`;
  await sql`ALTER TABLE v3_users ADD COLUMN IF NOT EXISTS reset_token TEXT`;
  await sql`ALTER TABLE v3_users ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMPTZ`;

  // Site ayarları (hero metni, animasyon seçimi, vb.)
  await sql`
    CREATE TABLE IF NOT EXISTS v3_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}
