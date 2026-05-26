import { NextResponse } from 'next/server';
import { sql } from '../../../../../lib/v3/db';
import { createSession } from '../../../../../lib/v3/auth';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get('token');
  const panelUrl = `${origin}/v3/panel`;

  if (!token)
    return NextResponse.redirect(`${origin}/v3/dogrula?error=missing_token`);

  try {
    const [user] = await sql`
      SELECT id FROM v3_users
      WHERE verification_token = ${token}
        AND verification_token_expires > NOW()
        AND email_verified = FALSE
    `;

    if (!user)
      return NextResponse.redirect(`${origin}/v3/dogrula?error=invalid_token`);

    await sql`
      UPDATE v3_users SET
        email_verified = TRUE,
        verification_token = NULL,
        verification_token_expires = NULL,
        last_login = NOW()
      WHERE id = ${user.id}
    `;

    await createSession(user.id);

    const res = NextResponse.redirect(`${panelUrl}?verified=1`);
    return res;
  } catch (err) {
    console.error('Verify error:', err);
    return NextResponse.redirect(`${origin}/v3/dogrula?error=server`);
  }
}
