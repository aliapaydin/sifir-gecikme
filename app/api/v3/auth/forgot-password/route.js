import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { sql } from '../../../../../lib/v3/db';
import { sendPasswordResetEmail } from '../../../../../lib/v3/email';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email)
      return NextResponse.json({ error: 'E-posta adresi gereklidir.' }, { status: 400 });

    // Her zaman başarılı döndür — email enumeration'ı önlemek için
    const [user] = await sql`
      SELECT id, name FROM v3_users WHERE email = ${email.toLowerCase()}
    `;

    if (user) {
      const token = randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 saat

      await sql`
        UPDATE v3_users SET reset_token = ${token}, reset_token_expires = ${expires}
        WHERE id = ${user.id}
      `;

      const origin = new URL(request.url).origin;
      try {
        await sendPasswordResetEmail({ to: email, name: user.name, token, origin });
      } catch (mailErr) {
        console.error('Şifre sıfırlama maili gönderilemedi:', mailErr?.message);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Forgot password error:', err);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
