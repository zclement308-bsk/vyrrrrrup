import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'VYR UP — Connecte ton TikTok et découvre ce qui fait vraiment décoller tes vidéos.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#10110f',
          color: '#f3f3eb',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em' }}>
          <span>VYR</span>
          <span style={{ color: '#e6ff38' }}>UP</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 40, fontSize: 64, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', maxWidth: 980 }}>
          <span>ARRÊTE DE POSTER AU HASARD.</span>
          <span style={{ color: '#e6ff38' }}>LIS TES SIGNAUX.</span>
        </div>
        <div style={{ display: 'flex', marginTop: 36, fontSize: 26, color: '#9a9b90', maxWidth: 820 }}>
          Connecte ton TikTok et découvre ce qui fait vraiment décoller tes vidéos.
        </div>
      </div>
    ),
    { ...size },
  )
}
