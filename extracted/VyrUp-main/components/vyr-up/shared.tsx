'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Menu, X } from 'lucide-react'
import { questions } from './quiz-data'

export function Wordmark() {
  return (
    <button className="wordmark" onClick={() => window.location.assign('/')} aria-label="VYR UP, accueil">
      <span>VYR</span>
      <span className="wordmark-mark">UP</span>
    </button>
  )
}

export function Header({ onStart }: { onStart: () => void }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return (
    <header className="site-header">
      <Wordmark />
      <nav className="desktop-nav" aria-label="Navigation principale">
        <a href="#how">Comment ça marche</a>
        <a href="#method">Fonctionnalités</a>
        <a href="#reviews">Avis</a>
      </nav>
      <button className="header-cta" onClick={onStart}>
        Commencer <ArrowRight />
      </button>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}>
        {open ? <X /> : <Menu />}
      </button>
      {open && (
        <nav className="mobile-nav">
          <a href="#how" onClick={close}>Comment ça marche</a>
          <a href="#method" onClick={close}>Fonctionnalités</a>
          <a href="#reviews" onClick={close}>Avis</a>
        </nav>
      )}
    </header>
  )
}

export function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [shown, setShown] = useState(0)
  useEffect(() => {
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1200)
      setShown(Math.round(value * (1 - Math.pow(1 - p, 3))))
      if (p < 1) requestAnimationFrame(tick)
    }
    const frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value])
  return <>{new Intl.NumberFormat('fr-FR').format(shown)}{suffix}</>
}

export function FlowTop({ step, onBack }: { step: number; onBack: () => void }) {
  const progress = Math.round(((step + 1) / questions.length) * 100)
  return (
    <header className="flow-top">
      <div className="flow-top-side">
        <button className="back-button" onClick={onBack} aria-label="Revenir à l’étape précédente">
          <ArrowLeft /><span>Retour</span>
        </button>
        <Wordmark />
      </div>
      <div className="flow-progress" aria-label={`Progression : ${progress} %`}>
        <i style={{ width: `${progress}%` }} />
      </div>
      <span className="mono-note">{String(step + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}</span>
    </header>
  )
}
