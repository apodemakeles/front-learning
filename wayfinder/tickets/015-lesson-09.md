---
id: 015
title: 写课09：组件基础——props / emit / 插槽
labels: [wayfinder:task]
status: closed
assignee: zcode
blocked-by: [014-lesson-08.md]
---

## Question

撰写 `lessons/09-*.md`：组件化心智模型（自包含视图单元）、defineProps（TS 泛型写法）、defineEmits、slot 默认/具名/作用域一瞥（作用域插槽实战留第 12 课）。毕业项目迭代：首页拆组件（AppHeader / SideMenu / StatCard），对应大纲第 7 课作业。

完成标准：正文发布、project/ 迭代入库、README 勾选 09、提交推送。

## Resolution

**产出**：

- 正文：`lessons/09-component-basics.md`（概念 9.1–9.4：拆分时机与原则/状态提升、props 单向数据流、emit 与"修改权唯一"、插槽编译在父作用域；实操 10.1–10.6 按依赖序拆分；原理 3 条：组件即函数、单向数据流=修改权唯一、插槽分发编译好的 vnode）
- 项目迭代：src/types.ts（MenuItem/StatCard/LogEntry 共享类型，import type）+ components/ 五件套——AppTopbar（props shopName/today + emit help）、SideMenu（props items/activeId + emit select + v-for 迁移）、StatCards（纯展示 props cards）、ChangeLogs（纯展示，内部组合 BasePanel——组件套组件）、BasePanel（title props + 默认插槽容器）；App.vue 318 → 166 行，template 只剩组件标签与插槽内容，.content 用 flex gap 管间距
- README：第 9 课 ✅，进度 9/38，模块三完结

**实测事实**（Node 24 / pnpm 11 / Vite 8.2.2，macOS）：

- `pnpm build` 通过：`dist/assets/index-CpRELpbI.js 66.08 kB │ gzip: 26.45 kB`、`index-BZCiNUqZ.css 2.19 kB`、`✓ built in 110ms`
- Playwright 全量回归（第 6–8 课验收项，拆分前后行为零变化）：初始 title 正常/菜单第 0 项高亮/无日志；点"系统设置"→ active=2 且 localStorage 存 `"settings"`，reload 后仍 active=2；连点 2 次刷新 → 2 条日志链条 `128 → 106 → 100`，title 同步 100 单；点"帮助"URL 不变，console 日志来源 `App.vue`（emit 链回到父组件）
- 截图视觉核对：布局无回归（顶栏/侧菜单/欢迎面板/三卡横排/日志面板均正常）
- 行数对账：App 318 → 166 行；5 组件 215 行 + types.ts 18 行——总行数增加、隔离度提升（写入课文作为"拆分买的不是行数"的论据）

