# 小学数学练习题 App

一个专为小学生设计的数学练习题生成器，帮助孩子们提高数学计算能力。

## 技术栈

- **前端框架**: Next.js 14 (React 18)
- **UI组件库**: shadcn/ui + Tailwind CSS
- **语言**: TypeScript
- **状态管理**: React Hooks (useState, useEffect)
- **数据存储**: localStorage (本地存储)

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/            # React组件
│   ├── ui/               # shadcn/ui基础组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── tabs.tsx
│   ├── PracticeMode.tsx  # 练习模式组件
│   ├── SettingsPanel.tsx # 设置面板
│   └── StatsPanel.tsx    # 统计面板
├── lib/                  # 工具函数
│   ├── utils.ts          # 通用工具
│   └── mathGenerator.ts  # 数学题生成器
└── types/                # TypeScript类型定义
    └── math.ts           # 数学相关类型
```

## 功能特性

### 已实现功能
- ✅ 基础项目架构搭建
- ✅ 数学题生成器（加减乘除）
- ✅ 练习模式基础功能
- ✅ 难度级别设置（简单/中等/困难）
- ✅ 实时答题和结果反馈
- ✅ 基础UI界面

### 待开发功能
- 🔄 设置面板（运算类型选择、难度调整、题目数量等）
- 🔄 学习统计（正确率、用时分析、进步追踪）
- 🔄 学习模式（概念教学、步骤演示）
- 🔄 数据持久化（练习记录保存）
- 🔄 成就系统（徽章、等级）
- 🔄 错题本功能
- 🔄 家长监控面板

## 快速开始

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 开发指南

### 添加新的运算类型
在 `src/lib/mathGenerator.ts` 中添加新的生成函数，并更新相关类型定义。

### 自定义UI组件
所有UI组件基于shadcn/ui构建，可以在 `src/components/ui/` 目录下找到并自定义。

### 数据类型
所有数学相关的类型定义在 `src/types/math.ts` 中，包括题目、设置、统计等。

## 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

## 许可证

MIT License