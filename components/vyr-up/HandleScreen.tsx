'use client'

import { useState } from 'react'
import { ArrowRight, AtSign, LockKeyhole, ShieldCheck } from 'lucide-react'
import { TikTokIcon, InstagramIcon } from './icons'
import { FlowTop } from './shared'
import { questions } from './quiz-data'

export function HandleScreen({
  platform,
  initialHandle,
  onSubmit,
  onBack,
}: {
  platform: string
  initialHandle: string
  onSubmit: (handle: string) => void
  onBack: () => void
}) {
  const isTikTok = platform === 'TikTok'
  const Icon = isTikTok ? TikTokIcon : InstagramIcon
  const placeholder = isTikTok ? '@ton_nom_tiktok' : '@ton_nom_instagram'
  const [handle, setHandle] = useState(initialHandle)

  const clean = handle.replace(/^@+/, '').trim()
  const canSubmit = clean.length >= 2

  const submit = () => {
    if (!canSubmit) return
    onSubmit(clean.startsWith('@') ? clean : `@${clean}`)
  }

  return (
    <div className="flow-shell quiz-flow">
      <FlowTop step={questions.length - 2} onBack={onBack} />
      <div className="quiz-aura" aria-hidden="true" />
      <div className="quiz-logo-watermark" aria-hidden="true"><WordmarkSafe /></div>
      <section className="quiz-panel stage-enter">
        <div className="question-copy">
          <span className="section-label q-reveal" style={{ '--q-delay': '0ms' } as React.CSSProperties}>
            {isTikTok ? 'TON PROFIL TIKTOK' : 'TON PROFIL INSTAGRAM'}
          </span>
          <h1 className="q-reveal" style={{ '--q-delay': '100ms' } as React.CSSProperties}>
            {isTikTok ? 'Quel est ton pseudo TikTok ?' : 'Quel est ton pseudo Instagram ?'}
          </h1>
          <p className="q-reveal" style={{ '--q-delay': '220ms' } as React.CSSProperties}>
            Saisis simplement ton nom d'utilisateur — aucune connexion, aucun mot de passe.
          </p>
        </div>
        <div className="handle-input-wrap q-reveal" style={{ '--q-delay': '340ms' } as React.CSSProperties}>
          <div className="handle-input-box">
            <span className="handle-platform-icon"><Icon /></span>
            <AtSign className="handle-at" />
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') submit() }}
              placeholder={placeholder}
              autoFocus
              aria-label={isTikTok ? 'Pseudo TikTok' : 'Pseudo Instagram'}
            />
          </div>
          <button
            className="primary-action handle-submit"
            onClick={submit}
            disabled={!canSubmit}
          >
            <span>Continuer</span><ArrowRight />
          </button>
          {isTikTok && (
            <>
              <div className="handle-divider"><span>ou</span></div>
              <a className="handle-oauth" href="/api/auth/tiktok">
                <span><LockKeyhole /> Connecter mon TikTok (OAuth)</span><ArrowRight />
              </a>
              <div className="privacy-note">
                <ShieldCheck />
                <span><b>Tes données restent privées.</b>Nous ne voyons jamais ton mot de passe et ne publions rien.</span>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

function WordmarkSafe() {
  return (
    <span className="wordmark" style={{ border: 0, background: 'transparent', color: 'inherit', cursor: 'default' }}>
      <span>VYR</span>
      <span className="wordmark-mark">UP</span>
    </span>
  )
}
