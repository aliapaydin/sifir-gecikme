import { NextResponse } from 'next/server';
import { sql } from '../../../../../lib/v3/db';
import { hashPassword } from '../../../../../lib/v3/auth';

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password)
      return NextResponse.json({ error: 'Gerekli alanlar eksik.' }, { status: 400 });
    if (password.length < 8)
      return NextResponse.json({ error: 'Şifre en az 8 karakter olmalıdır.' }, { status: 400 });

    const [user] = await sql`
      SELECT id FROM v3_users
      WHERE reset_token = ${token}
        AND reset_token_expires > NOW()
    `;

    if (!user)
      return NextResponse.json({ error: 'Link geçersiz veya süresi dolmuş.' }, { status: 400 });

    const passwordHash = await hashPassword(password);
    await sql`
      UPDATE v3_users SET
        password_hash = ${passwordHash},
        reset_token = NULL,
        reset_token_expires = NULL
      WHERE id = ${user.id}
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Reset password error:', err);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
