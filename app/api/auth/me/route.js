import { getSession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json(null);
  return NextResponse.json({
    name: session.name,
    image_url: session.image_url,
    is_supporter: session.is_supporter,
  });
}
