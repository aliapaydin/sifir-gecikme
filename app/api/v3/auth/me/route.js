import { NextResponse } from 'next/server';
import { getSession } from '../../../../../lib/v3/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Oturum bulunamadı.' }, { status: 401 });
    }
    return NextResponse.json({
      user: {
        id: session.userId,
        name: session.name,
        email: session.email,
        role: session.role,
        avatarColor: session.avatarColor,
        createdAt: session.createdAt,
        lastLogin: session.lastLogin,
        isSupporter: session.isSupporter,
        patronStatus: session.patronStatus,
        pledgeCents: session.pledgeCents,
        lifetimeCents: session.lifetimeCents,
        patreonLinkedAt: session.patreonLinkedAt,
        patreonName: session.patreonName,
      },
    });
  } catch (err) {
    console.error('Me error:', err);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
