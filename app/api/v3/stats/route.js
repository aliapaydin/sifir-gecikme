import { NextResponse } from 'next/server';
import { sql, initDb } from '../../../../lib/v3/db';
import { getSession } from '../../../../lib/v3/auth';

// GET: Tüm istatistikleri getir
export async function GET(request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ stats: {} });

  await initDb();
  const rows = await sql`
    SELECT key, value FROM v3_user_stats WHERE user_id = ${session.userId}
  `;
  const stats = {};
  for (const row of rows) {
    try { stats[row.key] = JSON.parse(row.value); } catch { stats[row.key] = row.value; }
  }
  return NextResponse.json({ stats });
}

// POST: Tek bir istatistiği kaydet
// body: { key, value }
export async function POST(request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { key, value } = await request.json();
  if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 });

  await initDb();
  const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
  await sql`
    INSERT INTO v3_user_stats (user_id, key, value, updated_at)
    VALUES (${session.userId}, ${key}, ${valueStr}, NOW())
    ON CONFLICT (user_id, key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
  `;
  return NextResponse.json({ ok: true });
}

// PUT: Toplu sync (localStorage stats → DB)
// body: { stats: { [key]: value } }
export async function PUT(request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { stats } = await request.json();
  if (!stats || typeof stats !== 'object') {
    return NextResponse.json({ error: 'Invalid stats' }, { status: 400 });
  }

  await initDb();
  for (const [key, value] of Object.entries(stats)) {
    const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
    await sql`
      INSERT INTO v3_user_stats (user_id, key, value, updated_at)
      VALUES (${session.userId}, ${key}, ${valueStr}, NOW())
      ON CONFLICT (user_id, key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
    `;
  }
  return NextResponse.json({ ok: true, synced: Object.keys(stats).length });
}
