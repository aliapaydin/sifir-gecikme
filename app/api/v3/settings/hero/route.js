import { NextResponse } from 'next/server';
import { initDb, sql } from '../../../../../lib/v3/db';
import { getSession } from '../../../../../lib/v3/auth';

const DEFAULTS = {
  hero_title: 'Veriyi Anla,\nKararını Ver',
  hero_subtitle: 'İnteraktif demolar, gerçek veri analizleri ve AI destekli öğrenme ile veri bilimini sıfırdan ileri seviyeye öğren.',
  hero_animation: '1',
};

export async function GET() {
  try {
    await initDb();
    const rows = await sql`SELECT key, value FROM v3_settings WHERE key IN ('hero_title', 'hero_subtitle', 'hero_animation')`;
    const map = {};
    for (const row of rows) map[row.key] = row.value;
    return NextResponse.json({
      title:     map.hero_title     ?? DEFAULTS.hero_title,
      subtitle:  map.hero_subtitle  ?? DEFAULTS.hero_subtitle,
      animation: map.hero_animation ?? DEFAULTS.hero_animation,
    });
  } catch (err) {
    console.error('settings/hero GET error:', err);
    return NextResponse.json({
      title: DEFAULTS.hero_title,
      subtitle: DEFAULTS.hero_subtitle,
      animation: DEFAULTS.hero_animation,
    });
  }
}

export async function POST(request) {
  try {
    await initDb();
    const session = await getSession(request);
    if (!session)
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor.' }, { status: 401 });

    const [user] = await sql`SELECT role FROM v3_users WHERE id = ${session.userId}`;
    if (!user || user.role !== 'admin')
      return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });

    const { title, subtitle, animation } = await request.json();

    const updates = [];
    if (title     !== undefined) updates.push(['hero_title',     title]);
    if (subtitle  !== undefined) updates.push(['hero_subtitle',  subtitle]);
    if (animation !== undefined) updates.push(['hero_animation', String(animation)]);

    for (const [key, value] of updates) {
      await sql`
        INSERT INTO v3_settings (key, value, updated_at)
        VALUES (${key}, ${value}, NOW())
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
      `;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('settings/hero POST error:', err);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
