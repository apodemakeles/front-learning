---
id: 017
title: 写课10：v-model 与 defineModel、透传、provide/inject
labels: [wayfinder:task]
status: closed
assignee: zcode
blocked-by: [015-lesson-09.md]
---

## Question

撰写 `lessons/10-*.md`：v-model 的本质（props 进 + emit 出的封装）、组件上用 v-model（defineModel）、attribute 透传（class/attrs 落到根元素）、provide/inject 跨层级注入。毕业项目迭代候选：营业状态开关组件（v-model 组件版）、主题色 provide/inject（BasePanel 消费）。呼应第 9 课埋的钩子（"v-model 就是 props+emit 回路的封装"）。

完成标准：正文发布、project/ 迭代入库、README 勾选 10、提交推送。

## Resolution

**产出**：

- 正文：`lessons/10-v-model-attrs-provide-inject.md`（概念 10.1–10.4：v-model 解剖（表单版+组件版回路对照）、defineModel 与 v-model/emit 语义分界（值同步 vs 意图通知）、透传三规则（单根自动/多根显式/inheritAttrs）、provide-inject 与 props 取舍（类比 ApplicationContext，代价=依赖来源不显式）；实操 11.1–11.4；原理 3 条：defineModel 编译期展开（附 3.3 时代手写回路对照，服务存量阅读）、$attrs 收纳箱与 class 合并、inject 原型链式查找与"共享引用非拷贝"）
- 项目迭代：components/ShopSwitch.vue（defineModel<boolean>）；types.ts 加 ShopTheme + THEME_KEY（InjectionKey）；BasePanel inject 主题（含默认值）；App：shopOpen ref + 持久化 + 标题 watchEffect 双依赖 + dimmed 透传 + 主题圆点换色 + 按钮吃主题
- README：第 10 课 ✅，进度 10/38

**实测事实**（Node 24 / pnpm 11 / Vite 8.2.2，macOS）：

- `pnpm build` 通过：`dist/assets/index-Zorj7PkB.js 68.10 kB │ gzip: 27.25 kB`、`index-BEBtZ0Oe.css 2.84 kB`、`✓ built in 153ms`
- Playwright：初始 switch "营业中"（class "switch on"）、卡片 class "cards"、面板标题色 rgb(22, 82, 240)；点开关后 title 加" · 已打烊"、卡片 class "cards dimmed"（透传落位）、刷新按钮 disabled、localStorage "0"；reload 后打烊态保持
- 点紫色圆点：面板标题/主按钮背景/ghost 按钮描边同时变 rgb(114, 46, 209)（inject 共享同一 reactive 对象）
- 回归：菜单切换（active=1）、模拟刷新（日志生成）正常；截图视觉核对无布局问题

