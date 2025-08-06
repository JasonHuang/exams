import { MathProblem, OperationType, DifficultyLevel, PracticeSettings } from '@/types/math'

// 生成随机数
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 根据难度级别获取数字范围
function getNumberRange(difficulty: DifficultyLevel, operation: OperationType) {
  const ranges = {
    easy: {
      addition: { min: 1, max: 20 },
      subtraction: { min: 1, max: 20 },
      multiplication: { min: 1, max: 10 },
      division: { min: 1, max: 10 }
    },
    medium: {
      addition: { min: 10, max: 100 },
      subtraction: { min: 10, max: 100 },
      multiplication: { min: 2, max: 20 },
      division: { min: 2, max: 20 }
    },
    hard: {
      addition: { min: 50, max: 500 },
      subtraction: { min: 50, max: 500 },
      multiplication: { min: 10, max: 50 },
      division: { min: 5, max: 50 }
    }
  }
  
  return ranges[difficulty][operation]
}

// 生成加法题
function generateAddition(difficulty: DifficultyLevel): { operand1: number, operand2: number, answer: number } {
  const range = getNumberRange(difficulty, 'addition')
  const operand1 = getRandomNumber(range.min, range.max)
  const operand2 = getRandomNumber(range.min, range.max)
  return {
    operand1,
    operand2,
    answer: operand1 + operand2
  }
}

// 生成减法题
function generateSubtraction(difficulty: DifficultyLevel): { operand1: number, operand2: number, answer: number } {
  const range = getNumberRange(difficulty, 'subtraction')
  let operand1 = getRandomNumber(range.min, range.max)
  let operand2 = getRandomNumber(range.min, range.max)
  
  // 确保结果为正数
  if (operand1 < operand2) {
    [operand1, operand2] = [operand2, operand1]
  }
  
  return {
    operand1,
    operand2,
    answer: operand1 - operand2
  }
}

// 生成乘法题
function generateMultiplication(difficulty: DifficultyLevel): { operand1: number, operand2: number, answer: number } {
  const range = getNumberRange(difficulty, 'multiplication')
  const operand1 = getRandomNumber(range.min, range.max)
  const operand2 = getRandomNumber(range.min, range.max)
  return {
    operand1,
    operand2,
    answer: operand1 * operand2
  }
}

// 生成除法题
function generateDivision(difficulty: DifficultyLevel): { operand1: number, operand2: number, answer: number } {
  const range = getNumberRange(difficulty, 'division')
  const operand2 = getRandomNumber(range.min, range.max)
  const answer = getRandomNumber(1, range.max)
  const operand1 = operand2 * answer // 确保整除
  
  return {
    operand1,
    operand2,
    answer
  }
}

// 生成单个数学题
export function generateMathProblem(type: OperationType, difficulty: DifficultyLevel): MathProblem {
  let problem: { operand1: number, operand2: number, answer: number }
  
  switch (type) {
    case 'addition':
      problem = generateAddition(difficulty)
      break
    case 'subtraction':
      problem = generateSubtraction(difficulty)
      break
    case 'multiplication':
      problem = generateMultiplication(difficulty)
      break
    case 'division':
      problem = generateDivision(difficulty)
      break
    default:
      problem = generateAddition(difficulty)
  }
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    difficulty,
    ...problem
  }
}

// 生成练习题集
export function generatePracticeProblems(settings: PracticeSettings): MathProblem[] {
  const problems: MathProblem[] = []
  const { operationType, difficulty, problemCount } = settings
  
  for (let i = 0; i < problemCount; i++) {
    // 随机选择运算类型
    const randomType = operationType[Math.floor(Math.random() * operationType.length)]
    const problem = generateMathProblem(randomType, difficulty)
    problems.push(problem)
  }
  
  return problems
}

// 获取运算符号
export function getOperationSymbol(type: OperationType): string {
  const symbols = {
    addition: '+',
    subtraction: '-',
    multiplication: '×',
    division: '÷'
  }
  return symbols[type]
}

// 格式化数学题显示
export function formatProblem(problem: MathProblem): string {
  const symbol = getOperationSymbol(problem.type)
  return `${problem.operand1} ${symbol} ${problem.operand2} = ?`
}