import { NextResponse } from 'next/server';
import { sql, initDb } from '../../../../lib/v3/db';
import { getSession } from '../../../../lib/v3/auth';

export async function GET(request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await initDb();
  const [row] = await sql`
    SELECT state, updated_at FROM v3_tech_center_saves WHERE user_id = ${session.userId}
  `;
  if (!row) return NextResponse.json({ state: null });
  return NextResponse.json({ state: row.state, updatedAt: row.updated_at });
}

export async function POST(request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { state } = await request.json();
  if (!state || typeof state !== 'object') {
    return NextResponse.json({ error: 'Invalid state' }, { status: 400 });
  }

  await initDb();
  await sql`
    INSERT INTO v3_tech_center_saves (user_id, state, updated_at)
    VALUES (${session.userId}, ${JSON.stringify(state)}, NOW())
    ON CONFLICT (user_id) DO UPDATE SET state = EXCLUDED.state, updated_at = NOW()
  `;
  return NextResponse.json({ ok: true });
}
