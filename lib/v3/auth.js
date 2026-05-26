import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { sql } from './db';

const COOKIE = 'sg_v3_session';
const secret = () => new TextEncoder().encode(process.env.SESSION_SECRET);

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId) {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const [session] = await sql`
    INSERT INTO v3_sessions (user_id, expires_at)
    VALUES (${userId}, ${expiresAt})
    RETURNING id
  `;

  const token = await new SignJWT({ sessionId: session.id, userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });

  return token;
}

export async function getSession(request) {
  let token;

  if (request) {
    token = request.cookies.get(COOKIE)?.value;
  } else {
    const cookieStore = await cookies();
    token = cookieStore.get(COOKIE)?.value;
  }

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret());
    const { sessionId, userId } = payload;

    const [session] = await sql`
      SELECT s.id, s.expires_at, u.id as user_id, u.name, u.email, u.role, u.avatar_color
      FROM v3_sessions s
      JOIN v3_users u ON u.id = s.user_id
      WHERE s.id = ${sessionId}
        AND s.user_id = ${userId}
        AND s.expires_at > NOW()
    `;

    if (!session) return null;

    return {
      sessionId: session.id,
      userId: session.user_id,
      name: session.name,
      email: session.email,
      role: session.role,
      avatarColor: session.avatar_color,
    };
  } catch {
    return null;
  }
}

export async function deleteSession(sessionId) {
  await sql`DELETE FROM v3_sessions WHERE id = ${sessionId}`;

  const cookieStore = await cookies();
  cookieStore.delete(COOKIE);
}
