'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { PrintableSettings, PrintablePage, PresetTemplate, Grade, GradeInfo } from '@/types/printable'
import { generatePrintablePages, getDefaultPrintableSettings } from '@/lib/printableGenerator'
import { Download, Eye } from 'lucide-react'

// 预设模板定义
// 年级信息
const gradeOptions: GradeInfo[] = [
  { value: 'grade1', label: '一年级', description: '10-20以内加减法基础' },
  { value: 'grade2', label: '二年级', description: '100以内加减法、乘法口诀' },
  { value: 'grade3', label: '三年级', description: '多位数运算、四则运算完成' },
  { value: 'grade4', label: '四年级', description: '大数运算、小数认识' },
  { value: 'grade5', label: '五年级', description: '小数运算、分数基础' },
  { value: 'grade6', label: '六年级', description: '分数运算、百分数、综合应用' }
]

// 按年级分类的预设模板
const presetTemplates: PresetTemplate[] = [
  // 一年级模板
  {
    id: 'grade1-add-10',
    name: '10以内加法练习',
    grade: 'grade1',
    operationTypes: ['addition'],
    numberRange: { min: 1, max: 10 },
    problemsPerPage: 60,
    title: '一年级10以内加法练习'
  },
  {
    id: 'grade1-sub-10',
    name: '10以内减法练习',
    grade: 'grade1',
    operationTypes: ['subtraction'],
    numberRange: { min: 1, max: 10 },
    problemsPerPage: 60,
    title: '一年级10以内减法练习'
  },
  {
    id: 'grade1-add-sub-10',
    name: '10以内加减混合',
    grade: 'grade1',
    operationTypes: ['addition', 'subtraction'],
    numberRange: { min: 1, max: 10 },
    problemsPerPage: 60,
    title: '一年级10以内加减法练习'
  },
  {
    id: 'grade1-add-sub-20',
    name: '20以内加减法',
    grade: 'grade1',
    operationTypes: ['addition', 'subtraction'],
    numberRange: { min: 1, max: 20 },
    problemsPerPage: 48,
    title: '一年级20以内加减法练习'
  },
  {
    id: 'grade1-add-sub-100',
    name: '100以内加减法',
    grade: 'grade1',
    operationTypes: ['addition', 'subtraction'],
    numberRange: { min: 1, max: 100 },
    problemsPerPage: 40,
    title: '一年级100以内加减法练习'
  },

  // 二年级模板
  {
    id: 'grade2-add-sub-20',
    name: '20以内加减混合',
    grade: 'grade2',
    operationTypes: ['addition', 'subtraction'],
    numberRange: { min: 1, max: 20 },
    problemsPerPage: 60,
    title: '二年级20以内加减混合练习'
  },
  {
    id: 'grade2-add-sub-100',
    name: '100以内加减法',
    grade: 'grade2',
    operationTypes: ['addition', 'subtraction'],
    numberRange: { min: 1, max: 100 },
    problemsPerPage: 48,
    title: '二年级100以内加减法练习'
  },
  {
    id: 'grade2-mult-table-2-5',
    name: '乘法口诀(2-5)',
    grade: 'grade2',
    operationTypes: ['multiplication'],
    numberRange: { min: 2, max: 5 },
    problemsPerPage: 60,
    title: '二年级乘法口诀练习(2-5)'
  },
  {
    id: 'grade2-mult-table-6-9',
    name: '乘法口诀(6-9)',
    grade: 'grade2',
    operationTypes: ['multiplication'],
    numberRange: { min: 6, max: 9 },
    problemsPerPage: 60,
    title: '二年级乘法口诀练习(6-9)'
  },
  {
    id: 'grade2-mult-table-all',
    name: '乘法口诀综合',
    grade: 'grade2',
    operationTypes: ['multiplication'],
    numberRange: { min: 1, max: 9 },
    problemsPerPage: 60,
    title: '二年级乘法口诀综合练习'
  },
  {
    id: 'grade2-easy-div',
    name: '简单除法练习',
    grade: 'grade2',
    operationTypes: ['division'],
    numberRange: { min: 1, max: 9 },
    problemsPerPage: 48,
    title: '二年级简单除法练习'
  },
  {
    id: 'grade2-comprehensive',
    name: '综合练习',
    grade: 'grade2',
    operationTypes: ['addition', 'subtraction', 'multiplication'],
    numberRange: { min: 1, max: 50 },
    problemsPerPage: 48,
    title: '二年级数学综合练习'
  },

  // 三年级模板
  {
    id: 'grade3-mult-div-basic',
    name: '乘除法基础练习',
    grade: 'grade3',
    operationTypes: ['multiplication', 'division'],
    numberRange: { min: 1, max: 100 },
    problemsPerPage: 48,
    title: '三年级乘除法基础练习'
  },
  {
    id: 'grade3-four-operations',
    name: '四则运算混合',
    grade: 'grade3',
    operationTypes: ['addition', 'subtraction', 'multiplication', 'division'],
    numberRange: { min: 1, max: 100 },
    problemsPerPage: 40,
    title: '三年级四则运算混合练习'
  },
  {
    id: 'grade3-multi-digit',
    name: '多位数运算',
    grade: 'grade3',
    operationTypes: ['addition', 'subtraction', 'multiplication'],
    numberRange: { min: 10, max: 1000 },
    problemsPerPage: 36,
    title: '三年级多位数运算练习'
  },

  // 四年级模板
  {
    id: 'grade4-large-numbers',
    name: '大数运算',
    grade: 'grade4',
    operationTypes: ['addition', 'subtraction', 'multiplication', 'division'],
    numberRange: { min: 100, max: 10000 },
    problemsPerPage: 32,
    title: '四年级大数运算练习'
  },
  {
    id: 'grade4-multi-digit-mult',
    name: '多位数乘法',
    grade: 'grade4',
    operationTypes: ['multiplication'],
    numberRange: { min: 10, max: 999 },
    problemsPerPage: 24,
    title: '四年级多位数乘法练习'
  },
  {
    id: 'grade4-multi-digit-div',
    name: '多位数除法',
    grade: 'grade4',
    operationTypes: ['division'],
    numberRange: { min: 10, max: 999 },
    problemsPerPage: 24,
    title: '四年级多位数除法练习'
  },
  {
    id: 'grade4-comprehensive',
    name: '四则运算综合',
    grade: 'grade4',
    operationTypes: ['addition', 'subtraction', 'multiplication', 'division'],
    numberRange: { min: 1, max: 1000 },
    problemsPerPage: 30,
    title: '四年级四则运算综合练习'
  },

  // 五年级模板
  {
    id: 'grade5-integer-review',
    name: '整数运算复习',
    grade: 'grade5',
    operationTypes: ['addition', 'subtraction', 'multiplication', 'division'],
    numberRange: { min: 1, max: 10000 },
    problemsPerPage: 28,
    title: '五年级整数运算复习'
  },
  {
    id: 'grade5-complex-calc',
    name: '复杂计算练习',
    grade: 'grade5',
    operationTypes: ['multiplication', 'division'],
    numberRange: { min: 10, max: 10000 },
    problemsPerPage: 24,
    title: '五年级复杂计算练习'
  },
  {
    id: 'grade5-mixed-advanced',
    name: '混合运算提高',
    grade: 'grade5',
    operationTypes: ['addition', 'subtraction', 'multiplication', 'division'],
    numberRange: { min: 1, max: 5000 },
    problemsPerPage: 20,
    title: '五年级混合运算提高练习'
  },

  // 六年级模板
  {
    id: 'grade6-comprehensive',
    name: '综合运算练习',
    grade: 'grade6',
    operationTypes: ['addition', 'subtraction', 'multiplication', 'division'],
    numberRange: { min: 1, max: 10000 },
    problemsPerPage: 24,
    title: '六年级综合运算练习'
  },
  {
    id: 'grade6-advanced-calc',
    name: '高级计算练习',
    grade: 'grade6',
    operationTypes: ['multiplication', 'division'],
    numberRange: { min: 100, max: 50000 },
    problemsPerPage: 20,
    title: '六年级高级计算练习'
  },
  {
    id: 'grade6-graduation-prep',
    name: '毕业复习练习',
    grade: 'grade6',
    operationTypes: ['addition', 'subtraction', 'multiplication', 'division'],
    numberRange: { min: 1, max: 20000 },
    problemsPerPage: 25,
    title: '六年级毕业复习练习'
  }
]

