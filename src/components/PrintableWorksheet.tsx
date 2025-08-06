'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PrintableSettings, PrintablePage } from '@/types/printable'
import { generatePrintablePages, getDefaultPrintableSettings } from '@/lib/printableGenerator'
import { Printer, Download, Eye } from 'lucide-react'

export default function PrintableWorksheet() {
  const [settings, setSettings] = useState<PrintableSettings>(getDefaultPrintableSettings())
  const [pages, setPages] = useState<PrintablePage[]>([])
  const [showPreview, setShowPreview] = useState(false)

  const handleGenerate = () => {
    const generatedPages = generatePrintablePages(settings)
    setPages(generatedPages)
    setShowPreview(true)
  }

  const handlePrint = () => {
    window.print()
  }

  const updateSettings = (key: keyof PrintableSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const updateNumberRange = (type: 'min' | 'max', value: number) => {
    setSettings(prev => ({
      ...prev,
      numberRange: {
        ...prev.numberRange,
        [type]: value
      }
    }))
  }

  if (showPreview && pages.length > 0) {
    return (
      <div className="space-y-4">
        {/* 控制按钮 */}
        <div className="flex gap-2 print:hidden">
          <Button onClick={() => setShowPreview(false)} variant="outline">
            ← 返回设置
          </Button>
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="w-4 h-4" />
            打印
          </Button>
        </div>

        {/* 可打印内容 */}
        <div className="print-content">
          {pages.map((page, pageIndex) => (
            <div key={pageIndex} className="page-break">
              <div className="printable-page">
                {/* 页面标题 */}
                <div className="page-header">
                  <h1 className="page-title">{page.title}</h1>
                  <div className="page-info">
                    <span>姓名：_______________</span>
                    <span>班级：_______________</span>
                    <span>日期：_______________</span>
                  </div>
                </div>

                {/* 题目网格 */}
                <div className="problems-grid">
                  {page.problems.map((problem, index) => (
                    <div key={problem.id} className="problem-item">
                      <span className="problem-text">
                        {problem.operand1} {problem.operation} {problem.operand2} = 
                      </span>
                    </div>
                  ))}
                </div>

                {/* 页脚 */}
                <div className="page-footer">
                  <span>第 {page.pageNumber} 页</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 打印样式 */}
        <style jsx global>{`
          @media print {
            @page {
              margin: 15mm;
              size: A4;
            }
            
            /* 隐藏不需要的元素 */
            .print\\:hidden,
            nav, header, footer, aside,
            button, .no-print {
              display: none !important;
            }
            
            /* 确保打印内容可见 */
            .printable-content {
              display: block !important;
              position: static !important;
              width: 100% !important;
              height: auto !important;
              background: white !important;
              margin: 0 !important;
              padding: 0 !important;
              visibility: visible !important;
            }
            
            .printable-content * {
              visibility: visible !important;
            }
            
            .print-page {
              width: 100% !important;
              min-height: auto !important;
              padding: 0 !important;
              margin: 0 !important;
              box-sizing: border-box !important;
              page-break-after: always !important;
              background: white !important;
              box-shadow: none !important;
              display: block !important;
            }
            
            .print-page:last-child {
              page-break-after: auto !important;
            }
            
            .page-header {
              margin-bottom: 20px !important;
              border-bottom: 2px solid #000 !important;
              padding-bottom: 10px !important;
              display: block !important;
            }
            
            .page-title {
              font-size: 18pt !important;
              font-weight: bold !important;
              text-align: center !important;
              margin-bottom: 10px !important;
              color: #000 !important;
              display: block !important;
            }
            
            .student-info {
              display: flex !important;
              justify-content: space-between !important;
              margin-bottom: 20px !important;
              font-size: 12pt !important;
              color: #000 !important;
            }
            
            .problems-grid {
              display: grid !important;
              grid-template-columns: repeat(4, 1fr) !important;
              gap: 8px 5px !important;
              margin-bottom: 20px !important;
            }
            
            .problem-item {
              display: block !important;
              font-size: 12pt !important;
              line-height: 1.5 !important;
              color: #000 !important;
              text-align: left !important;
            }
            
            .problem-text {
              font-weight: normal !important;
              color: #000 !important;
              display: inline !important;
            }
            
            .page-footer {
              text-align: center !important;
              font-size: 10pt !important;
              color: #000 !important;
              margin-top: 20px !important;
              display: block !important;
            }
          }

          .page-break {
            page-break-after: always;
          }

          .page-break:last-child {
            page-break-after: auto;
          }

          .printable-page {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 20mm;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
          }

          .page-header {
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 15px;
          }

          .page-title {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 15px;
            color: #333;
          }

          .page-info {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: #666;
          }

          .problems-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px 15px;
            margin-bottom: 30px;
          }

          .problem-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 16px;
            line-height: 1.5;
          }

          .problem-number {
            font-weight: bold;
            color: #666;
            min-width: 25px;
          }

          .problem-text {
            font-weight: 500;
            color: #333;
          }

          .answer-line {
            border-bottom: 1px solid #333;
            min-width: 60px;
            height: 20px;
            margin-left: 5px;
          }

          .page-footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
            margin-top: auto;
          }
        `}</style>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Printer className="w-5 h-5" />
          可打印习题生成器
        </CardTitle>
        <CardDescription>
          生成适合打印的A4格式数学练习题
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 运算类型选择 */}
        <div className="space-y-2">
          <Label htmlFor="operation">运算类型</Label>
          <Select
            value={settings.operationType}
            onValueChange={(value) => updateSettings('operationType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择运算类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="multiplication">乘法 (×)</SelectItem>
              <SelectItem value="addition">加法 (+)</SelectItem>
              <SelectItem value="subtraction">减法 (-)</SelectItem>
              <SelectItem value="division">除法 (÷)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 数字范围设置 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="min-range">最小值</Label>
            <Input
              id="min-range"
              type="number"
              value={settings.numberRange.min}
              onChange={(e) => updateNumberRange('min', parseInt(e.target.value) || 1)}
              min="1"
              max="100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-range">最大值</Label>
            <Input
              id="max-range"
              type="number"
              value={settings.numberRange.max}
              onChange={(e) => updateNumberRange('max', parseInt(e.target.value) || 9)}
              min="1"
              max="100"
            />
          </div>
        </div>

        {/* 题目设置 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="problems-per-page">每页题目数</Label>
            <Input
              id="problems-per-page"
              type="number"
              value={settings.problemsPerPage}
              onChange={(e) => updateSettings('problemsPerPage', parseInt(e.target.value) || 70)}
              min="10"
              max="100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="page-count">页数</Label>
            <Input
              id="page-count"
              type="number"
              value={settings.pageCount}
              onChange={(e) => updateSettings('pageCount', parseInt(e.target.value) || 1)}
              min="1"
              max="10"
            />
          </div>
        </div>

        {/* 标题设置 */}
        <div className="space-y-2">
          <Label htmlFor="title">习题标题</Label>
          <Input
            id="title"
            value={settings.title || ''}
            onChange={(e) => updateSettings('title', e.target.value)}
            placeholder="例如：三年级乘法练习"
          />
        </div>

        {/* 预览信息 */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">预览信息</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>运算类型: {
              settings.operationType === 'multiplication' ? '乘法' :
              settings.operationType === 'addition' ? '加法' :
              settings.operationType === 'subtraction' ? '减法' : '除法'
            }</p>
            <p>数字范围: {settings.numberRange.min} - {settings.numberRange.max}</p>
            <p>总题目数: {settings.problemsPerPage * settings.pageCount} 道题</p>
            <p>页数: {settings.pageCount} 页</p>
          </div>
        </div>

        {/* 生成按钮 */}
        <Button onClick={handleGenerate} size="lg" className="w-full">
          <Eye className="w-4 h-4 mr-2" />
          生成并预览习题
        </Button>
      </CardContent>
    </Card>
  )
}