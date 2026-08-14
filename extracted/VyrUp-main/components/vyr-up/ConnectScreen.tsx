'use client'

import { ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react'
import { TikTokIcon } from './icons'
import { FlowTop } from './shared'
import { questions } from './quiz-data'

export function ConnectScreen({ error, onBack }: { error: string; onBack: () => void }) {
  return (
    <div className="flow-shell">
      <FlowTop step={questions.length - 1} onBack={onBack} />
      <section className="connect-panel stage-enter">
        <div className="connect-pulse"><TikTokIcon /></div>
        <span className="section-label">CONNEXION OFFICIELLE TIKTOK</span>
        <h1>PRÊT POUR TON<br /><em>DIAGNOSTIC RÉEL ?</em></h1>
        <p>VYR UP analyse ton profil et tes vidéos publiques pour repérer ce qui fonctionne — et surtout ce qui te freine.</p>
        <a className="tiktok-connect" href="/api/auth/tiktok">
          <span><LockKeyhole /> Connecter mon TikTok</span><ArrowRight />
        </a>
        <div className="privacy-note">
          <ShieldCheck />
          <span><b>Tes données restent privées.</b>Nous ne voyons jamais ton mot de passe et ne publions rien.</span>
        </div>
        {error && <p className="flow-error" role="alert">{error}</p>}
      </section>
    </div>
  )
}
