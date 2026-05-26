import { NextResponse } from 'next/server';
import { getSession } from '@/lib/v3/auth';
import { sql } from '@/lib/v3/db';

export async function GET(request) {
  const session = await getSession(request);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  const [userStats] = await sql`
    SELECT
      COUNT(*)                                                          AS total,
      COUNT(*) FILTER (WHERE role = 'admin')                           AS admin_count,
      COUNT(*) FILTER (WHERE role = 'moderator')                       AS mod_count,
      COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')  AS new_this_week
    FROM v3_users
  `;

  const [sessionStats] = await sql`
    SELECT COUNT(*) AS active_sessions
    FROM v3_sessions
    WHERE expires_at > NOW()
  `;

  return NextResponse.json({
    users: {
      total:       Number(userStats.total),
      admins:      Number(userStats.admin_count),
      moderators:  Number(userStats.mod_count),
      newThisWeek: Number(userStats.new_this_week),
    },
    activeSessions: Number(sessionStats.active_sessions),
  });
}
