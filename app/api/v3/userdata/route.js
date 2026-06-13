import { NextResponse } from 'next/server';
import { initDb, sql } from '../../../../lib/v3/db';
import { getSession } from '../../../../lib/v3/auth';

// Kullanıcının tüm site içi istatistik/ilerleme verisini (JSONB blob) okur.
export async function GET(request) {
  try {
    await initDb();
    const session = await getSession(request);
    if (!session)
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor.' }, { status: 401 });

    const [row] = await sql`SELECT data FROM v3_user_data WHERE user_id = ${session.userId}`;
    return NextResponse.json({ data: row?.data ?? {} });
  } catch (err) {
    console.error('userdata GET error:', err);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}

// Senkron anahtarların tam snapshot'ını kaydeder (upsert).
export async function PUT(request) {
  try {
    await initDb();
    const session = await getSession(request);
    if (!session)
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor.' }, { status: 401 });

    const body = await request.json();
    const data = body?.data;
    if (!data || typeof data !== 'object' || Array.isArray(data))
      return NextResponse.json({ error: 'Geçersiz veri.' }, { status: 400 });

    await sql`
      INSERT INTO v3_user_data (user_id, data, updated_at)
      VALUES (${session.userId}, ${JSON.stringify(data)}::jsonb, NOW())
      ON CONFLICT (user_id) DO UPDATE
        SET data = EXCLUDED.data, updated_at = NOW()
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('userdata PUT error:', err);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}

// POST: sendBeacon için (beforeunload'da kullanılır, PUT ile aynı)
export { PUT as POST };
