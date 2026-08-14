'use client'

import { useState } from 'react'
import { ArrowRight, Check, Eye, Target, TrendingDown, TrendingUp, Video, Zap } from 'lucide-react'
import { AnimatedNumber, Wordmark } from './shared'
import type { Result, VideoInsight } from './types'

function VideoCard({ video, weak }: { video: VideoInsight; weak?: boolean }) {
  const [broken, setBroken] = useState(false)
  const showImage = Boolean(video.coverUrl) && !broken
  return (
    <article className="video-insight">
      <div className="video-cover">
        {showImage ? (
          <img src={video.coverUrl} alt="Miniature de la vidéo analysée" referrerPolicy="no-referrer" onError={() => setBroken(true)} />
        ) : (
          <Video aria-hidden="true" />
        )}
        <span>{weak ? 'À corriger' : 'À répéter'}</span>
      </div>
      <div>
        <h3>{video.title || 'Vidéo TikTok'}</h3>
        <p><Eye /> {video.views} vues</p>
        <small>{video.engagement} d’engagement</small>
      </div>
    </article>
  )
}

function GrowthChart({ score }: { score: number }) {
  const factor = Math.max(2, Math.round(score / 12))
  return (
    <div className="growth-chart" aria-label={`Projection indicative jusqu’à x${factor}`}>
      <div className="chart-grid"><span>x{factor}</span><span>x{Math.max(2, Math.round(factor / 2))}</span><span>0</span></div>
      <svg viewBox="0 0 600 250" role="img" aria-label="Courbe de potentiel de croissance">
        <defs>
          <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="var(--primary)" stopOpacity=".3" />
            <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className="chart-area" d="M20 225 C95 215 110 178 170 180 S260 138 315 142 S410 110 455 65 S520 45 575 20 L575 225 Z" fill="url(#area)" />
        <path className="chart-line" d="M20 225 C95 215 110 178 170 180 S260 138 315 142 S410 110 455 65 S520 45 575 20" />
        <circle cx="20" cy="225" r="7" />
        <circle cx="575" cy="20" r="9" />
      </svg>
      <div className="chart-days"><span>Aujourd’hui</span><span>Jour 7</span><span>Jour 14</span><span>Jour 30</span></div>
      <b className="chart-badge">Potentiel x{factor}</b>
    </div>
  )
}

function ProfileAvatar({ src, name }: { src: string; name: string }) {
  const [broken, setBroken] = useState(false)
  if (!src || broken) return <div className="avatar-fallback">{(name || '?').trim().slice(0, 1).toUpperCase() || '?'}</div>
  return <img src={src} alt={`Photo de ${name}`} referrerPolicy="no-referrer" onError={() => setBroken(true)} />
}

export function ResultScreen({ result }: { result: Result }) {
  const { profile, metrics, analysis, videos } = result
  return (
    <div className="result-page">
      <header className="result-header"><Wordmark /><span className="live-dot">DIAGNOSTIC TERMINÉ</span></header>
      <section className="result-hero">
        <div className="profile-main">
          <ProfileAvatar src={profile.avatarUrl} name={profile.displayName} />
          <div>
            <span className="section-label">PROFIL ANALYSÉ</span>
            <h1>{profile.displayName}</h1>
            <p>{profile.username ? `@${profile.username}` : 'Compte TikTok'}</p>
          </div>
        </div>
        <div className="score-block"><span>Score VYR</span><strong><AnimatedNumber value={metrics.score} /></strong><small>/100</small></div>
      </section>
      <section className="metric-strip">
        {[[profile.followers, 'Abonnés'], [profile.likes, 'Likes'], [metrics.averageViews, 'Vues moyennes'], [metrics.medianViews, 'Vues médianes'], [metrics.engagement, 'Engagement']].map(([value, label]) => (
          <article key={label}><strong>{value}</strong><span>{label}</span></article>
        ))}
      </section>
      <section className="result-content">
        <article className="report-card report-main">
          <span className="section-label">CE QUE VYR A COMPRIS</span>
          <h2>{analysis.niche}</h2>
          <p>{analysis.summary}</p>
          <div className="hashtags">{analysis.hashtags.map(tag => <span key={tag}>{tag}</span>)}</div>
        </article>
        <article className="priority-card"><Target /><div><span className="section-label">PRIORITÉ N°1</span><h2>{analysis.priority}</h2></div></article>
        <div className="video-section">
          <div><span className="section-label">TES SIGNAUX CONTRASTÉS</span><h2>CE QUI PERCE. CE QUI BLOQUE.</h2></div>
          <div className="video-columns">
            <section>
              <h3><TrendingUp /> Tes formats forts</h3>
              {videos.strongest.length ? videos.strongest.map(v => <VideoCard key={v.id} video={v} />) : <p className="empty-state">Pas assez de vidéos disponibles.</p>}
            </section>
            <section>
              <h3><TrendingDown /> Tes vidéos les moins vues</h3>
              {videos.weakest.length ? videos.weakest.map(v => <VideoCard key={v.id} video={v} weak />) : <p className="empty-state">Pas assez de vidéos disponibles.</p>}
            </section>
          </div>
        </div>
        <div className="diagnostic-grid">
          <article className="report-card"><TrendingUp /><span className="section-label">À CONSERVER</span><ul>{analysis.strengths.map(item => <li key={item}><Check />{item}</li>)}</ul></article>
          <article className="report-card"><Zap /><span className="section-label">À CORRIGER</span><ul>{analysis.improvements.map(item => <li key={item}><ArrowRight />{item}</li>)}</ul></article>
        </div>
        <article className="projection-card">
          <div>
            <span className="section-label">PROJECTION INDICATIVE</span>
            <h2>TON POTENTIEL SI TU APPLIQUES LE PLAN</h2>
            <p>Cette courbe illustre un potentiel relatif à tes signaux actuels. Ce n’est pas une promesse de résultat.</p>
          </div>
          <GrowthChart score={metrics.score} />
        </article>
      </section>
      <section className="result-cta">
        <div><span className="section-label">LE DIAGNOSTIC N’EST QUE LE DÉBUT</span><h2>MAINTENANT,<br /><em>PASSE À L’ACTION.</em></h2></div>
        <button onClick={() => window.location.assign('/')} className="primary-action"><span>Nouvelle analyse</span><ArrowRight /></button>
      </section>
    </div>
  )
}
