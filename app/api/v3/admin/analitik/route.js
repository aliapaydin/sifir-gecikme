import { NextResponse } from 'next/server';
import { getSession } from '@/lib/v3/auth';
import { sql } from '@/lib/v3/db';

export async function GET(request) {
  const session = await getSession(request);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  // Günlük kayıt sayısı (son 30 gün)
  const dailySignups = await sql`
    SELECT
      DATE(created_at AT TIME ZONE 'UTC') AS day,
      COUNT(*) AS count
    FROM v3_users
    WHERE created_at > NOW() - INTERVAL '30 days'
    GROUP BY day
    ORDER BY day ASC
  `;

  // Rol dağılımı
  const roleDistribution = await sql`
    SELECT role, COUNT(*) AS count
    FROM v3_users
    GROUP BY role
    ORDER BY count DESC
  `;

  // Son kayıt olan 10 kullanıcı
  const recentUsers = await sql`
    SELECT id, name, email, role, avatar_color, created_at
    FROM v3_users
    ORDER BY created_at DESC
    LIMIT 10
  `;

  // Aktif oturum sayısı (son 24 saat içinde oluşturulmuş)
  const [{ active_today }] = await sql`
    SELECT COUNT(*) AS active_today
    FROM v3_sessions
    WHERE created_at > NOW() - INTERVAL '24 hours'
      AND expires_at > NOW()
  `;

  return NextResponse.json({
    dailySignups,
    roleDistribution,
    recentUsers,
    activeToday: Number(active_today),
  });
}
