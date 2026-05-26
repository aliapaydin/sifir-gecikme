import { NextResponse } from 'next/server';
import { getIdentity, parseMembership } from '../../../../../../lib/patreon';
import { getSession } from '../../../../../../lib/v3/auth';
import { sql } from '../../../../../../lib/v3/db';

export async function POST(request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Giriş yapman gerekiyor.' }, { status: 401 });

  const [user] = await sql`
    SELECT patreon_access_token FROM v3_users WHERE id = ${session.userId}
  `;

  if (!user?.patreon_access_token) {
    return NextResponse.json({ error: 'Patreon bağlantısı yok.' }, { status: 400 });
  }

  const identity = await getIdentity(user.patreon_access_token);
  if (!identity.data) {
    return NextResponse.json({ error: 'Patreon kimliği alınamadı.' }, { status: 502 });
  }

  const patreonUser = identity.data;
  const membership = parseMembership(identity);
  const isCreator = process.env.PATREON_CREATOR_ID && patreonUser.id === process.env.PATREON_CREATOR_ID;
  const isSupporter = isCreator || membership?.patron_status === 'active_patron';

  await sql`
    UPDATE v3_users SET
      is_supporter   = ${isSupporter},
      patron_status  = ${isCreator ? 'active_patron' : (membership?.patron_status || null)},
      pledge_cents   = ${membership?.currently_entitled_amount_cents || 0},
      lifetime_cents = ${membership?.lifetime_support_cents || 0}
    WHERE id = ${session.userId}
  `;

  return NextResponse.json({ ok: true, isSupporter, patronStatus: isCreator ? 'active_patron' : membership?.patron_status });
}
