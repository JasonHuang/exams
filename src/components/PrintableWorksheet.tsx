'use client'

import { useState, useRef } from 'react'
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
  const printableRef = useRef<HTMLDivElement>(null)

  const handleGenerate = () => {
    const generatedPages = generatePrintablePages(settings)
    setPages(generatedPages)
    setShowPreview(true)
  }

  const handlePrint = () => {
    window.print()
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

  if (showPreview && pages.length > 0) {
    return (
      <div className="space-y-4">
        {/* 控制按钮 */}
        <div className="flex gap-2 print:hidden">
          <Button onClick={() => setShowPreview(false)} variant="outline">
            ← 返回设置
          </Button>
          <Button onClick={handlePrint} className="flex items-center gap-2" variant="outline">
            <Printer className="w-4 h-4" />
            浏览器打印
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
              onChange={(e) => updateSettings('problemsPerPage', parseInt(e.target.value) || 72)}
              min="20"
              max="120"
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