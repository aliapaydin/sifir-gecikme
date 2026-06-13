import { NextResponse } from 'next/server';
import { getSession } from '@/lib/v3/auth';
import { sql } from '@/lib/v3/db';
import { sendNewsletterEmail } from '@/lib/v3/email';
import { yazilar } from '@/lib/icerikler';

export async function GET(request) {
  const session = await getSession(request);
  if (!session || session.role !== 'admin')
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });

  const [all] = await sql`SELECT COUNT(*) AS c FROM v3_users WHERE email_verified = TRUE`;
  const [supporters] = await sql`SELECT COUNT(*) AS c FROM v3_users WHERE email_verified = TRUE AND patron_status = 'active_patron'`;

  return NextResponse.json({
    allCount: Number(all.c),
    supporterCount: Number(supporters.c),
  });
}

export async function POST(request) {
  const session = await getSession(request);
  if (!session || session.role !== 'admin')
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });

  const { recipients, subject } = await request.json();

  let users;
  if (recipients === 'supporters') {
    users = await sql`SELECT name, email FROM v3_users WHERE email_verified = TRUE AND patron_status = 'active_patron'`;
  } else {
    users = await sql`SELECT name, email FROM v3_users WHERE email_verified = TRUE`;
  }

  if (users.length === 0)
    return NextResponse.json({ error: 'Gönderilecek kullanıcı bulunamadı.' }, { status: 400 });

  const articles = [...yazilar].sort(() => Math.random() - 0.5).slice(0, 5);
  const origin = new URL(request.url).origin;

  let sent = 0, failed = 0;

  for (const user of users) {
    try {
      await sendNewsletterEmail({
        to: user.email,
        name: user.name,
        subject: subject || 'Sıfır Gecikme — Bu Ay Öne Çıkanlar',
        articles,
        origin,
      });
      sent++;
    } catch (e) {
      console.error('Newsletter send error:', user.email, e?.message);
      failed++;
    }
  }

  return NextResponse.json({ ok: true, sent, failed });
}
