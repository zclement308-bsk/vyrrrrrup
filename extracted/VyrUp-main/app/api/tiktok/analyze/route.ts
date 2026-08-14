import { NextRequest, NextResponse } from 'next/server'
import { fetchTikTokUser, fetchTikTokVideos, TikTokVideo } from '@/lib/tiktok'
import { decodeSession, SESSION_COOKIE } from '@/lib/session'
import { ANALYSIS_CACHE_COOKIE, analysisCacheCookieOptions, decodeAnalysisCache, encodeAnalysisCache } from '@/lib/analysis-cache'

export const dynamic = 'force-dynamic'

function formatCompact(n: number) {
  return new Intl.NumberFormat('fr-FR', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
}

function median(values: number[]) {
  if (!values.length) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function average(values: number[]) {
  if (!values.length) return 0
  return values.reduce((a, b) => a + b, 0) / values.length
}

function toVideoInsight(video: TikTokVideo) {
  const engagement = video.view_count > 0
    ? ((video.like_count + video.comment_count + video.share_count) / video.view_count) * 100
    : 0
  return {
    id: video.id,
    title: video.title || 'Vidéo TikTok',
    coverUrl: video.cover_image_url,
    views: formatCompact(video.view_count),
    viewCount: video.view_count,
    engagement: `${engagement.toFixed(1)}%`,
  }
}

// Rule-based fallback used when no ANTHROPIC_API_KEY is configured, or if the
// enrichment call fails. Every number here is derived from the real fetched
// videos — nothing here is a hardcoded placeholder.
function buildRuleBasedAnalysis(videos: TikTokVideo[], engagementRate: number, consistency: number) {
  const strengths: string[] = []
  const improvements: string[] = []

  if (engagementRate >= 5) strengths.push('Ton taux d’engagement est solide, tes vidéos donnent envie de réagir.')
  else improvements.push('Ton taux d’engagement est bas : travaille tes hooks des 3 premières secondes.')

  if (consistency >= 60) strengths.push('Ta régularité de publication est un vrai atout.')
  else improvements.push('Ta cadence de publication est irrégulière, ça freine la distribution algorithmique.')

  const spread = videos.length > 1 ? Math.max(...videos.map(v => v.view_count)) / Math.max(1, median(videos.map(v => v.view_count))) : 1
  if (spread > 5) improvements.push('Gros écart entre tes meilleures et tes pires vidéos : peu de formats sont vraiment répétés.')
  else strengths.push('Tes performances sont assez homogènes d’une vidéo à l’autre.')

  if (!strengths.length) strengths.push('Base de contenu suffisante pour identifier des axes de progression clairs.')
  if (!improvements.length) improvements.push('Continue sur cette lancée et teste de nouveaux formats pour aller chercher plus de portée.')

  return {
    niche: 'Analyse basée sur tes vidéos publiques',
    summary: `Sur les ${videos.length} dernières vidéos analysées, ton engagement moyen est de ${engagementRate.toFixed(1)}%. Concentre-toi sur les formats qui dépassent ta médiane de vues et corrige ceux qui restent en dessous.`,
    hashtags: [],
    strengths,
    improvements,
    priority: improvements[0],
  }
}

async function enrichWithClaude(videos: TikTokVideo[], engagementRate: number) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || videos.length === 0) return null

  const compactVideos = videos.slice(0, 15).map(v => ({
    title: v.title,
    views: v.view_count,
    likes: v.like_count,
    comments: v.comment_count,
    shares: v.share_count,
  }))

  // Bounded timeout: never let a slow model call hang the whole analysis
  // request. The rule-based fallback covers this failure mode gracefully.
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15_000)

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 700,
        messages: [
          {
            role: 'user',
            content:
              'Tu es un analyste de contenu TikTok. Voici les métriques réelles des dernières vidéos publiques d’un créateur (JSON). ' +
              `Taux d'engagement moyen mesuré: ${engagementRate.toFixed(1)}%. ` +
              'Réponds UNIQUEMENT avec un objet JSON valide, sans texte autour, avec exactement ces clés: ' +
              '{"niche": string, "summary": string (2-3 phrases, en français), "hashtags": string[] (3 à 5, avec #), ' +
              '"strengths": string[] (2 à 3 items concrets), "improvements": string[] (2 à 3 items concrets), "priority": string (1 phrase actionnable)}. ' +
              'Base-toi uniquement sur les données fournies, n’invente aucun chiffre. Données: ' +
              JSON.stringify(compactVideos),
          },
        ],
      }),
      signal: controller.signal,
    })

    if (!response.ok) return null
    const data = await response.json()
    const text = data.content?.find((block: { type: string }) => block.type === 'text')?.text
    if (!text) return null

    const cleaned = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)
    if (!parsed.summary || !Array.isArray(parsed.strengths) || !Array.isArray(parsed.improvements)) return null
    return parsed as { niche: string; summary: string; hashtags: string[]; strengths: string[]; improvements: string[]; priority: string }
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

