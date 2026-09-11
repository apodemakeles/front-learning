---
id: 019
title: 写课12：插槽实战——作用域插槽与渲染器模式
labels: [wayfinder:task]
status: closed
assignee: zcode
blocked-by: [018-lesson-11.md]
---

## Question

撰写 `lessons/12-*.md`：作用域插槽（子组件向插槽内容回传数据）、具名插槽进阶、以"渲染器模式"（数据归组件、渲染归使用方）设计通用列表/表格类组件。demo 为主（通用 ListComponent），毕业项目迭代候选：ChangeLogs 支持自定义行渲染。

完成标准：正文发布、demo 与/或 project 迭代入库、README 勾选 12、提交推送。

## Resolution

**产出**：

- 正文：`lessons/12-scoped-slots-and-renderer-pattern.md`（概念 12.1–12.4：作用域插槽=回调参数、渲染器模式分工表（模板方法模式声明式版）、具名插槽进阶与 fallback、泛型组件提前亮相；实操 13.1–13.5；原理 3 条：编译产物证明插槽是字面回调、fallback=插槽缺席检查、渲染器分界线随课程移动（20/25/26 课续集））
- 项目迭代（以 project 为主，替代独立 demo）：components/DataTable.vue（泛型 generic="T"、props rows/rowKey 函数/emptyText、#head 具名插槽 + #row 作用域插槽回传 row/index、template v-if/v-else 空态、hover 样式）；StatListView 手写表格（30 行）换 DataTable 列声明（12 行），td.warn 留在本组件 scoped（插槽内容编译在父作用域）；ChangeLogs 开放 #row 插槽带 fallback `{{ log.text }}`，App 不改——零行为变化重构
- README：第 12 课 ✅，进度 12/38

**实测事实**（Node 24 / pnpm 11 / Vite 8.2.2，macOS）：

- `pnpm build` 通过：`StatListView-RRxU08ka.js 1.35 kB`（比上节课 +0.5 kB，DataTable 进异步包）、主包 `index-n19-jpwD.js 78.98 kB`
- **vue-tsc 泛型插槽负例**：#row 里写 `row.pricex` → `error TS2339: Property 'pricex' does not exist on type 'StatCard'`（类型从使用方流进插槽内容）
- **编译产物证据**：`<template #row="{ row }">` 编译为 `row: _withCtx(({ row }) => [...])`——字面回调函数
- Playwright：DataTable 渲染 3 行（"今日订单 128 单 —"）、td.warn"需关注"红色；空态实测——刷出 0 件后勾"仅看需关注"→ `.empty-row td` = "暂无数据"、数据行 0；日志 fallback 显示纯文本 `[09:53:15] 订单 80 → 91，待处理 9 → 0`；KeepAlive 回归——切卡片再切回列表，过滤结果保留
- 排坑记录：raw eval 检测字符串值时的引号转义（同第 7 课）；列表视图下 `.card` 不存在，检测待处理数应读 `.data-table td.warn`

