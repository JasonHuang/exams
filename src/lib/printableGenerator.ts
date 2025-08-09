import { PrintableSettings, PrintableProblem, PrintablePage } from '@/types/printable'

// 生成随机数
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 获取运算符号
function getOperationSymbol(operation: string): string {
  const symbols = {
    multiplication: '×',
    addition: '+',
    subtraction: '-',
    division: '÷'
  }
  return symbols[operation as keyof typeof symbols] || '+'
}

// 生成单个题目
function generatePrintableProblem(settings: PrintableSettings): PrintableProblem {
  const { operationTypes, numberRange } = settings
  
  // 如果没有选择运算类型，默认使用加法
  const validOperationTypes = (!operationTypes || operationTypes.length === 0) 
    ? ['addition'] 
    : operationTypes
  
  // 随机选择一个运算类型
  const operationType = validOperationTypes[Math.floor(Math.random() * validOperationTypes.length)]
  
  let operand1: number, operand2: number, answer: number

  switch (operationType) {
    case 'multiplication':
      operand1 = getRandomNumber(numberRange.min, numberRange.max)
      operand2 = getRandomNumber(numberRange.min, numberRange.max)
      answer = operand1 * operand2
      break
    
    case 'addition':
      operand1 = getRandomNumber(numberRange.min, numberRange.max)
      operand2 = getRandomNumber(numberRange.min, numberRange.max)
      answer = operand1 + operand2
      break
    
    case 'subtraction':
      operand1 = getRandomNumber(numberRange.min, numberRange.max)
      operand2 = getRandomNumber(numberRange.min, Math.min(operand1, numberRange.max))
      answer = operand1 - operand2
      break
    
    case 'division':
      // 确保整除
      operand2 = getRandomNumber(numberRange.min, numberRange.max)
      answer = getRandomNumber(1, numberRange.max)
      operand1 = operand2 * answer
      break
    
    default:
      operand1 = getRandomNumber(numberRange.min, numberRange.max)
      operand2 = getRandomNumber(numberRange.min, numberRange.max)
      answer = operand1 + operand2
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    operand1,
    operand2,
    answer,
    operation: getOperationSymbol(operationType)
  }
}

// 生成可打印的习题页面
export function generatePrintablePages(settings: PrintableSettings): PrintablePage[] {
  const pages: PrintablePage[] = []
  
  for (let pageNum = 1; pageNum <= settings.pageCount; pageNum++) {
    const problems: PrintableProblem[] = []
    
    for (let i = 0; i < settings.problemsPerPage; i++) {
      problems.push(generatePrintableProblem(settings))
    }
    
    const operationNames = {
      multiplication: '乘法',
      addition: '加法',
      subtraction: '减法',
      division: '除法'
    }
    
    // 生成标题，如果是多种运算类型，显示"混合运算"
    let defaultTitle = '数学练习题'
    if (settings.operationTypes && settings.operationTypes.length > 0) {
      if (settings.operationTypes.length === 1) {
        defaultTitle = `${operationNames[settings.operationTypes[0]]}练习题`
      } else {
        const typeNames = settings.operationTypes.map(type => operationNames[type]).join('、')
        defaultTitle = `${typeNames}混合练习题`
      }
    }
    
    const title = settings.title || defaultTitle
    
    pages.push({
      pageNumber: pageNum,
      problems,
      title: `${title} (第${pageNum}页)`
    })
  }
  
  return pages
}

// 获取默认设置
export function getDefaultPrintableSettings(): PrintableSettings {
  return {
    operationTypes: ['multiplication'],
    problemsPerPage: 72,
    pageCount: 1,
    numberRange: { min: 1, max: 9 },
    title: '数学练习题',
    showAnswers: false
  }
}