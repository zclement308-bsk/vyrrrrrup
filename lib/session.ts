import { createHmac, timingSafeEqual } from 'node:crypto'

// Server-only helpers for a small, signed, httpOnly session cookie.
//
// This is NOT a replacement for a real session store (Redis, DB, etc.).
// It's the minimum viable safe version: the payload is signed with
// SESSION_SECRET so it can't be forged or edited by the client, it's
// httpOnly (no JS access, no XSS exfiltration) and Secure in production.
// If you scale this product, move `access_token` server-side and keep
// only an opaque session id in the cookie.

export const SESSION_COOKIE = 'vyr_session'

type SessionPayload = {
  accessToken: string
  openId: string
  expiresAt: number // epoch ms
}

function getSecret(): string {
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    throw new Error(
      'SESSION_SECRET manquant. Défini une valeur longue et aléatoire dans tes variables d’environnement (ex: openssl rand -hex 32).',
    )
  }
  return secret
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url')
}

export function encodeSession(payload: SessionPayload): string {
  const json = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  const signature = sign(json)
  return `${json}.${signature}`
}

export function decodeSession(token: string | undefined | null): SessionPayload | null {
  if (!token) return null
  const [json, signature] = token.split('.')
  if (!json || !signature) return null

  const expected = sign(json)
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null

  try {
    const payload = JSON.parse(Buffer.from(json, 'base64url').toString('utf8')) as SessionPayload
    if (typeof payload.accessToken !== 'string' || typeof payload.openId !== 'string') return null
    if (payload.expiresAt < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

export function sessionCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  }
}
