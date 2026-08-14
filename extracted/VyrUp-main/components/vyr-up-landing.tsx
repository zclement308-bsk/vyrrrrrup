'use client'

import { useEffect, useState } from 'react'
import { questions } from './vyr-up/quiz-data'
import { QuizScreen } from './vyr-up/QuizScreen'
import { StoryScreen } from './vyr-up/StoryScreen'
import { ConnectScreen } from './vyr-up/ConnectScreen'
import { AnalysisScreen } from './vyr-up/AnalysisScreen'
import { ResultScreen } from './vyr-up/ResultScreen'
import { LandingPage } from './vyr-up/LandingPage'
import { Wordmark } from './vyr-up/shared'
import type { Result, Screen } from './vyr-up/types'

// Index of the question after which we show the "story" interstitial, and
// the index of the last question (used to size the connect-screen progress
// bar). Named instead of inlined magic numbers (3, 7) so the flow stays
// correct if a question is ever added or removed.
const STORY_AFTER_STEP = 3

export function VyrUpLanding() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [quizStep, setQuizStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')
  const [analysisDone, setAnalysisDone] = useState(false)

  const saveAnswers = (next: Record<string, string>) => {
    setAnswers(next)
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `vyr_answers=${encodeURIComponent(JSON.stringify(next))}; Max-Age=1800; Path=/; SameSite=Lax${secure}`
  }

  const start = () => { setScreen('boot'); window.setTimeout(() => setScreen('quiz'), 900) }

  const answer = (value: string) => {
    const next = { ...answers, [questions[quizStep].id]: value }
    saveAnswers(next)
    window.setTimeout(() => {
      if (quizStep === STORY_AFTER_STEP) setScreen('story')
      else if (quizStep === questions.length - 1) setScreen('connect')
      else setQuizStep(s => s + 1)
    }, 220)
  }

  const startAnalysis = async () => {
    setScreen('analyzing'); setError(''); setAnalysisDone(false)
    try {
      // Run the real request and the minimum "feels like something is
      // happening" delay in parallel instead of back-to-back — previously
      // the app waited for the full API call THEN added 2.5s on top,
      // roughly doubling the wait on a slow connection.
      const minDelay = new Promise(resolve => setTimeout(resolve, 1800))
      const [response] = await Promise.all([fetch('/api/tiktok/analyze'), minDelay])
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? 'Analyse impossible.')
      setAnalysisDone(true)
      await new Promise(resolve => setTimeout(resolve, 450)) // let the bar visually reach 100%
      setResult(data); setScreen('result'); window.history.replaceState({}, '', '/')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Analyse impossible.')
      setTimeout(() => setScreen('connect'), 1600)
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('connected') === '1') void startAnalysis()
    const oauthError = params.get('oauth_error')
    if (oauthError) {
      const messages: Record<string, string> = {
        missing_config: 'TikTok n’est pas encore configuré côté serveur (variables d’environnement manquantes).',
        denied: 'Connexion TikTok annulée.',
        invalid_state: 'La demande de connexion a expiré ou n’est plus valide. Réessaie.',
        token_exchange_failed: 'La connexion à TikTok a échoué. Réessaie dans un instant.',
      }
      setError(messages[oauthError] ?? 'Connexion TikTok impossible.')
      setScreen('connect')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const back = () => {
    if (screen === 'connect') { setScreen('quiz'); setQuizStep(questions.length - 1) }
    else if (screen === 'story') { setScreen('quiz'); setQuizStep(STORY_AFTER_STEP) }
    else if (quizStep > 0) setQuizStep(s => s - 1)
    else setScreen('landing')
  }

  if (screen === 'boot') {
    return (
      <div className="flow-shell boot-screen">
        <div className="boot-logo"><Wordmark /></div>
        <div className="boot-mark"><i /><i /><i /></div>
        <span className="mono-note">PRÉPARATION DE TON EXPÉRIENCE</span>
      </div>
    )
  }
  if (screen === 'quiz') return <QuizScreen step={quizStep} answer={answers[questions[quizStep].id]} onAnswer={answer} onBack={back} />
  if (screen === 'story') return <StoryScreen onContinue={() => { setQuizStep(STORY_AFTER_STEP + 1); setScreen('quiz') }} onBack={back} />
  if (screen === 'connect') return <ConnectScreen error={error} onBack={back} />
  if (screen === 'analyzing') return <AnalysisScreen error={error} done={analysisDone} />
  if (screen === 'result' && result) return <ResultScreen result={result} />
  return <LandingPage onStart={start} />
}
