# 前端课程：从后端老兵到独立前端工程师

> 📖 **在线书站（手机友好，含搜索/暗色/一键复制）**：<https://apodemakeles.github.io/front-learning/>——推送课程后自动更新，本 README 与书站内容同源。
>
> 一套为 20 年经验后端开发者（Java 背景）定制的现代前端实战课程。
> 不从 HTML/CSS 基础讲起，直接进入框架与工程化：Vue 3 为主线，兼修存量 Vue 2；从 npm、Node.js、构建工具到部署上线全覆盖。

## 课程目标

学完本课程，你将能够：

- **独立开发**：用 Vue 3 + Vite + TypeScript 完成中后台 / 移动端页面开发
- **读懂存量**：维护公司 Vue 2 存量项目（vue-cli / webpack / Vuex / element-ui / class 风格 TS）
- **玩转工程**：熟练使用 npm / pnpm，理解依赖与锁文件，配置构建与代码质量工具
- **独立上线**：构建产物 → nginx，把前端项目真正部署起来

## 当前状态：📝 写课阶段

课程大纲已定稿（38 课，预计 40–50 小时），正按 wayfinder 工单逐课撰写。

**进度：8 / 38 课已发布**

规划决策记录（详见 [wayfinder/map.md](wayfinder/map.md)）：

- [毕业项目选型](wayfinder/tickets/001-capstone-project.md) —— 虚拟门店轻量管理后台（mock 主线 + 可选自建后端）
- [TypeScript 策略](wayfinder/tickets/002-typescript-strategy.md) —— 第一课起全 TS，速成课只讲 Java 差异点
- [部署环境](wayfinder/tickets/003-deploy-env.md) —— 构建产物 + 本机 nginx，不用 Docker / CI / 托管
- [版本基准](wayfinder/tickets/004-version-baseline.md) —— 见 [notes/tech-baseline.md](notes/tech-baseline.md)
- [大纲定稿](wayfinder/tickets/005-course-outline.md) —— 38 课十一模块

## 课程目录

标注【项目】的课，作业围绕毕业项目（虚拟门店管理后台）迭代。

### 模块一 · 起步（2 课）

| # | 课题 | 状态 |
|---|---|---|
| 01 | [现代前端全景 + 跑通第一个 Vue 应用](lessons/01-modern-frontend-overview-and-first-vue-app.md) | ✅ |
| 02 | [Node.js 与 pnpm：前端的 JVM 与 Maven](lessons/02-nodejs-and-pnpm.md) | ✅ |

### 模块二 · 语言（2 课）

| # | 课题 | 状态 |
|---|---|---|
| 03 | [现代 JavaScript 速览（ESM 与异步）](lessons/03-modern-javascript-quick-tour.md) | ✅ |
| 04 | [给 Java 开发者的 TypeScript 速成](lessons/04-typescript-for-java-devs.md) | ✅ |

### 模块三 · Vue 3 基础（5 课）· 毕业项目起步

| # | 课题 | 状态 |
|---|---|---|
| 05 | [第一个 Vue 组件：模板与 SFC【项目】](lessons/05-first-vue-component-and-sfc.md) | ✅ |
| 06 | [模板语法细节：绑定、条件、列表与 key【项目】](lessons/06-template-syntax-details.md) | ✅ |
| 07 | [响应式心智模型：ref / reactive / computed【项目】](lessons/07-reactivity-ref-computed.md) | ✅ |
| 08 | [watch 家族：watch / watchEffect 与副作用【项目】](lessons/08-watch-and-side-effects.md) | ✅ |
| 09 | 组件基础：props / emit / 插槽 | ⬜ |

### 模块四 · Vue 3 进阶编码（6 课）

