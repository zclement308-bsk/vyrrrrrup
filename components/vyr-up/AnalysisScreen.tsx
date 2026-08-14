'use client'

import { useEffect, useState } from 'react'
import { Check, LoaderCircle } from 'lucide-react'
import { AnimatedNumber, Wordmark } from './shared'
import { reviews } from './quiz-data'

const phases = [
  { at: 12, text: 'Lecture de ton profil' },
  { at: 32, text: 'Collecte de tes vidéos publiques' },
  { at: 55, text: 'Classement des meilleures et plus faibles' },
  { at: 76, text: 'Calcul de tes signaux de croissance' },
  { at: 92, text: 'Création de ton plan personnalisé' },
]

export function AnalysisScreen({ error, done }: { error: string; done: boolean }) {
  const [progress, setProgress] = useState(4)
  useEffect(() => {
    if (done) {
      // Real data is back: stop pretending and race the bar to 100% so the
      // checklist actually finishes instead of jump-cutting to the result.
      const timer = window.setInterval(() => setProgress(value => Math.min(100, value + 6)), 40)
      return () => window.clearInterval(timer)
    }
    const timer = window.setInterval(() => setProgress(value => Math.min(96, value + (value < 50 ? 4 : 2))), 180)
    return () => window.clearInterval(timer)
  }, [done])

  return (
    <div className="flow-shell analysis-screen">
      <div className="analysis-heading">
        <Wordmark />
        <span className="section-label">ANALYSE EN COURS</span>
        <h1>ON FAIT PARLER<br /><em>TES DONNÉES.</em></h1>
        <p>Ne ferme pas cette page. Chaque signal compte.</p>
      </div>
      <div className="analysis-core">
        <div className="analysis-orbit" style={{ '--progress': `${progress * 3.6}deg` } as React.CSSProperties}>
          <div><AnimatedNumber value={progress} suffix="%" /></div>
        </div>
        <div className="analysis-track"><i style={{ width: `${progress}%` }} /></div>
      </div>
      <div className="check-list">
        {phases.map((phase) => (
          <div className={progress >= phase.at ? 'done' : progress >= phase.at - 18 ? 'active' : ''} key={phase.text}>
            {progress >= phase.at ? <Check /> : <LoaderCircle />}
            <span>{phase.text}</span>
          </div>
        ))}
      </div>
      {error && <p className="flow-error" role="alert">{error}</p>}
      <div className="review-marquee">
        {reviews.concat(reviews).map((review, i) => (
          <blockquote key={`${review[1]}-${i}`}>
            <div className="review-stars">★★★★★</div>
            <p>“{review[2]}”</p>
            <small>{review[0]} · {review[1]}</small>
          </blockquote>
        ))}
      </div>
    </div>
  )
}
