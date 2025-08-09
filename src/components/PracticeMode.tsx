'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MathProblem, PracticeSettings } from '@/types/math'
import { generatePracticeProblems, formatProblem } from '@/lib/mathGenerator'

export default function PracticeMode() {
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null)
  const [problems, setProblems] = useState<MathProblem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [isSessionActive, setIsSessionActive] = useState(false)

  const defaultSettings: PracticeSettings = {
    operationType: ['addition', 'subtraction'],
    difficulty: 'easy',
    problemCount: 10,
    numberRange: { min: 1, max: 20 }
  }

  const startPractice = () => {
    const newProblems = generatePracticeProblems(defaultSettings)
    setProblems(newProblems)
    setCurrentProblem(newProblems[0])
    setCurrentIndex(0)
    setScore(0)
    setIsSessionActive(true)
    setShowResult(false)
    setUserAnswer('')
  }

  const submitAnswer = () => {
    if (!currentProblem || userAnswer === '') return

    const answer = parseInt(userAnswer, 10)
    
    // 检查 parseInt 是否返回有效数字
    if (isNaN(answer)) {
      console.log('用户输入无效:', userAnswer)
      return
    }
    
    const isCorrect = answer === currentProblem.answer
    
    if (isCorrect) {
      setScore(score + 1)
    }

    // 更新当前题目
    const updatedProblem = {
      ...currentProblem,
      userAnswer: answer,
      isCorrect
    }

    // 更新当前题目状态
    setCurrentProblem(updatedProblem)
    setShowResult(true)
    
    // 2秒后显示下一题
    setTimeout(() => {
      if (currentIndex < problems.length - 1) {
        const nextIndex = currentIndex + 1
        setCurrentIndex(nextIndex)
        setCurrentProblem(problems[nextIndex])
        setUserAnswer('')
        setShowResult(false)
      } else {
        // 练习结束
        setIsSessionActive(false)
        setCurrentProblem(null)
      }
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showResult) {
      submitAnswer()
    }
  }

  if (!isSessionActive && !currentProblem) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>数学练习</CardTitle>
          <CardDescription>
            开始你的数学练习之旅！
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              准备好了吗？点击开始按钮开始练习！
            </p>
            <Button onClick={startPractice} size="lg">
              开始练习
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!isSessionActive && problems.length > 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>练习完成！</CardTitle>
          <CardDescription>
            恭喜你完成了这次练习
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {score}/{problems.length}
            </div>
            <p className="text-lg text-gray-600 mb-4">
              正确率: {Math.round((score / problems.length) * 100)}%
            </p>
            <Button onClick={startPractice} size="lg">
              再来一次
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>第 {currentIndex + 1} 题 / {problems.length}</CardTitle>
        <CardDescription>
          当前得分: {score} 分
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentProblem && (
          <div className="text-center">
            <div className="math-problem mb-6">
              {formatProblem(currentProblem)}
            </div>
            
            {!showResult ? (
              <div className="space-y-4">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="answer-input w-32 h-12 border-2 border-gray-300 rounded-lg text-center text-lg"
                  placeholder="答案"
                  autoFocus
                />
                <div>
                  <Button 
                    onClick={submitAnswer} 
                    disabled={userAnswer === ''}
                    size="lg"
                  >
                    提交答案
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`text-2xl font-bold ${
                  currentProblem.isCorrect ? 'text-green-600' : 'text-red-600'
                }`}>
                  {currentProblem.isCorrect ? '✓ 正确！' : '✗ 错误'}
                </div>
                {!currentProblem.isCorrect && (
                  <div className="text-lg text-gray-600">
                    正确答案是: {currentProblem.answer}
                  </div>
                )}
                <div className="text-sm text-gray-500">
                  {currentIndex < problems.length - 1 ? '准备下一题...' : '计算最终成绩...'}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}