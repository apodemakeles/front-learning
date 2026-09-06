---
id: 014
title: 写课08：watch 家族——watch / watchEffect 与副作用
labels: [wayfinder:task]
status: closed
assignee: zcode
blocked-by: [013-lesson-07.md]
---

## Question

撰写 `lessons/08-*.md`：watch（deep / immediate / 清理）、watchEffect、副作用概念（"响应式数据变化引发的连带动作"）、场景选择（computed vs watch）。毕业项目迭代：如监听筛选条件变化自动"重新请求"（mock 延时）。

完成标准：正文发布、project/ 迭代入库、README 勾选 08、提交推送。

## Resolution

**产出**：

- 正文：`lessons/08-watch-and-side-effects.md`（概念 8.1–8.4：副作用判据"产物是值还是事"、watch 三形态与懒/immediate、watchEffect 自动收集与选择规则、引用陷阱+deep 代价+flush/onCleanup 到课预告；实操 9.1–9.4；原理 3 条：同底座不同登记方式、级联常态与环事故、watch 盯引用不盯内容）
- 项目迭代：`project/shop-admin/src/App.vue`——activeMenuId 持久化（localStorage 读写 + ?? 兜底）、changeLogs 审计日志（多源 watch + 新旧值 + shift 截断 3 条 + logSeq 稳定 key）、document.title 跟随（watchEffect）；模板加 .logs 区块（v-if 空则不渲染）
- 毕业项目迭代方向调整：ticket 建议"监听筛选条件自动重新请求"，但商品列表与筛选第 24–25 课才出现；改用菜单持久化/审计日志/标题跟随三个当下真实场景承载同组知识点，请求联动留到第 20 课
- 埋第 9 课钩子：模板注释与迭代表注明"App.vue 越来越大，拆组件时 logs 区块是第一个候选"
- README：第 8 课 ✅，进度 8/38

**实测事实**（Node 24 / pnpm 11 / Vite 8.2.2，macOS）：

- `pnpm build` 通过：`dist/assets/index-DB5BDrSM.js 64.41 kB │ gzip: 25.76 kB`、`index-ChJmiYf1.css 2.35 kB`、`✓ built in 76ms`
- Playwright 实测：初始 title=`云上拿铁 · 今日 128 单`（watchEffect 立即执行）且 logs=0（watch 默认懒）；点击"商品管理"后 localStorage 为 `"products"`，reload 后高亮仍在第二项（index 1）
- 连点刷新 4 次：日志恰 3 条且新旧值成链 `190 → 124 → 112 → 122`（首条 128→190 被 shift 挤掉）；标题 `云上拿铁 · 今日 122 单` 与卡片 122 单一致