| # | 课题 | 状态 |
|---|---|---|
| 10 | v-model 与 defineModel、透传、provide/inject | ⬜ |
| 11 | 动态组件、异步组件、KeepAlive、Teleport | ⬜ |
| 12 | 插槽实战：作用域插槽与渲染器模式 | ⬜ |
| 13 | composable 设计模式：useRequest / usePagination | ⬜ |
| 14 | Vue + TS 类型进阶：泛型组件、emits/插槽类型、.d.ts | ⬜ |
| 15 | 生命周期与 nextTick：渲染时机 | ⬜ |

### 模块五 · 路由与状态（4 课）

| # | 课题 | 状态 |
|---|---|---|
| 16 | Vue Router 基础：路由表、动态参数、导航守卫【项目】 | ⬜ |
| 17 | 路由进阶：懒加载分包、元信息、查询参数 | ⬜ |
| 18 | Pinia 基础：应用级共享状态【项目】 | ⬜ |
| 19 | Pinia 进阶：组合式 store、store 协作、持久化 | ⬜ |

### 模块六 · 数据层与网络（4 课）

| # | 课题 | 状态 |
|---|---|---|
| 20 | axios 封装与拦截器【项目】 | ⬜ |
| 21 | 请求进阶：取消 / 重试 / 并发 / 下载、loading 与错误模式 | ⬜ |
| 22 | mock 与联调：API 层可替换设计 | ⬜ |
| 23 | WebSocket 与实时推送（知识课，独立 demo） | ⬜ |

### 模块七 · Element Plus 与中后台实战（7 课）

| # | 课题 | 状态 |
|---|---|---|
| 24 | Element Plus 入门与中后台布局【项目】 | ⬜ |
| 25 | 表格进阶：自定义列、作用域插槽、操作列模式 | ⬜ |
| 26 | 大数据列表：分页 vs 虚拟滚动 | ⬜ |
| 27 | 表单实战：校验、新建/编辑复用【项目：CRUD】 | ⬜ |
| 28 | 表单进阶：动态表单、异步校验、表单拆分 | ⬜ |
| 29 | 弹窗与反馈体系 + EP 主题定制 | ⬜ |
| 30 | 看板与图表（echarts）【项目】 | ⬜ |

### 模块八 · 工程化（3 课）

| # | 课题 | 状态 |
|---|---|---|
| 31 | Vite：开发与构建、.env 多环境【项目】 | ⬜ |
| 32 | 样式工程：scoped、:deep、less 与主题 | ⬜ |
| 33 | 代码质量：ESLint flat config、Prettier、vue-tsc【项目】 | ⬜ |

### 模块九 · 调试与攻坚（2 课）

| # | 课题 | 状态 |
|---|---|---|
| 34 | DevTools 与调试：断点、网络 / 性能面板 | ⬜ |
| 35 | Vue 报错与警告解读：常见坑词典 | ⬜ |

### 模块十 · 存量与部署（2 课）

| # | 课题 | 状态 |
|---|---|---|
| 36 | Vue 2 存量速览：差异清单与四件套对照 | ⬜ |
| 37 | 构建产物解剖 + 本机 nginx 上线【毕业验收】 | ⬜ |

### 模块十一 · 结业（1 课）

| # | 课题 | 状态 |
|---|---|---|
| 38 | 结业：全流程复盘 + 可选后端联调 + 学习地图 | ⬜ |

## 仓库导览

- `lessons/` 课程文章（按编号）——写作中
- `demos/` 课程配套示例（每课一目录）
- `project/shop-admin/` 毕业项目参考实现（第 5 课起随课迭代，[迭代记录](project/shop-admin/README.md)）
- `notes/` 参考笔记：[版本基准](notes/tech-baseline.md)、[公司存量栈调研](notes/company-stack.md)
- `templates/` 课程文章骨架模板
- `wayfinder/` 课程规划地图与决策工单
- [AGENTS.md](AGENTS.md) 课程写作的工作指南

## 使用方式

每课按顺序学：读正文 → 跟着实操 → 完成作业并对照验收标准 → 再看原理深入部分加深理解。
