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

  // Tech Center oyun kayıtları (kullanıcı başına 1 satır)
  await sql`
    CREATE TABLE IF NOT EXISTS v3_tech_center_saves (
      user_id UUID PRIMARY KEY REFERENCES v3_users(id) ON DELETE CASCADE,
      state    JSONB NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // İçerik işaretlemeleri (anladım / tekrar bak)
  await sql`
    CREATE TABLE IF NOT EXISTS v3_content_marks (
      user_id UUID NOT NULL REFERENCES v3_users(id) ON DELETE CASCADE,
      href    TEXT NOT NULL,
      mark    TEXT NOT NULL CHECK (mark IN ('anladi','tekrar')),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (user_id, href)
    )
  `;

  // AI Tutor konuşma geçmişi
  await sql`
    CREATE TABLE IF NOT EXISTS v3_tutor_messages (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id    UUID NOT NULL REFERENCES v3_users(id) ON DELETE CASCADE,
      role       TEXT NOT NULL CHECK (role IN ('user','assistant')),
      content    TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS v3_tutor_messages_user_id_idx ON v3_tutor_messages(user_id, created_at)`;

  // Kullanıcı istatistikleri (key-value, her uygulama için)
  await sql`
    CREATE TABLE IF NOT EXISTS v3_user_stats (
      user_id    UUID NOT NULL REFERENCES v3_users(id) ON DELETE CASCADE,
      key        TEXT NOT NULL,
      value      TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (user_id, key)
    )
  `;
}