export async function GET(request: NextRequest) {
  const session = decodeSession(request.cookies.get(SESSION_COOKIE)?.value)
  if (!session) {
    return NextResponse.json({ error: 'Session expirée ou introuvable. Reconnecte ton compte TikTok.' }, { status: 401 })
  }

  // Cost guard: serve the cached analysis if this account already got one
  // recently, instead of re-billing TikTok + Claude on every page refresh.
  const cached = decodeAnalysisCache(request.cookies.get(ANALYSIS_CACHE_COOKIE)?.value, session.openId)
  if (cached) {
    const response = NextResponse.json(cached.data)
    response.headers.set('X-Analysis-Cache', `HIT; age=${cached.ageSeconds}s`)
    return response
  }

  try {
    const [user, videos] = await Promise.all([
      fetchTikTokUser(session.accessToken),
      fetchTikTokVideos(session.accessToken, 20),
    ])

    if (videos.length === 0) {
      return NextResponse.json(
        { error: 'Aucune vidéo publique trouvée sur ce compte. Publie au moins une vidéo puis relance l’analyse.' },
        { status: 422 },
      )
    }

    const viewCounts = videos.map(v => v.view_count)
    const engagementRate = average(
      videos.map(v => (v.view_count > 0 ? ((v.like_count + v.comment_count + v.share_count) / v.view_count) * 100 : 0)),
    )

    const sortedByViews = [...videos].sort((a, b) => b.view_count - a.view_count)
    const strongest = sortedByViews.slice(0, 3).map(toVideoInsight)
    const weakest = sortedByViews.slice(-3).reverse().map(toVideoInsight)

    // Rough consistency proxy from real posting timestamps: how regular the
    // gaps between publications are, scaled to 0-100. Not a placeholder.
    const timestamps = videos.map(v => v.create_time).sort((a, b) => a - b)
    const gaps = timestamps.slice(1).map((t, i) => t - timestamps[i])
    const avgGap = average(gaps)
    const gapVariance = average(gaps.map(g => Math.pow(g - avgGap, 2)))
    const consistency = gaps.length ? Math.max(0, Math.min(100, 100 - (Math.sqrt(gapVariance) / (avgGap || 1)) * 40)) : 0

    const score = Math.round(Math.min(100, engagementRate * 6 + consistency * 0.3))

    const enrichment = (await enrichWithClaude(videos, engagementRate)) ?? buildRuleBasedAnalysis(videos, engagementRate, consistency)

    const payload = {
      profile: {
        displayName: user.display_name,
        username: user.username,
        avatarUrl: user.avatar_url,
        following: formatCompact(user.following_count),
        followers: formatCompact(user.follower_count),
        likes: formatCompact(user.likes_count),
      },
      metrics: {
        videosAnalyzed: videos.length,
        averageViews: formatCompact(average(viewCounts)),
        medianViews: formatCompact(median(viewCounts)),
        engagement: `${engagementRate.toFixed(1)}%`,
        score,
        consistency: Math.round(consistency),
      },
      analysis: enrichment,
      videos: { strongest, weakest },
    }

    const response = NextResponse.json(payload)
    response.headers.set('X-Analysis-Cache', 'MISS')
    response.cookies.set(ANALYSIS_CACHE_COOKIE, encodeAnalysisCache(session.openId, payload), analysisCacheCookieOptions())
    return response
  } catch (caught) {
    return NextResponse.json(
      { error: caught instanceof Error ? caught.message : 'Analyse impossible pour le moment.' },
      { status: 502 },
    )
  }
}
