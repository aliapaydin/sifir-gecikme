import { NextResponse } from 'next/server';
import { sql } from '../../../../../lib/v3/db';
import { verifyPassword, createSession } from '../../../../../lib/v3/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password)
      return NextResponse.json({ error: 'E-posta ve şifre gereklidir.' }, { status: 400 });

    const [user] = await sql`
      SELECT id, name, email, role, password_hash, email_verified
      FROM v3_users WHERE email = ${email.toLowerCase()}
    `;

    if (!user)
      return NextResponse.json({ error: 'E-posta veya şifre hatalı.' }, { status: 401 });

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid)
      return NextResponse.json({ error: 'E-posta veya şifre hatalı.' }, { status: 401 });

    if (!user.email_verified)
      return NextResponse.json({ error: 'E-posta adresin doğrulanmamış. Lütfen e-postanı kontrol et.', code: 'EMAIL_NOT_VERIFIED' }, { status: 403 });

    await sql`UPDATE v3_users SET last_login = NOW() WHERE id = ${user.id}`;
    await createSession(user.id);

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
