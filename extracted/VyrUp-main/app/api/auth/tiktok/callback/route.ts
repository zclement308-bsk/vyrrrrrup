import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForToken } from '@/lib/tiktok'
import { encodeSession, sessionCookieOptions, SESSION_COOKIE } from '@/lib/session'
import { OAUTH_STATE_COOKIE } from '@/lib/oauth-state'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const expectedState = request.cookies.get(OAUTH_STATE_COOKIE)?.value
  const errorParam = url.searchParams.get('error')

  const failure = (reason: string) => {
    const redirect = NextResponse.redirect(new URL(`/?oauth_error=${reason}`, request.url))
    redirect.cookies.delete(OAUTH_STATE_COOKIE)
    return redirect
  }

  if (errorParam) return failure('denied')
  if (!code || !state || !expectedState || state !== expectedState) {
    // Missing or mismatched state = possible CSRF attempt, or an expired/replayed link.
    return failure('invalid_state')
  }

  try {
    const token = await exchangeCodeForToken(code)
    const response = NextResponse.redirect(new URL('/?connected=1', request.url))
    response.cookies.set(
      SESSION_COOKIE,
      encodeSession({
        accessToken: token.access_token,
        openId: token.open_id,
        expiresAt: Date.now() + token.expires_in * 1000,
      }),
      sessionCookieOptions(token.expires_in),
    )
    response.cookies.delete(OAUTH_STATE_COOKIE)
    return response
  } catch {
    return failure('token_exchange_failed')
  }
}
