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
      SELECT s.id, s.expires_at, u.id as user_id, u.name, u.email, u.role, u.avatar_color,
             u.created_at, u.last_login
      FROM v3_sessions s
      JOIN v3_users u ON u.id = s.user_id
      WHERE s.id = ${sessionId}
        AND s.user_id = ${userId}
        AND s.expires_at > NOW()
    `;

    if (!session) return null;

    const base = {
      sessionId: session.id,
      userId: session.user_id,
      name: session.name,
      email: session.email,
      role: session.role,
      avatarColor: session.avatar_color,
      createdAt: session.created_at,
      lastLogin: session.last_login,
      isSupporter: false,
      patronStatus: null,
      pledgeCents: 0,
      lifetimeCents: 0,
      patreonLinkedAt: null,
      patreonName: null,
      patreonId: null,
    };

    // Patreon alanları henüz tabloda olmayabilir — ayrı sorguda dene
    try {
      const [p] = await sql`
        SELECT patreon_id, patreon_name, is_supporter, patron_status,
               pledge_cents, lifetime_cents, patreon_linked_at
        FROM v3_users WHERE id = ${session.user_id}
      `;
      if (p) {
        base.patreonId       = p.patreon_id;
        base.patreonName     = p.patreon_name;
        base.isSupporter     = p.is_supporter || false;
        base.patronStatus    = p.patron_status;
        base.pledgeCents     = p.pledge_cents || 0;
        base.lifetimeCents   = p.lifetime_cents || 0;
        base.patreonLinkedAt = p.patreon_linked_at;
      }
    } catch { /* Patreon kolonları henüz yok, sorun değil */ }

    return base;
  } catch {
    return null;
  }
}

export async function deleteSession(sessionId) {
  await sql`DELETE FROM v3_sessions WHERE id = ${sessionId}`;

  const cookieStore = await cookies();
  cookieStore.delete(COOKIE);
}
