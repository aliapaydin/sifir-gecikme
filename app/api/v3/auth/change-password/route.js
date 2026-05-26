import { NextResponse } from 'next/server';
import { sql } from '../../../../../lib/v3/db';
import { getSession, verifyPassword, hashPassword } from '../../../../../lib/v3/auth';

export async function POST(request) {
  try {
    const session = await getSession(request);
    if (!session)
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor.' }, { status: 401 });

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword)
      return NextResponse.json({ error: 'Tüm alanlar gereklidir.' }, { status: 400 });
    if (newPassword.length < 8)
      return NextResponse.json({ error: 'Yeni şifre en az 8 karakter olmalıdır.' }, { status: 400 });

    const [user] = await sql`SELECT password_hash FROM v3_users WHERE id = ${session.userId}`;
    if (!user)
      return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });

    const valid = await verifyPassword(currentPassword, user.password_hash);
    if (!valid)
      return NextResponse.json({ error: 'Mevcut şifre hatalı.' }, { status: 400 });

    const newHash = await hashPassword(newPassword);
    await sql`UPDATE v3_users SET password_hash = ${newHash} WHERE id = ${session.userId}`;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Change password error:', err);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
