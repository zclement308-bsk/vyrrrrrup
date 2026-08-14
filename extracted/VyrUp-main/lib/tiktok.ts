// Minimal TikTok Login Kit + Display API client.
// Docs: https://developers.tiktok.com/doc/login-kit-web
//       https://developers.tiktok.com/doc/tiktok-api-v2-video-list

export const TIKTOK_AUTH_URL = 'https://www.tiktok.com/v2/auth/authorize/'
export const TIKTOK_TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/'
export const TIKTOK_USER_INFO_URL = 'https://open.tiktokapis.com/v2/user/info/'
export const TIKTOK_VIDEO_LIST_URL = 'https://open.tiktokapis.com/v2/video/list/'

// Every outbound call in this file talks to a third-party API. Without a
// timeout, a slow/hanging TikTok response would hang the whole /analyze
// request (and the user's loading screen) indefinitely. 10s is generous
// for a JSON API call but still bounded.
const FETCH_TIMEOUT_MS = 10_000

async function fetchWithTimeout(input: string, init: RequestInit = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('TikTok met trop de temps à répondre. Réessaie dans quelques instants.')
    }
    throw err
  } finally {
    clearTimeout(timeout)
  }
}

export function requireTikTokEnv() {
  const clientKey = process.env.TIKTOK_CLIENT_KEY
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET
  const redirectUri = process.env.TIKTOK_REDIRECT_URI
  if (!clientKey || !clientSecret || !redirectUri) {
    return null
  }
  return { clientKey, clientSecret, redirectUri }
}

export type TikTokTokenResponse = {
  access_token: string
  open_id: string
  expires_in: number
  error?: string
  error_description?: string
}

export async function exchangeCodeForToken(code: string) {
  const env = requireTikTokEnv()
  if (!env) throw new Error('TikTok non configuré côté serveur.')

  const response = await fetchWithTimeout(TIKTOK_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cache-Control': 'no-cache' },
    body: new URLSearchParams({
      client_key: env.clientKey,
      client_secret: env.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: env.redirectUri,
    }),
  })

  const data = (await response.json()) as TikTokTokenResponse
  if (!response.ok || data.error) {
    throw new Error(data.error_description || 'Échange du code TikTok impossible.')
  }
  return data
}

export type TikTokUser = {
  display_name: string
  username: string
  avatar_url: string
  following_count: number
  follower_count: number
  likes_count: number
}

export async function fetchTikTokUser(accessToken: string): Promise<TikTokUser> {
  const fields = ['display_name', 'username', 'avatar_url', 'following_count', 'follower_count', 'likes_count'].join(',')
  const response = await fetchWithTimeout(`${TIKTOK_USER_INFO_URL}?fields=${fields}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const data = await response.json()
  if (!response.ok || data.error?.code !== 'ok') {
    throw new Error(data.error?.message || 'Impossible de récupérer le profil TikTok.')
  }
  return data.data.user as TikTokUser
}

export type TikTokVideo = {
  id: string
  title: string
  cover_image_url: string
  view_count: number
  like_count: number
  comment_count: number
  share_count: number
  create_time: number
}

export async function fetchTikTokVideos(accessToken: string, maxCount = 20): Promise<TikTokVideo[]> {
  const fields = ['id', 'title', 'cover_image_url', 'view_count', 'like_count', 'comment_count', 'share_count', 'create_time'].join(',')
  const response = await fetchWithTimeout(`${TIKTOK_VIDEO_LIST_URL}?fields=${fields}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ max_count: maxCount }),
  })
  const data = await response.json()
  if (!response.ok || data.error?.code !== 'ok') {
    throw new Error(data.error?.message || 'Impossible de récupérer les vidéos TikTok.')
  }
  return (data.data?.videos ?? []) as TikTokVideo[]
}
