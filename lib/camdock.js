// Cam Dock anonim kullanım istatistiği.
//
// Yalnızca şunlar tutulur: rastgele kurulum kimliği (kişiye bağlanmaz),
// uygulama sürümü, Windows sürümü, ekran sayısı, açık widget'lar, ülke
// (Vercel'in IP'den bulduğu ülke kodu; IP adresinin kendisi saklanmaz),
// ilk/son görülme ve izin durumu. Kullanıcı iptal ederse gönderim durur;
// "verilerimi sil" derse kurulumun tüm satırları silinir.
import { sql } from '@/lib/v3/db';

let ready = false;

export async function ensureCamdockTables() {
  if (ready) return;
  await sql`
    CREATE TABLE IF NOT EXISTS camdock_installs (
      install_id     UUID PRIMARY KEY,
      first_seen     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_seen      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      version        TEXT,
      os             TEXT,
      monitors       INTEGER,
      widgets        TEXT[],
      country        TEXT,
      consent        BOOLEAN NOT NULL DEFAULT TRUE,
      revoked_at     TIMESTAMPTZ,
      uninstalled_at TIMESTAMPTZ
    )
  `;
  // Günlük aktif kurulum (kurulum başına günde 1 satır)
  await sql`
    CREATE TABLE IF NOT EXISTS camdock_daily (
      day        DATE NOT NULL,
      install_id UUID NOT NULL REFERENCES camdock_installs(install_id) ON DELETE CASCADE,
      version    TEXT,
      PRIMARY KEY (day, install_id)
    )
  `;
  // Olay günlüğü: install | revoke | uninstall | delete (silmede kimlik tutulmaz)
  await sql`
    CREATE TABLE IF NOT EXISTS camdock_events (
      id         BIGSERIAL PRIMARY KEY,
      install_id UUID REFERENCES camdock_installs(install_id) ON DELETE CASCADE,
      kind       TEXT NOT NULL,
      version    TEXT,
      at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS camdock_events_at ON camdock_events (at)`;
  ready = true;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isId = (s) => typeof s === 'string' && UUID_RE.test(s);
export const short = (s, n = 40) => (typeof s === 'string' ? s.slice(0, n) : null);
