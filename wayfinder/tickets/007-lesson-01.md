---
id: 007
title: 写课01：现代前端全景 + 跑通第一个 Vue 应用
labels: [wayfinder:task]
status: closed
assignee: agent（2026-09-06 完成）
blocked-by: [006-repo-structure.md]
---

## Question

撰写 `lessons/01-*.md`：现代前端全景（后端类比地图：Node=JVM、npm/pnpm=Maven、package.json=pom.xml、Vite=构建工具链、Vue=框架、组件库=轮子库）+ 用 create-vue + pnpm 跑通第一个页面（不解释脚手架细节，第 2 课再深挖）。

要求：按 AGENTS.md 标准课结构与写作规范撰写；版本标注"截至 2026-09"；作业含明确验收标准（跑通项目、改一行文案、dev server 与页面截图自查）。

完成标准：正文发布、README 目录勾选 01、提交推送。

## Resolution

2026-09-06 完成。产出：[lessons/01-modern-frontend-overview-and-first-vue-app.md](../../lessons/01-modern-frontend-overview-and-first-vue-app.md)。

- **写作前实测**（macOS / Node v24.14.1 / pnpm 11.21.0）：`pnpm create vue@latest hello-vue --ts` → `pnpm install`（9.8s）→ `pnpm dev`（VITE v8.2.2 ready in 859ms，HTTP 200）→ `pnpm build`（537ms，dist 三件套：index.html 0.42kB / index-*.css 3.56kB / index-*.js 71.33kB）。课文中的命令与预期输出关键行全部来自实测。
- 脚手架实测事实：`--ts` 参数会跳过全部交互（等价只选 TS）；模板依赖 vue ^3.5.40 / vite ^8.1.5 / typescript ~6.0.0 / vue-tsc ^3.3.7，engines 为 node ^22.18.0 || >=24.12.0——与 notes/tech-baseline.md 基准一致。
- 正文按模板六段结构：全景类比表 + 两个心智模型（浏览器才是生产运行时 / 产物是静态文件）+ 实操（含两处改动的精确定位：App.vue 的 msg 与 HelloWorld.vue 的 h3）+ 三个原理心智模型 + 作业验收清单（5 项）+ 延伸阅读。
- README 目录已勾选 01 并更新进度（1/38）。
