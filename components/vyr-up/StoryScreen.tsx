'use client'

import { ArrowRight } from 'lucide-react'
import { AnimatedNumber, FlowTop } from './shared'

export function StoryScreen({ onContinue, onBack }: { onContinue: () => void; onBack: () => void }) {
  return (
    <div className="flow-shell story-flow">
      <div className="story-bg" aria-hidden="true">
        <img src="https://images.pexels.com/photos/8360444/pexels-photo-8360444.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="" />
        <div className="story-bg-overlay" />
      </div>
      <FlowTop step={4} onBack={onBack} />
      <section className="story-panel stage-enter">
        <span className="section-label story-reveal" style={{ '--reveal-delay': '0ms' } as React.CSSProperties}>340 000+ PROFILS DÉCRYPTÉS</span>
        <h1 className="story-reveal" style={{ '--reveal-delay': '120ms' } as React.CSSProperties}>LES VUES NE SONT PAS<br />UNE QUESTION DE <em>CHANCE.</em></h1>
        <p className="story-reveal" style={{ '--reveal-delay': '280ms' } as React.CSSProperties}>Les créateurs qui progressent lisent leurs signaux, répètent leurs formats forts et corrigent leurs vidéos faibles.</p>
        <div className="story-stat story-reveal" style={{ '--reveal-delay': '440ms' } as React.CSSProperties}>
          <strong><AnimatedNumber value={340000} suffix="+" /></strong>
          <span>créateurs ont déjà remplacé l'intuition par une méthode.</span>
        </div>
        <button className="primary-action story-reveal" style={{ '--reveal-delay': '600ms' } as React.CSSProperties} onClick={onContinue}>
          <span>Voir ce que mes données disent</span><ArrowRight />
        </button>
      </section>
    </div>
  )
}
