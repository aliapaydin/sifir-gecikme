import { NextResponse } from 'next/server';
import { getSession } from '@/lib/v3/auth';
import { sql } from '@/lib/v3/db';

export async function GET(request) {
  const session = await getSession(request);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  const users = await sql`
    SELECT id, email, name, role, avatar_color, created_at, last_login
    FROM v3_users
    ORDER BY created_at DESC
  `;

  return NextResponse.json({ users });
}
