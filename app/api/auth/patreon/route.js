import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { getOAuthUrl } from '@/lib/patreon';

export function GET() {
  const state = randomBytes(16).toString('hex');
  const url = getOAuthUrl(state);
  const res = NextResponse.redirect(url);
  res.cookies.set('oauth_state', state, {
    httpOnly: true,
    maxAge: 300,
    sameSite: 'lax',
    path: '/',
  });
  return res;
}
