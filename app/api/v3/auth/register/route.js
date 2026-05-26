import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { sql, initDb } from '../../../../../lib/v3/db';
import { hashPassword } from '../../../../../lib/v3/auth';
import { sendVerificationEmail } from '../../../../../lib/v3/email';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !name.trim())
      return NextResponse.json({ error: 'İsim gereklidir.' }, { status: 400 });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ error: 'Geçerli bir e-posta adresi giriniz.' }, { status: 400 });
    if (!password || password.length < 8)
      return NextResponse.json({ error: 'Şifre en az 8 karakter olmalıdır.' }, { status: 400 });

    await initDb();

    const existing = await sql`SELECT id FROM v3_users WHERE email = ${email.toLowerCase()}`;
    if (existing.length > 0)
      return NextResponse.json({ error: 'Bu e-posta adresi zaten kullanılıyor.' }, { status: 409 });

    const passwordHash = await hashPassword(password);
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 saat

    await sql`
      INSERT INTO v3_users (name, email, password_hash, email_verified, verification_token, verification_token_expires)
      VALUES (${name.trim()}, ${email.toLowerCase()}, ${passwordHash}, FALSE, ${token}, ${expires})
    `;

    const origin = new URL(request.url).origin;
    await sendVerificationEmail({ to: email, name: name.trim(), token, origin });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
