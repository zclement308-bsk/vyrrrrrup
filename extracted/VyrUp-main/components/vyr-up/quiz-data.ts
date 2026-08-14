import { ChartBar as BarChart3, Check, Eye, Goal, Heart, Lightbulb, Repeat2, Rocket, Sparkles, Star, Target, TrendingDown, TrendingUp, Video, X, Zap } from 'lucide-react'
import { TikTokIcon, InstagramIcon } from './icons'
import type { Question } from './types'

// Only TikTok OAuth + analysis exists server-side today (lib/tiktok.ts,
// app/api/auth/tiktok). Instagram and YouTube are shown so the quiz feels
// complete, but are marked "coming soon" and disabled — previously picking
// them silently dropped the user onto the TikTok connect screen anyway,
// which over-promised support we don't have yet.
export const questions: Question[] = [
  {
    id: 'platform',
    eyebrow: 'TON TERRAIN DE JEU',
    title: 'Où publies-tu le plus ?',
    subtitle: 'On adapte le diagnostic à ton canal principal.',
    options: [
      { label: 'TikTok', icon: TikTokIcon },
      { label: 'Instagram', icon: InstagramIcon, comingSoon: true },
      { label: 'YouTube', icon: Eye, comingSoon: true },
      { label: 'Je débute', icon: Sparkles },
    ],
  },
  { id: 'experience', eyebrow: 'TON EXPÉRIENCE', title: 'Depuis quand crées-tu du contenu ?', subtitle: 'Pas de jugement. Seulement un plan adapté à ton niveau.', options: [{ label: 'Quelques semaines', icon: Sparkles }, { label: 'Plusieurs mois', icon: Repeat2 }, { label: 'Environ un an', icon: BarChart3 }, { label: 'Plusieurs années', icon: Star }] },
  { id: 'frequency', eyebrow: 'TON RYTHME', title: 'Combien de fois publies-tu par semaine ?', subtitle: 'La régularité change complètement la stratégie.', options: [{ label: 'Pas toutes les semaines', icon: TrendingDown }, { label: '1 fois par semaine', icon: Video }, { label: 'Plusieurs fois par semaine', icon: Repeat2 }, { label: 'Tous les jours', icon: Zap }] },
  { id: 'platforms', eyebrow: 'TA PRÉSENCE', title: 'Sur combien de plateformes es-tu actif ?', subtitle: 'On mesure si ton attention est concentrée ou dispersée.', options: [{ label: '1 plateforme', icon: Target }, { label: '2 plateformes', icon: Repeat2 }, { label: '3 plateformes', icon: BarChart3 }, { label: '4 ou plus', icon: Rocket }] },
  { id: 'views', eyebrow: 'TA PORTÉE ACTUELLE', title: 'Combien de vues fais-tu en moyenne ?', subtitle: 'Une estimation suffit, TikTok confirmera ensuite les vrais chiffres.', options: [{ label: 'Moins de 1 000', icon: Eye }, { label: '1 000 à 10 000', icon: Eye }, { label: '10 000 à 100 000', icon: TrendingUp }, { label: 'Plus de 100 000', icon: Rocket }] },
  { id: 'virality', eyebrow: 'TA MÉTHODE', title: 'Utilises-tu des techniques de viralité ?', subtitle: 'Hooks, rétention, rythme : où en es-tu vraiment ?', options: [{ label: "Non, je n’en connais aucune", icon: X }, { label: 'Oui, mais ça ne fonctionne pas', icon: Lightbulb }, { label: 'Parfois, sans vraie méthode', icon: Repeat2 }, { label: 'Oui, avec de bons résultats', icon: Check }] },
  { id: 'blocker', eyebrow: 'TON FREIN PRINCIPAL', title: 'Qu’est-ce qui bloque ta croissance ?', subtitle: 'Cette réponse déterminera la priorité de ton plan.', options: [{ label: 'Personne ne regarde mes vidéos', icon: Eye }, { label: "Je manque d’idées créatives", icon: Lightbulb }, { label: 'Je publie trop irrégulièrement', icon: Repeat2 }, { label: 'Je ne sais pas monétiser', icon: Goal }] },
  { id: 'goal', eyebrow: 'TA DESTINATION', title: 'Quel est ton objectif ultime ?', subtitle: 'On ne construit pas le même plan pour chaque ambition.', options: [{ label: 'Construire une audience engagée', icon: Heart }, { label: 'Vivre de mes vidéos', icon: Star }, { label: 'Gagner mes premiers 1 000 €', icon: Goal }, { label: 'Devenir une référence', icon: Rocket }] },
]

export const reviews: [string, string, string][] = [
  ['Maëva R.', '@maeva.cree', 'Mes intros étaient trop longues. Je l’ai compris en deux minutes.'],
  ['Nassim B.', '@nassim.enligne', 'Enfin une direction claire au lieu de poster au hasard.'],
  ['Jade L.', '@jadeauquotidien', 'Les recommandations sont précises et directement applicables.'],
]
