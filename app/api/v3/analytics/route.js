import { NextResponse } from 'next/server';
import { sql, initDb } from '../../../../lib/v3/db';

// GET /api/v3/analytics
// Tüm istatistikleri döner: trending, all-time, anladi, tekrar
export async function GET() {
  try {
    await initDb();

    const [weekly, allTime, topAnladi, topTekrar, summary] = await Promise.all([
      // Bu hafta trend (son 7 gün)
      sql`
        SELECT href, SUM(count)::int AS total
        FROM v3_content_views
        WHERE day >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY href
        ORDER BY total DESC
        LIMIT 15
      `,
      // Tüm zamanlar en çok görüntülenen
      sql`
        SELECT href, SUM(count)::int AS total
        FROM v3_content_views
        GROUP BY href
        ORDER BY total DESC
        LIMIT 15
      `,
      // En çok "Anladım" işaretlenen
      sql`
        SELECT href, COUNT(*)::int AS total
        FROM v3_content_marks
        WHERE mark = 'anladi'
        GROUP BY href
        ORDER BY total DESC
        LIMIT 15
      `,
      // En çok "Tekrar Bak" işaretlenen
      sql`
        SELECT href, COUNT(*)::int AS total
        FROM v3_content_marks
        WHERE mark = 'tekrar'
        GROUP BY href
        ORDER BY total DESC
        LIMIT 15
      `,
      // Özet sayılar
      sql`
        SELECT
          (SELECT COALESCE(SUM(count), 0) FROM v3_content_views)::int                  AS total_views,
          (SELECT COALESCE(SUM(count), 0) FROM v3_content_views
           WHERE day >= CURRENT_DATE - INTERVAL '7 days')::int                         AS weekly_views,
          (SELECT COUNT(DISTINCT href) FROM v3_content_views)::int                     AS unique_content,
          (SELECT COUNT(*) FROM v3_content_marks WHERE mark = 'anladi')::int           AS total_anladi,
          (SELECT COUNT(*) FROM v3_content_marks WHERE mark = 'tekrar')::int           AS total_tekrar,
          (SELECT COUNT(DISTINCT user_id) FROM v3_content_marks)::int                  AS active_users
      `,
    ]);

    return NextResponse.json({
      summary: summary[0],
      weekly,
      allTime,
      topAnladi,
      topTekrar,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('analytics GET error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
