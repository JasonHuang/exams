// 可打印习题相关类型定义
export interface PrintableSettings {
  operationType: 'multiplication' | 'addition' | 'subtraction' | 'division'
  problemsPerPage: number
  pageCount: number
  numberRange: {
    min: number
    max: number
  }
  title?: string
  showAnswers?: boolean
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