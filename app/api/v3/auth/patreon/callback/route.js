import { NextResponse } from 'next/server';
import { getIdentity, parseMembership } from '../../../../../../lib/patreon';
import { sql } from '../../../../../../lib/v3/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code       = searchParams.get('code');
  const state      = searchParams.get('state');
  const storedState = request.cookies.get('v3_oauth_state')?.value;
  const userId     = request.cookies.get('v3_oauth_user')?.value;
  const origin     = new URL(request.url).origin;
  const panelUrl   = `${origin}/v3/panel`;

  // State veya user cookie yoksa auth_failed
  if (!code || !state || state !== storedState || !userId) {
    console.error('Patreon callback state mismatch', { code: !!code, state, storedState, userId: !!userId });
    return NextResponse.redirect(`${panelUrl}?error=auth_failed`);
  }

  try {
    // Token exchange — redirect_uri callback URL'imizle aynı olmalı
    const redirectUri = `${origin}/api/v3/auth/patreon/callback`;
    const tokenRes = await fetch('https://www.patreon.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id:     process.env.PATREON_CLIENT_ID,
        client_secret: process.env.PATREON_CLIENT_SECRET,
        redirect_uri:  redirectUri,
      }),
    });

    const tokens = await tokenRes.json();
    if (!tokens.access_token) {
      console.error('Patreon token exchange failed', tokens);
      return NextResponse.redirect(`${panelUrl}?error=token_failed`);
    }

    // Kullanıcı kimliği
    const identity = await getIdentity(tokens.access_token);
    if (!identity?.data) {
      console.error('Patreon identity failed', identity);
      return NextResponse.redirect(`${panelUrl}?error=identity_failed`);
    }

    const patreonUser = identity.data;
    const membership  = parseMembership(identity);
    const isCreator   = process.env.PATREON_CREATOR_ID && patreonUser.id === process.env.PATREON_CREATOR_ID;
    const isSupporter = isCreator || membership?.patron_status === 'active_patron';

    // v3_users tablosunu güncelle
    await sql`
      UPDATE v3_users SET
        patreon_id           = ${patreonUser.id},
        patreon_name         = ${patreonUser.attributes?.full_name ?? null},
        is_supporter         = ${isSupporter},
        patron_status        = ${isCreator ? 'active_patron' : (membership?.patron_status ?? null)},
        pledge_cents         = ${membership?.currently_entitled_amount_cents ?? 0},
        lifetime_cents       = ${membership?.lifetime_support_cents ?? 0},
        patreon_access_token = ${tokens.access_token},
        patreon_linked_at    = NOW()
      WHERE id = ${userId}
    `;

    const res = NextResponse.redirect(`${panelUrl}?patreon=linked`);
    res.cookies.delete('v3_oauth_state');
    res.cookies.delete('v3_oauth_user');
    return res;

  } catch (err) {
    console.error('Patreon callback error:', err);
    return NextResponse.redirect(`${panelUrl}?error=${encodeURIComponent(err.message || 'unknown')}`);
  }
}
