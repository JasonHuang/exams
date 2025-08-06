// 数学题类型定义
export type OperationType = 'addition' | 'subtraction' | 'multiplication' | 'division'

export type DifficultyLevel = 'easy' | 'medium' | 'hard'

export interface MathProblem {
  id: string
  type: OperationType
  operand1: number
  operand2: number
  answer: number
  userAnswer?: number
  isCorrect?: boolean
  timeSpent?: number
  difficulty: DifficultyLevel
}

export interface PracticeSettings {
  operationType: OperationType[]
  difficulty: DifficultyLevel
  problemCount: number
  timeLimit?: number
  numberRange: {
    min: number
    max: number
  }
}

export interface PracticeSession {
  id: string
  startTime: Date
  endTime?: Date
  problems: MathProblem[]
  score: number
  totalTime: number
  settings: PracticeSettings
}

export interface UserStats {
  totalProblems: number
  correctAnswers: number
  averageTime: number
  strongestOperation: OperationType
  weakestOperation: OperationType
  recentSessions: PracticeSession[]
}