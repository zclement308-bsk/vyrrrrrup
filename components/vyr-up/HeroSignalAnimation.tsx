import { Lightbulb, Target, TrendingUp, Zap } from 'lucide-react'

export function HeroSignalAnimation() {
  return (
    <div className="signal-stage" aria-label="Aperçu animé des fonctionnalités VYR UP">
      <div className="signal-orbit signal-orbit-one" />
      <div className="signal-orbit signal-orbit-two" />
      <div className="signal-core"><span>VYR</span><b>UP</b><i /></div>
      <div className="signal-card signal-card-one"><TrendingUp /><span><b>+184 %</b> de portée détectée</span></div>
      <div className="signal-card signal-card-two"><Lightbulb /><span>3 idées virales prêtes</span></div>
      <div className="signal-card signal-card-three"><Target /><span>Plan personnalisé généré</span></div>
      <div className="signal-card signal-card-four"><Zap /><span>Meilleur créneau : 19h42</span></div>
      <div className="signal-scan" />
    </div>
  )
}
