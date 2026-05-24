import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = () => new TextEncoder().encode(process.env.SESSION_SECRET);

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/support/dashboard')) {
    const token = request.cookies.get('sg_session')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/support', request.url));
    }
    try {
      await jwtVerify(token, secret());
    } catch {
      return NextResponse.redirect(new URL('/support', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/support/dashboard/:path*'],
};
