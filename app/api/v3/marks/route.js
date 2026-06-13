import { NextResponse } from 'next/server';
import { sql, initDb } from '../../../../lib/v3/db';
import { getSession } from '../../../../lib/v3/auth';

// GET: Tüm işaretlemeleri getir { [href]: 'anladi'|'tekrar' }
export async function GET(request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ marks: {} });

  await initDb();
  const rows = await sql`
    SELECT href, mark FROM v3_content_marks WHERE user_id = ${session.userId}
  `;
  const marks = {};
  for (const row of rows) marks[row.href] = row.mark;
  return NextResponse.json({ marks });
}

// POST: Tek bir işaretlemeyi kaydet/sil
// body: { href, mark } — mark null ise sil
export async function POST(request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { href, mark } = await request.json();
  if (!href) return NextResponse.json({ error: 'Missing href' }, { status: 400 });

  await initDb();

  if (!mark) {
    await sql`DELETE FROM v3_content_marks WHERE user_id = ${session.userId} AND href = ${href}`;
  } else {
    await sql`
      INSERT INTO v3_content_marks (user_id, href, mark, updated_at)
      VALUES (${session.userId}, ${href}, ${mark}, NOW())
      ON CONFLICT (user_id, href) DO UPDATE SET mark = EXCLUDED.mark, updated_at = NOW()
    `;
  }
  return NextResponse.json({ ok: true });
}

// PUT: Toplu sync (localStorage → DB)
// body: { marks: { [href]: 'anladi'|'tekrar' } }
export async function PUT(request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { marks } = await request.json();
  if (!marks || typeof marks !== 'object') {
    return NextResponse.json({ error: 'Invalid marks' }, { status: 400 });
  }

  await initDb();

  const entries = Object.entries(marks).filter(([, v]) => v === 'anladi' || v === 'tekrar');
  if (entries.length === 0) return NextResponse.json({ ok: true });

  for (const [href, mark] of entries) {
    await sql`
      INSERT INTO v3_content_marks (user_id, href, mark, updated_at)
      VALUES (${session.userId}, ${href}, ${mark}, NOW())
      ON CONFLICT (user_id, href) DO UPDATE SET mark = EXCLUDED.mark, updated_at = NOW()
    `;
  }
  return NextResponse.json({ ok: true, synced: entries.length });
}
