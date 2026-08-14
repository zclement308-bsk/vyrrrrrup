export type Screen = 'landing' | 'boot' | 'quiz' | 'handle' | 'story' | 'connect' | 'analyzing' | 'result'

export type VideoInsight = {
  id: string
  title: string
  coverUrl: string
  views: string
  viewCount: number
  engagement: string
}

export type Result = {
  profile: { displayName: string; username: string; avatarUrl: string; following: string; followers: string; likes: string }
  metrics: { videosAnalyzed: number; averageViews: string; medianViews: string; engagement: string; score: number; consistency: number }
  analysis: { niche: string; summary: string; hashtags: string[]; strengths: string[]; improvements: string[]; priority: string }
  videos: { strongest: VideoInsight[]; weakest: VideoInsight[] }
}

export type QuestionOption = {
  label: string
  icon: React.ElementType
}

export type Question = {
  id: string
  eyebrow: string
  title: string
  subtitle: string
  options: QuestionOption[]
  skipIf?: (answers: Record<string, string>) => boolean
}
