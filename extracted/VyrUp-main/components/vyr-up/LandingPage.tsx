'use client'

import { ArrowRight, ChartBar as BarChart3, ChevronRight, Rocket, ShieldCheck, TrendingDown } from 'lucide-react'
import { Header } from './shared'
import { ReviewsSection } from './ReviewsSection'
import { HeroSignalAnimation } from './HeroSignalAnimation'

const howSteps: [typeof ShieldCheck, string, string][] = [
  [ShieldCheck, 'Connexion sécurisée', 'TikTok autorise uniquement les données nécessaires.'],
  [BarChart3, 'Analyse réelle', 'Vues, engagement, médiane et régularité.'],
  [TrendingDown, 'Angles morts', 'Tes contenus les moins vus sont aussi analysés.'],
  [Rocket, 'Plan ciblé', 'Des actions adaptées à ton objectif.'],
]

const viralRows: [string, string, string][] = [
  ['01', 'PORTÉE', 'Mesurer ce que TikTok distribue réellement.'],
  ['02', 'ENGAGEMENT', 'Comprendre ce qui provoque une réaction.'],
  ['03', 'RÉPÉTITION', 'Identifier les formats qui méritent une série.'],
]

export function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <main>
      <Header onStart={onStart} />
      <section className="hero compact-hero hero-dynamic">
        <div className="hero-copy">
          <h1>ARRÊTE DE POSTER<br />AU <em>HASARD.</em><br />LIS TES SIGNAUX.</h1>
          <p className="hero-description">VYR UP analyse tes vraies performances, repère tes vidéos sous-exploitées et transforme tes statistiques en plan d’action.</p>
          <button className="primary-action" onClick={onStart}><span>Commencer</span><ArrowRight /></button>
          <div className="hero-proof">
            <div className="stars">★★★★★ <b>4,8/5</b></div>
            <span><strong>Plus de 340 000</strong> comptes analysés</span>
          </div>
        </div>
        <div className="hero-visual"><HeroSignalAnimation /></div>
      </section>

      <div className="ticker">
        <div>PROFIL — VIDÉOS FORTES — VIDÉOS FAIBLES — ENGAGEMENT — RÉGULARITÉ — POTENTIEL — PROFIL — VIDÉOS FORTES — VIDÉOS FAIBLES — ENGAGEMENT — RÉGULARITÉ — POTENTIEL —</div>
      </div>

      <section className="how-section" id="how">
        <div className="section-heading">
          <span className="section-label">01 / COMMENT ÇA MARCHE</span>
          <h2>DE TES DONNÉES<br />À TON <em>PLAN.</em></h2>
          <p>Une analyse lisible de tes signaux pour savoir quoi arrêter, quoi améliorer et quoi répéter.</p>
        </div>
        <div className="steps-grid">
          {howSteps.map(([Icon, title, text], i) => (
            <button type="button" className="step-card" onClick={onStart} key={title}>
              <span>0{i + 1}</span><Icon /><h3>{title}</h3><p>{text}</p>
              <span className="module-action">Découvrir <ChevronRight /></span>
            </button>
          ))}
        </div>
      </section>

      <section className="viral-section" id="method">
        <div className="viral-intro">
          <span className="section-label">02 / LES FONCTIONNALITÉS VYR</span>
          <h2>PLUS PRÉCIS<br />QUE TON <em>INTUITION.</em></h2>
          <p>VYR compare chaque contenu à la médiane de ton propre compte. Pas à un seuil arbitraire.</p>
        </div>
        <div className="viral-list">
          {viralRows.map(row => (
            <article className="viral-row" key={row[1]}>
              <span>{row[0]}</span><h3>{row[1]}</h3><p>{row[2]}</p><strong>→</strong>
            </article>
          ))}
        </div>
      </section>

      <ReviewsSection />

      <section className="final-cta">
        <span className="section-label">PRÊT À VOIR CLAIR ?</span>
        <h2>TON PROCHAIN POST<br />NE SERA PAS UN <em>PARI.</em></h2>
        <p>Réponds à quelques questions, connecte TikTok et laisse tes propres données guider la suite.</p>
        <button className="primary-action" onClick={onStart}><span>Commencer</span><ArrowRight /></button>
      </section>
    </main>
  )
}
