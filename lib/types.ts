export interface Question {
  id: number
  group: string
  text: string
  options: string[]
}

export interface BasicInfo {
  name: string
  age: string
  job: string
  mbti: string
}

export interface Answer {
  question: string
  answer: string
}

export interface QuizState extends BasicInfo {
  answers: Answer[]
}

export interface UserManual {
  preserve: string[]
  avoid: string[]
  priority: string[]
}

export interface AnalysisResult {
  personality_summary: string
  strengths: string[]
  weaknesses: string[]
  love_style: string
  ideal_partner: string[]
  how_to_approach: string[]
  things_to_avoid: string[]
  difficulty_score: number
  difficulty_reason: string
  user_manual: UserManual
  compatibility_score: number
}
