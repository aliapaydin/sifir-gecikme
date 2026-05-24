import { NextResponse } from 'next/server';
import { exchangeCode, getIdentity, parseMembership } from '@/lib/patreon';
import { createSession } from '@/lib/session';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const storedState = request.cookies.get('oauth_state')?.value;
  const base = new URL('/', request.url).origin;

  if (!code || !state || state !== storedState) {
    return NextResponse.redirect(`${base}/support?error=auth_failed`);
  }

  const tokens = await exchangeCode(code);
  if (!tokens.access_token) {
    return NextResponse.redirect(`${base}/support?error=token_failed`);
  }

  const identity = await getIdentity(tokens.access_token);
  if (!identity.data) {
    return NextResponse.redirect(`${base}/support?error=identity_failed`);
  }

  const user = identity.data;
  const membership = parseMembership(identity);
  const isCreator = process.env.PATREON_CREATOR_ID && user.id === process.env.PATREON_CREATOR_ID;
  const isSupporter = isCreator || membership?.patron_status === 'active_patron';

  await createSession({
    patreon_id: user.id,
    name: user.attributes.full_name,
    email: user.attributes.email || null,
    image_url: user.attributes.image_url || null,
    is_supporter: isSupporter,
    patron_status: isCreator ? 'active_patron' : (membership?.patron_status || null),
    pledge_cents: membership?.currently_entitled_amount_cents || 0,
    last_charge_date: membership?.last_charge_date || null,
    last_charge_status: membership?.last_charge_status || null,
    lifetime_cents: membership?.lifetime_support_cents || 0,
    pledge_start: membership?.pledge_relationship_start || null,
    access_token: tokens.access_token,
  });

  const res = NextResponse.redirect(`${base}/support/dashboard`);
  res.cookies.delete('oauth_state');
  return res;
}
