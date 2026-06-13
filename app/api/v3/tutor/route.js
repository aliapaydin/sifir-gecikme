import { NextResponse } from 'next/server';
import { sql, initDb } from '../../../../lib/v3/db';
import { getSession } from '../../../../lib/v3/auth';

const MAX_MESSAGES = 60;

// GET: Son mesajları getir
export async function GET(request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ messages: [] });

  await initDb();
  const rows = await sql`
    SELECT role, content, created_at
    FROM v3_tutor_messages
    WHERE user_id = ${session.userId}
    ORDER BY created_at ASC
    LIMIT ${MAX_MESSAGES}
  `;
  return NextResponse.json({ messages: rows.map(r => ({ role: r.role, content: r.content })) });
}

// POST: Yeni mesaj/lar kaydet
// body: { messages: [{role, content}] } — tüm yeni mesajları gönder
export async function POST(request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { messages } = await request.json();
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
  }

  await initDb();

  for (const msg of messages) {
    if (!msg.role || !msg.content) continue;
    await sql`
      INSERT INTO v3_tutor_messages (user_id, role, content)
      VALUES (${session.userId}, ${msg.role}, ${msg.content})
    `;
  }

  // Eski mesajları temizle (MAX_MESSAGES üzerini sil)
  await sql`
    DELETE FROM v3_tutor_messages
    WHERE user_id = ${session.userId}
      AND id NOT IN (
        SELECT id FROM v3_tutor_messages
        WHERE user_id = ${session.userId}
        ORDER BY created_at DESC
        LIMIT ${MAX_MESSAGES}
      )
  `;

  return NextResponse.json({ ok: true });
}

// DELETE: Geçmişi temizle
export async function DELETE(request) {
  const session = await getSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await initDb();
  await sql`DELETE FROM v3_tutor_messages WHERE user_id = ${session.userId}`;
  return NextResponse.json({ ok: true });
}
