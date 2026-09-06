import { defineConfig } from 'vitepress'
import { readFileSync, readdirSync } from 'node:fs'

// 模块划分（与 README 课程目录一致）；侧边栏按此分组
const MODULES: Array<{ label: string; from: number; to: number }> = [
  { label: '模块一 · 起步', from: 1, to: 2 },
  { label: '模块二 · 语言', from: 3, to: 4 },
  { label: '模块三 · Vue 3 基础', from: 5, to: 9 },
  { label: '模块四 · Vue 3 进阶编码', from: 10, to: 15 },
  { label: '模块五 · 路由与状态', from: 16, to: 19 },
  { label: '模块六 · 数据层与网络', from: 20, to: 23 },
  { label: '模块七 · Element Plus 与中后台实战', from: 24, to: 30 },
  { label: '模块八 · 工程化', from: 31, to: 33 },
  { label: '模块九 · 调试与攻坚', from: 34, to: 35 },
  { label: '模块十 · 存量与部署', from: 36, to: 37 },
  { label: '模块十一 · 结业', from: 38, to: 38 },
]

// 侧边栏自动生成：扫描 lessons/ 里已发布的课——发布新课后书站自动收录，写课流程零变化
function buildLessonSidebar() {
  const dir = new URL('../lessons/', import.meta.url)
  const files = readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .sort()
  const lessons = files.map(f => {
    const no = Number(f.slice(0, 2))
    const firstLine =
      readFileSync(new URL(`../lessons/${f}`, import.meta.url), 'utf8').split('\n')[0] ?? ''
    const title = firstLine.replace(/^#\s*第\s*\d+\s*课[：:]\s*/, '').trim()
    return {
      no,
      text: `${String(no).padStart(2, '0')} · ${title}`,
      link: `/lessons/${f.replace(/\.md$/, '')}`,
    }
  })
  return MODULES.map(m => ({
    text: m.label,
    collapsed: false,
    items: lessons
      .filter(l => l.no >= m.from && l.no <= m.to)
      .map(({ text, link }) => ({ text, link })),
  })).filter(g => g.items.length > 0)
}

export default defineConfig({
  lang: 'zh-CN',
  title: '前端课程',
  description:
    '从后端老兵到独立前端工程师——为 20 年经验 Java 后端定制的 Vue 3 实战课程',
  base: '/front-learning/',
  // 书站只收录课程正文与参考笔记；wayfinder/templates/demos/project 是仓库工作区，不进书
  srcExclude: [
    'README.md',
    'AGENTS.md',
    'wayfinder/**',
    'templates/**',
    'demos/**',
    'project/**',
    'notes/writing-style.md',
    '**/node_modules/**',
  ],
  // 课程 md 里的相对链接指向仓库工作区文件（GitHub 上可点），书站不渲染它们
  ignoreDeadLinks: true,
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: 'GitHub 仓库', link: 'https://github.com/apodemakeles/front-learning' },
    ],
    sidebar: {
      '/': [
        ...buildLessonSidebar(),
        {
          text: '参考笔记',
          items: [
            { text: '版本基准（2026-09）', link: '/notes/tech-baseline' },
            { text: '公司存量栈调研', link: '/notes/company-stack' },
          ],
        },
      ],
    },
    search: { provider: 'local' },
    outline: { level: [2, 3], label: '本页内容' },
    docFooter: { prev: '上一课', next: '下一课' },
    lastUpdated: { text: '最后更新' },
  },
})
