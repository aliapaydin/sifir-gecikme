import { NextResponse } from 'next/server';
import { initDb, sql } from '../../../../lib/v3/db';
import { getSession } from '../../../../lib/v3/auth';

const VALID = new Set(['light', 'dark', 'system']);

// PUT: Kullanıcının tema tercihini kaydet (light | dark | system)
export async function PUT(request) {
  try {
    const session = await getSession(request);
    if (!session)
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor.' }, { status: 401 });

    const { theme } = await request.json();
    if (!VALID.has(theme))
      return NextResponse.json({ error: 'Geçersiz tema.' }, { status: 400 });

    await initDb();
    await sql`UPDATE v3_users SET theme = ${theme} WHERE id = ${session.userId}`;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('theme PUT error:', err);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}

// POST: sendBeacon uyumu için (PUT ile aynı)
export { PUT as POST };
