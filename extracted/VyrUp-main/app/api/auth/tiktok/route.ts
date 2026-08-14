import { randomBytes } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { TIKTOK_AUTH_URL, requireTikTokEnv } from '@/lib/tiktok'
import { OAUTH_STATE_COOKIE } from '@/lib/oauth-state'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const env = requireTikTokEnv()
  if (!env) {
    // Before: this route didn't exist at all -> hard 404, broken onboarding.
    // Now: fails visibly and the UI shows a clear error instead of a dead link.
    return NextResponse.redirect(
      new URL('/?oauth_error=missing_config', request.url),
    )
  }

  const state = randomBytes(16).toString('hex')
  const authUrl = new URL(TIKTOK_AUTH_URL)
  authUrl.searchParams.set('client_key', env.clientKey)
  authUrl.searchParams.set('scope', 'user.info.basic,video.list')
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('redirect_uri', env.redirectUri)
  authUrl.searchParams.set('state', state)

  const response = NextResponse.redirect(authUrl)
  response.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600, // 10 minutes, just enough to complete the OAuth round trip
  })
  return response
}
