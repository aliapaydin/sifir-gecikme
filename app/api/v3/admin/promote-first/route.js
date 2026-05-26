import { NextResponse } from 'next/server';
import { getSession } from '@/lib/v3/auth';
import { sql } from '@/lib/v3/db';

// İlk admin ataması — yalnızca 0 admin varken çalışır.
export async function POST(request) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Önce giriş yapman gerekiyor' }, { status: 401 });
  }

  const [{ count }] = await sql`SELECT COUNT(*) AS count FROM v3_users WHERE role = 'admin'`;

  if (Number(count) > 0) {
    return NextResponse.json(
      { error: 'Zaten bir admin var. Bu endpoint yalnızca ilk admin için çalışır.' },
      { status: 403 }
    );
  }

  const [updated] = await sql`
    UPDATE v3_users SET role = 'admin' WHERE id = ${session.userId}
    RETURNING id, name, email, role
  `;

  return NextResponse.json({
    success: true,
    user: updated,
    message: `${updated.name} artık admin!`,
  });
}
