import { NextResponse } from 'next/server';
import { initDb, sql } from '../../../../lib/v3/db';
import { getSession } from '../../../../lib/v3/auth';
import { isValidAccent } from '../../../../lib/v3/accent';

// PUT: Kullanıcının vurgu rengi tercihini kaydet (hazır renk id'si ya da #rrggbb)
export async function PUT(request) {
  try {
    const session = await getSession(request);
    if (!session)
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor.' }, { status: 401 });

    const { accent } = await request.json();
    if (!isValidAccent(accent))
      return NextResponse.json({ error: 'Geçersiz renk.' }, { status: 400 });

    await initDb();
    await sql`UPDATE v3_users SET accent = ${accent.toLowerCase()} WHERE id = ${session.userId}`;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('accent PUT error:', err);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}

// POST: sendBeacon uyumu için (PUT ile aynı)
export { PUT as POST };
