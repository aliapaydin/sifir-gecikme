import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { getCookieDomain } from './cookieDomain';

const COOKIE = 'sg_session';
const secret = () => new TextEncoder().encode(process.env.SESSION_SECRET);

export async function createSession(data) {
  const token = await new SignJWT(data)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret());

  const domain = await getCookieDomain();
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
    ...(domain ? { domain } : {}),
  });
}

export async function getSession() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload;
  } catch {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const domain = await getCookieDomain();
  cookieStore.delete(COOKIE);
  if (domain) {
    cookieStore.set(COOKIE, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
      domain,
    });
  }
}
