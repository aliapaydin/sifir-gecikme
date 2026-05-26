import { NextResponse } from 'next/server';
import { sql } from '../../../../../lib/v3/db';
import { hashPassword, createSession } from '../../../../../lib/v3/auth';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'İsim gereklidir.' }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Geçerli bir e-posta adresi giriniz.' }, { status: 400 });
    }
    if (!password || password.length < 8) {
      return NextResponse.json({ error: 'Şifre en az 8 karakter olmalıdır.' }, { status: 400 });
    }

    // Check duplicate email
    const existing = await sql`SELECT id FROM v3_users WHERE email = ${email.toLowerCase()}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Bu e-posta adresi zaten kullanılıyor.' }, { status: 409 });
    }

    // Create user
    const passwordHash = await hashPassword(password);
    const [user] = await sql`
      INSERT INTO v3_users (name, email, password_hash)
      VALUES (${name.trim()}, ${email.toLowerCase()}, ${passwordHash})
      RETURNING id, name, email, role
    `;

    // Create session
    await createSession(user.id);

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } }, { status: 201 });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
