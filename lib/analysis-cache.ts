import { createHmac, timingSafeEqual } from 'node:crypto'

// Cost guard for /api/tiktok/analyze.
//
// Every call to that route hits the TikTok API twice and, when configured,
// the Claude API once. Those are real, billed calls. Without a cache, a
// page refresh loop (user mashing F5, or a bot crawling the URL) bills the
// account every single time for identical output.
//
// This is a signed, httpOnly cookie cache — not a database. It's the
// pragmatic option for a stateless deploy with no KV/Redis attached. It
// caps re-billing for a given browser session; it does not stop a client
// that deliberately clears cookies between requests. If this product
// scales past a personal project, swap this for a real store (Vercel KV,
// Upstash Redis, etc.) keyed by openId server-side.

export const ANALYSIS_CACHE_COOKIE = 'vyr_analysis_cache'
const CACHE_TTL_MS = 10 * 60 * 1000 // 10 minutes: fresh enough, cheap enough

type CachedAnalysis = {
  openId: string
  cachedAt: number
  data: unknown
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

export function encodeAnalysisCache(openId: string, data: unknown): string {
  const payload: CachedAnalysis = { openId, cachedAt: Date.now(), data }
  const json = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  return `${json}.${sign(json)}`
}

export function decodeAnalysisCache(
  token: string | undefined | null,
  openId: string,
): { data: unknown; ageSeconds: number } | null {
  if (!token) return null
  const [json, signature] = token.split('.')
  if (!json || !signature) return null

  const expected = sign(json)
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null

  try {
    const payload = JSON.parse(Buffer.from(json, 'base64url').toString('utf8')) as CachedAnalysis
    // Cache is per-account: never serve one user's cached analysis to another.
    if (payload.openId !== openId) return null
    const ageMs = Date.now() - payload.cachedAt
    if (ageMs > CACHE_TTL_MS) return null
    return { data: payload.data, ageSeconds: Math.floor(ageMs / 1000) }
  } catch {
    return null
  }
}

export function analysisCacheCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: Math.floor(CACHE_TTL_MS / 1000),
  }
}
