import { NextResponse } from 'next/server';
import { getSession } from '@/lib/v3/auth';
import { sql } from '@/lib/v3/db';

export async function PATCH(request, { params }) {
  const session = await getSession(request);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  const { id } = await params;
  const { role } = await request.json();

  if (!['user', 'moderator', 'admin'].includes(role)) {
    return NextResponse.json({ error: 'Geçersiz rol' }, { status: 400 });
  }

  if (id === session.userId) {
    return NextResponse.json({ error: 'Kendi rolünü değiştiremezsin' }, { status: 400 });
  }

  const [updated] = await sql`
    UPDATE v3_users SET role = ${role} WHERE id = ${id}
    RETURNING id, name, role
  `;

  if (!updated) {
    return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
  }

  return NextResponse.json({ user: updated });
}

export async function DELETE(request, { params }) {
  const session = await getSession(request);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }

  const { id } = await params;

  if (id === session.userId) {
    return NextResponse.json({ error: 'Kendini silemezsin' }, { status: 400 });
  }

  await sql`DELETE FROM v3_users WHERE id = ${id}`;

  return NextResponse.json({ success: true });
}
