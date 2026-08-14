'use client'

import { useEffect, useState } from 'react'
import { questions } from './vyr-up/quiz-data'
import { QuizScreen } from './vyr-up/QuizScreen'
import { HandleScreen } from './vyr-up/HandleScreen'
import { StoryScreen } from './vyr-up/StoryScreen'
import { ConnectScreen } from './vyr-up/ConnectScreen'
import { AnalysisScreen } from './vyr-up/AnalysisScreen'
import { ResultScreen } from './vyr-up/ResultScreen'
import { LandingPage } from './vyr-up/LandingPage'
import { Wordmark } from './vyr-up/shared'
import type { Result, Screen } from './vyr-up/types'

const STORY_AFTER_STEP = 2

function visibleSteps(answers: Record<string, string>): number[] {
  return questions
    .map((q, i) => ({ q, i }))
    .filter(({ q }) => !q.skipIf || !q.skipIf(answers))
    .map(({ i }) => i)
}

function nextStep(current: number, answers: Record<string, string>): number | 'handle' | 'connect' {
  const visible = visibleSteps(answers)
  const pos = visible.indexOf(current)
  if (pos === -1) return visible[0] ?? 0
  if (pos + 1 >= visible.length) return 'connect'
  return visible[pos + 1]
}

function stepPosition(current: number, answers: Record<string, string>): number {
  const visible = visibleSteps(answers)
  return visible.indexOf(current)
}

export function VyrUpLanding() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [quizStep, setQuizStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [handle, setHandle] = useState('')
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
    const currentId = questions[quizStep].id
    const next = { ...answers, [currentId]: value }
    saveAnswers(next)
    window.setTimeout(() => {
      const result = nextStep(quizStep, next)
      if (result === 'connect') {
        if (next.platform) setScreen('handle')
        else setScreen('connect')
      } else if (typeof result === 'number') {
        if (quizStep === STORY_AFTER_STEP) setScreen('story')
        else setQuizStep(result)
      }
    }, 280)
  }

  const submitHandle = (h: string) => {
    setHandle(h)
    const next = { ...answers, handle: h }
    saveAnswers(next)
    setScreen('connect')
  }

  const startAnalysis = async () => {
    setScreen('analyzing'); setError(''); setAnalysisDone(false)
    try {
      const minDelay = new Promise(resolve => setTimeout(resolve, 1800))
      const [response] = await Promise.all([fetch('/api/tiktok/analyze'), minDelay])
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? 'Analyse impossible.')
      setAnalysisDone(true)
      await new Promise(resolve => setTimeout(resolve, 450))
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
        missing_config: "TikTok n'est pas encore configuré côté serveur (variables d'environnement manquantes).",
        denied: 'Connexion TikTok annulée.',
        invalid_state: "La demande de connexion a expiré ou n'est plus valide. Réessaie.",
        token_exchange_failed: 'La connexion à TikTok a échoué. Réessaie dans un instant.',
      }
      setError(messages[oauthError] ?? 'Connexion TikTok impossible.')
      setScreen('connect')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const back = () => {
    if (screen === 'connect') {
      if (handle || answers.platform) { setScreen('handle') }
      else { setScreen('quiz'); setQuizStep(questions.length - 1) }
    }
    else if (screen === 'handle') {
      setScreen('quiz')
      const visible = visibleSteps(answers)
      setQuizStep(visible[visible.length - 1])
    }
    else if (screen === 'story') { setScreen('quiz'); setQuizStep(STORY_AFTER_STEP) }
    else if (quizStep > 0) {
      const visible = visibleSteps(answers)
      const pos = visible.indexOf(quizStep)
      if (pos > 0) setQuizStep(visible[pos - 1])
      else setScreen('landing')
    }
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
  if (screen === 'handle') return <HandleScreen platform={answers.platform || 'TikTok'} initialHandle={handle} onSubmit={submitHandle} onBack={back} />
  if (screen === 'story') return <StoryScreen onContinue={() => {
    const visible = visibleSteps(answers)
    const pos = visible.indexOf(STORY_AFTER_STEP)
    if (pos + 1 < visible.length) setQuizStep(visible[pos + 1])
    setScreen('quiz')
  }} onBack={back} />
  if (screen === 'connect') return <ConnectScreen error={error} onBack={back} />
  if (screen === 'analyzing') return <AnalysisScreen error={error} done={analysisDone} />
  if (screen === 'result' && result) return <ResultScreen result={result} />
  return <LandingPage onStart={start} />
}
