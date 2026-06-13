import { NextResponse } from 'next/server';
import { sql, initDb } from '../../../../lib/v3/db';

// POST /api/v3/views  { href }
// Günlük görüntülenme sayacını artır (anonim, auth gerekmez)
export async function POST(request) {
  try {
    const { href } = await request.json();
    if (!href || typeof href !== 'string' || href.length > 200) {
      return NextResponse.json({ error: 'Invalid href' }, { status: 400 });
    }

    await initDb();

    // Bugünkü satırı upsert et — count +1
    await sql`
      INSERT INTO v3_content_views (href, day, count)
      VALUES (${href}, CURRENT_DATE, 1)
      ON CONFLICT (href, day)
      DO UPDATE SET count = v3_content_views.count + 1
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('views POST error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
