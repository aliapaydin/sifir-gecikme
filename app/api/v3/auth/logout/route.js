import { NextResponse } from 'next/server';
import { getSession, deleteSession } from '../../../../../lib/v3/auth';

export async function POST() {
  try {
    const session = await getSession();
    if (session) {
      await deleteSession(session.sessionId);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Logout error:', err);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
