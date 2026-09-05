# 前端课程：从后端老兵到独立前端工程师

> 一套为 20 年经验后端开发者（Java 背景）定制的现代前端实战课程。
> 不从 HTML/CSS 基础讲起，直接进入框架与工程化：Vue 3 为主线，兼修存量 Vue 2；从 npm、Node.js、构建工具到部署上线全覆盖。

## 课程目标

学完本课程，你将能够：

- **独立开发**：用 Vue 3 + Vite + TypeScript 完成中后台 / 移动端页面开发
- **读懂存量**：维护公司 Vue 2 存量项目（vue-cli / webpack / Vuex / element-ui / class 风格 TS）
- **玩转工程**：熟练使用 npm / pnpm，理解依赖与锁文件，配置构建与代码质量工具
- **独立上线**：构建产物 → nginx / Docker → CI/CD，把前端项目真正部署到线上

## 当前状态：🧭 规划中

课程地图见 [wayfinder/map.md](wayfinder/map.md)。关键决策正通过 wayfinder 工单逐个敲定，尚未动笔写课。

已定稿：**[毕业项目选型](wayfinder/tickets/001-capstone-project.md)** —— 虚拟门店轻量管理后台（Vue 3 + Vite + Pinia + Element Plus，mock 主线 + 可选自建后端）。

下一个待讨论决策：**[TypeScript 的引入时机与深度](wayfinder/tickets/002-typescript-strategy.md)**。

## 学习路线总览（草案——以「课程大纲定稿」工单为准）

| 阶段 | 模块 | 内容要点 |
|---|---|---|
| 一 | 现代前端全景 | 前端如何运行、工程化生态位（用后端类比建立全景地图） |
| 二 | Node.js 与包管理 | Node / npm / pnpm、package.json、semver、锁文件、镜像与私有源 |
| 三 | 现代 JavaScript | ESM 模块、常用语法、异步模型；与 Java 对照 |
| 四 | Vue 3 入门 → 熟练 | 模板与响应式、组件、Composition API、事件与插槽 |
| 五 | 原理课 | 响应式系统、虚拟 DOM 与渲染、组件通信机制 |
| 六 | 路由与状态 | Vue Router、Pinia（含原理；版本见[版本基准](notes/tech-baseline.md)） |
| 七 | 工程化 | Vite 原理与配置、webpack 对照、ESLint / Prettier、环境变量 |
| 八 | UI 与网络请求 | Element Plus、axios 封装、mock、错误处理 |
| 九 | 存量 Vue 2 专题 | 与 Vue 3 差异清单、class 风格 TS、Vuex、迁移策略 |
| 十 | 部署与上线 | 产物分析、nginx、Docker、CI/CD、缓存策略 |
| 贯穿 | 毕业项目 | 从第一行代码到线上可访问 |

## 仓库导览

- `lessons/` 课程文章（按编号）——待大纲定稿后开始
- `notes/` 参考笔记：[公司存量栈调研](notes/company-stack.md)、版本基准等
- `wayfinder/` 课程规划地图与决策工单
- [AGENTS.md](AGENTS.md) 课程写作的工作指南

## 使用方式

每课按顺序学：读正文 → 跟着实操 → 完成作业并对照验收标准 → 再看原理深入部分加深理解。
