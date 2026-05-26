import { NextResponse } from 'next/server';
import { initDb } from '../../../../../lib/v3/db';

export async function POST() {
  try {
    await initDb();
    return NextResponse.json({ ok: true, message: 'DB tabloları oluşturuldu.' });
  } catch (err) {
    console.error('Init DB error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
