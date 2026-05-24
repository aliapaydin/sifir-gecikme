import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/session';

export async function GET(request) {
  await deleteSession();
  return NextResponse.redirect(new URL('/support', request.url));
}