export default function PrintableWorksheet() {
  const [settings, setSettings] = useState<PrintableSettings>(getDefaultPrintableSettings())
  const [pages, setPages] = useState<PrintablePage[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [selectedGrade, setSelectedGrade] = useState<Grade>('grade2')
  const [selectedPreset, setSelectedPreset] = useState<string>('custom')
  const printableRef = useRef<HTMLDivElement>(null)

  const handleGenerate = () => {
    const generatedPages = generatePrintablePages(settings)
    setPages(generatedPages)
    setShowPreview(true)
  }



  const handleDownloadPDF = async () => {
    if (!printableRef.current) return;

    try {
      // 动态导入库以避免SSR问题
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageElements = printableRef.current.querySelectorAll('.printable-page');
      
      for (let i = 0; i < pageElements.length; i++) {
        const pageElement = pageElements[i] as HTMLElement;
        
        // 为每个页面单独生成canvas
        const canvas = await html2canvas(pageElement, {
          scale: 3,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: pageElement.scrollWidth,
          height: pageElement.scrollHeight
        });
        
        const imgData = canvas.toDataURL('image/png');
        
        // 如果不是第一页，添加新页面
        if (i > 0) {
          pdf.addPage();
        }
        
        // 计算图片在PDF中的尺寸，确保完整显示
        const imgWidth = 210; // A4宽度
        const imgHeight = 297; // A4高度
        
        // 添加图片到PDF页面
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      }

      // 下载PDF
      pdf.save(`${settings.title || '数学练习题'}.pdf`);
    } catch (error) {
      console.error('生成PDF时出错:', error);
      alert('生成PDF失败，请重试');
    }
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

  const handleGradeChange = (grade: Grade) => {
    setSelectedGrade(grade)
    setSelectedPreset('custom') // 切换年级时重置为自定义
  }

  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId)
    if (presetId === 'custom') return // 如果选择"自定义"，不更新设置
    
    const preset = presetTemplates.find(p => p.id === presetId)
    if (preset) {
      setSettings({
        operationTypes: preset.operationTypes,
        problemsPerPage: preset.problemsPerPage,
        pageCount: 1,
        numberRange: preset.numberRange,
        title: preset.title,
        showAnswers: false
      })
    }
  }

  // 根据选择的年级过滤预设模板
  const filteredPresetTemplates = presetTemplates.filter(template => template.grade === selectedGrade)

  const handleOperationTypeChange = (operationType: string, checked: boolean) => {
    setSettings(prev => {
      const newOperationTypes = checked 
        ? [...prev.operationTypes, operationType as any]
        : prev.operationTypes.filter(type => type !== operationType)
      
      // 确保至少选择一种运算类型
      if (newOperationTypes.length === 0) {
        return prev
      }
      
      return {
        ...prev,
        operationTypes: newOperationTypes
      }
    })
  }

  if (showPreview && pages.length > 0) {
    return (
      <div className="space-y-4">
        {/* 控制按钮 */}
        <div className="flex gap-2 print:hidden">
          <Button onClick={() => setShowPreview(false)} variant="outline">
            ← 返回设置
          </Button>
          <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            下载PDF
          </Button>
        </div>

        {/* 可打印内容 */}
        <div className="print-content" ref={printableRef}>
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
          /* PDF专用样式 */
          .printable-content {
            background: white;
            color: black;
            font-family: 'SimSun', serif;
          }

          .print-page {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto 20px;
            padding: 20mm;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            page-break-after: always;
          }

          .print-page:last-child {
            page-break-after: avoid;
          }

          .page-header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 1px solid #333;
            padding-bottom: 10px;
          }

          .page-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 5px;
          }

          .page-subtitle {
            font-size: 12px;
            color: #666;
          }

          .student-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            font-size: 12px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
          }

          .problems-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 0;
            margin-bottom: 0;
            flex: 1;
            align-content: space-evenly;
          }

          .problem-item {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 16px;
            line-height: 2.0;
            padding: 10px 6px;
            border: none;
            border-radius: 0;
            min-height: auto;
          }

          .page-footer {
            text-align: center;
            margin-top: 30px;
            font-size: 10px;
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }

          @media print {
            /* 隐藏非打印元素 */
            .print\\:hidden,
            nav,
            header,
            footer,
            .no-print,
            button,
            .sidebar {
              display: none !important;
            }

            /* 确保打印内容可见 */
            .printable-content,
            .printable-content * {
              visibility: visible !important;
            }

            /* 页面设置 */
            @page {
              margin: 10mm;
              size: A4;
            }

            body {
              margin: 0;
              padding: 0;
              background: white !important;
              color: black !important;
            }

            .print-page {
              width: 100% !important;
              height: 297mm !important;
              margin: 0 !important;
              padding: 15mm !important;
              box-shadow: none !important;
              page-break-after: always !important;
              page-break-inside: avoid !important;
              display: flex !important;
              flex-direction: column !important;
              overflow: hidden !important;
            }

            .printable-page {
              page-break-after: always !important;
              page-break-inside: avoid !important;
            }

            .page-header {
              page-break-after: avoid !important;
              page-break-inside: avoid !important;
            }

            .problems-grid {
              grid-template-columns: repeat(4, 1fr) !important;
              gap: 0 !important;
              flex: 1 !important;
              align-content: space-evenly !important;
              margin-bottom: 0 !important;
            }

            .problem-item {
              font-size: 16px !important;
              padding: 10px 6px !important;
              border: none !important;
              line-height: 2.0 !important;
              min-height: auto !important;
            }
          }

          .page-break {
            page-break-after: always;
            page-break-inside: avoid;
          }

          .page-break:last-child {
            page-break-after: auto;
          }

          .printable-page {
            width: 210mm;
            height: 297mm;
            margin: 0 auto;
            padding: 15mm;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            page-break-inside: avoid;
          }

          .page-header {
            margin-bottom: 10px;
            border-bottom: 1px solid #333;
            padding-bottom: 5px;
            flex-shrink: 0;
          }

          .page-title {
            font-size: 22px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 12px;
            color: #333;
          }

          .page-info {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
            color: #666;
            margin-bottom: 5px;
          }



          .problem-number {
            font-weight: bold;
            color: #666;
            min-width: 28px;
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
            font-size: 13px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
            margin-top: auto;
            flex-shrink: 0;
            page-break-inside: avoid;
            font-weight: 500;
          }
        `}</style>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          可打印习题生成器
        </CardTitle>
        <CardDescription>
          生成适合打印的A4格式数学练习题
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {/* 年级选择和预设模板 - 两列布局 */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="grade" className="text-xs text-gray-600 mb-1 block">年级</Label>
            <Select
              value={selectedGrade}
              onValueChange={handleGradeChange}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="选择年级" />
              </SelectTrigger>
              <SelectContent>
                 {gradeOptions.map(grade => (
                   <SelectItem key={grade.value} value={grade.value}>
                     {grade.label}
                   </SelectItem>
                 ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="preset" className="text-xs text-gray-600 mb-1 block">预设模板</Label>
            <Select
              value={selectedPreset}
              onValueChange={handlePresetChange}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="选择预设模板或自定义" />
              </SelectTrigger>
              <SelectContent>
                 <SelectItem value="custom">自定义设置</SelectItem>
                 {filteredPresetTemplates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 运算类型 - 多选框 */}
        <div>
          <Label className="text-xs text-gray-600 mb-2 block">运算类型（可多选）</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="addition"
                checked={settings.operationTypes.includes('addition')}
                onCheckedChange={(checked) => handleOperationTypeChange('addition', checked as boolean)}
              />
              <Label htmlFor="addition" className="text-sm cursor-pointer">加法 (+)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="subtraction"
                checked={settings.operationTypes.includes('subtraction')}
                onCheckedChange={(checked) => handleOperationTypeChange('subtraction', checked as boolean)}
              />
              <Label htmlFor="subtraction" className="text-sm cursor-pointer">减法 (-)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="multiplication"
                checked={settings.operationTypes.includes('multiplication')}
                onCheckedChange={(checked) => handleOperationTypeChange('multiplication', checked as boolean)}
              />
              <Label htmlFor="multiplication" className="text-sm cursor-pointer">乘法 (×)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="division"
                checked={settings.operationTypes.includes('division')}
                onCheckedChange={(checked) => handleOperationTypeChange('division', checked as boolean)}
              />
              <Label htmlFor="division" className="text-sm cursor-pointer">除法 (÷)</Label>
            </div>
          </div>
        </div>

        {/* 习题标题 */}
        <div>
          <Label htmlFor="title" className="text-xs text-gray-600 mb-1 block">习题标题</Label>
          <Input
            id="title"
            value={settings.title || ''}
            onChange={(e) => updateSettings('title', e.target.value)}
            placeholder="例如：三年级乘法练习"
            className="h-8 text-sm"
          />
        </div>

        {/* 数字范围和题目设置 - 四列布局 */}
        <div className="grid grid-cols-4 gap-2">
          <div>
            <Label htmlFor="min-range" className="text-xs text-gray-600 mb-1 block">最小值</Label>
            <Input
              id="min-range"
              type="number"
              value={settings.numberRange.min}
              onChange={(e) => updateNumberRange('min', parseInt(e.target.value) || 1)}
              min="1"
              max="100"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="max-range" className="text-xs text-gray-600 mb-1 block">最大值</Label>
            <Input
              id="max-range"
              type="number"
              value={settings.numberRange.max}
              onChange={(e) => updateNumberRange('max', parseInt(e.target.value) || 9)}
              min="1"
              max="100"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="problems-per-page" className="text-xs text-gray-600 mb-1 block">每页题数</Label>
            <Input
              id="problems-per-page"
              type="number"
              value={settings.problemsPerPage}
              onChange={(e) => updateSettings('problemsPerPage', parseInt(e.target.value) || 72)}
              min="20"
              max="120"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="page-count" className="text-xs text-gray-600 mb-1 block">页数</Label>
            <Input
              id="page-count"
              type="number"
              value={settings.pageCount}
              onChange={(e) => updateSettings('pageCount', parseInt(e.target.value) || 1)}
              min="1"
              max="10"
              className="h-8 text-sm"
            />
          </div>
        </div>

        {/* 预览信息和生成按钮 - 组合布局 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-2.5 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="text-blue-700 text-xs flex flex-wrap gap-x-2.5 gap-y-0.5">
               <span className="font-medium">
                 {settings.operationTypes.length === 0 ? '未选择' :
                  settings.operationTypes.length === 1 ? 
                    (settings.operationTypes[0] === 'multiplication' ? '乘法' :
                     settings.operationTypes[0] === 'addition' ? '加法' :
                     settings.operationTypes[0] === 'subtraction' ? '减法' : '除法') :
                  '混合运算'}
               </span>
               <span>{settings.numberRange.min}-{settings.numberRange.max}</span>
               <span>{settings.problemsPerPage * settings.pageCount}题</span>
               <span>{settings.pageCount}页</span>
             </div>
            <Button onClick={handleGenerate} size="sm" className="h-7 text-xs px-3 ml-3">
              <Eye className="w-3 h-3 mr-1" />
              生成预览
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}