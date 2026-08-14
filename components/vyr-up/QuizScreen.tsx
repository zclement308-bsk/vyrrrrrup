'use client'

import { useEffect, useState } from 'react'
import { ChevronRight, Sparkles } from 'lucide-react'
import { questions } from './quiz-data'
import { FlowTop } from './shared'

export function QuizScreen({ step, answer, onAnswer, onBack }: { step: number; answer?: string; onAnswer: (value: string) => void; onBack: () => void }) {
  const question = questions[step]
  const [typed, setTyped] = useState('')
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    setTyped('')
    setAnimKey(k => k + 1)
  }, [step])

  useEffect(() => {
    const title = question.title
    let i = 0
    const speed = 28
    const timer = window.setInterval(() => {
      i++
      setTyped(title.slice(0, i))
      if (i >= title.length) window.clearInterval(timer)
    }, speed)
    return () => window.clearInterval(timer)
  }, [animKey, question.title])

  return (
    <div className="flow-shell quiz-flow">
      <FlowTop step={step} onBack={onBack} />
      <div className="quiz-aura" aria-hidden="true" />
      <div className="quiz-logo-watermark" aria-hidden="true"><WordmarkSafe /></div>
      <section className="quiz-panel" key={animKey}>
        <div className="question-copy">
          <span className="section-label q-reveal" style={{ '--q-delay': '0ms' } as React.CSSProperties}>{question.eyebrow}</span>
          <h1 className="q-reveal" style={{ '--q-delay': '100ms' } as React.CSSProperties}>
            {typed}
            <span className="type-cursor" aria-hidden="true" />
          </h1>
          <p className="q-reveal" style={{ '--q-delay': '300ms' } as React.CSSProperties}>{question.subtitle}</p>
        </div>
        <div className="answer-grid">
          {question.options.map((option, index) => {
            const Icon = option.icon
            return (
              <button
                className={answer === option.label ? 'selected' : ''}
                style={{ '--delay': `${450 + index * 90}ms` } as React.CSSProperties}
                key={option.label}
                onClick={() => onAnswer(option.label)}
              >
                <span className="answer-icon"><Icon /></span>
                <b>{option.label}</b>
                <ChevronRight className="answer-arrow" />
              </button>
            )
          })}
        </div>
        <p className="keyboard-hint mono-note q-reveal" style={{ '--q-delay': '600ms' } as React.CSSProperties}><Sparkles /> Choisis une réponse pour continuer automatiquement</p>
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
