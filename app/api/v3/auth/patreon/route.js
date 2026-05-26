import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { getSession } from '../../../../../lib/v3/auth';

export async function GET(request) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.redirect(new URL('/v3/giris', request.url));
  }

  const state = randomBytes(16).toString('hex');
  const origin = new URL(request.url).origin;
  const redirectUri = `${origin}/api/v3/auth/patreon/callback`;

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.PATREON_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: 'identity identity[email] identity.memberships',
    state,
  });

  const res = NextResponse.redirect(`https://www.patreon.com/oauth2/authorize?${params}`);
  res.cookies.set('v3_oauth_state', state, { httpOnly: true, maxAge: 300, sameSite: 'lax', path: '/' });
  res.cookies.set('v3_oauth_user', session.userId, { httpOnly: true, maxAge: 300, sameSite: 'lax', path: '/' });
  return res;
}
