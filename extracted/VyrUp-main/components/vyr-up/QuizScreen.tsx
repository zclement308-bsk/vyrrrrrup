'use client'

import { ChevronRight, Sparkles } from 'lucide-react'
import { questions } from './quiz-data'
import { FlowTop, Wordmark } from './shared'

export function QuizScreen({ step, answer, onAnswer, onBack }: { step: number; answer?: string; onAnswer: (value: string) => void; onBack: () => void }) {
  const question = questions[step]
  return (
    <div className="flow-shell quiz-flow">
      <FlowTop step={step} onBack={onBack} />
      <div className="quiz-aura" aria-hidden="true" />
      <div className="quiz-logo-watermark" aria-hidden="true"><Wordmark /></div>
      <section className="quiz-panel" key={question.id}>
        <div className="question-copy">
          <span className="section-label q-reveal" style={{ '--q-delay': '0ms' } as React.CSSProperties}>{question.eyebrow}</span>
          <h1 className="q-reveal" style={{ '--q-delay': '100ms' } as React.CSSProperties}>{question.title}</h1>
          <p className="q-reveal" style={{ '--q-delay': '220ms' } as React.CSSProperties}>{question.subtitle}</p>
        </div>
        <div className="answer-grid">
          {question.options.map((option, index) => {
            const Icon = option.icon
            return (
              <button
                className={[answer === option.label ? 'selected' : '', option.comingSoon ? 'soon' : ''].filter(Boolean).join(' ')}
                style={{ '--delay': `${380 + index * 110}ms` } as React.CSSProperties}
                key={option.label}
                disabled={option.comingSoon}
                aria-disabled={option.comingSoon}
                onClick={() => { if (!option.comingSoon) onAnswer(option.label) }}
              >
                <span className="answer-icon"><Icon /></span>
                <b>{option.label}{option.comingSoon && <em className="soon-tag">Bientôt</em>}</b>
                <ChevronRight className="answer-arrow" />
              </button>
            )
          })}
        </div>
        <p className="keyboard-hint mono-note q-reveal" style={{ '--q-delay': '500ms' } as React.CSSProperties}><Sparkles /> Choisis une réponse pour continuer automatiquement</p>
      </section>
    </div>
  )
}
