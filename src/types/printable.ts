// 可打印习题相关类型定义
export interface PrintableSettings {
  operationTypes: ('multiplication' | 'addition' | 'subtraction' | 'division')[]
  problemsPerPage: number
  pageCount: number
  numberRange: {
    min: number
    max: number
  }
  title?: string
  showAnswers?: boolean
}

// 年级类型
export type Grade = 'grade1' | 'grade2' | 'grade3' | 'grade4' | 'grade5' | 'grade6'

// 预设模板类型
export interface PresetTemplate {
  id: string
  name: string
  grade: Grade
  operationTypes: ('multiplication' | 'addition' | 'subtraction' | 'division')[]
  numberRange: {
    min: number
    max: number
  }
  problemsPerPage: number
  title: string
}

// 年级信息类型
export interface GradeInfo {
  value: Grade
  label: string
  description: string
}

export interface PrintableProblem {
  id: string
  operand1: number
  operand2: number
  answer: number
  operation: string
}

export interface PrintablePage {
  pageNumber: number
  problems: PrintableProblem[]
  title: string
}