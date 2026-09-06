---
id: 013
title: 写课07：响应式心智模型——ref / reactive / computed
labels: [wayfinder:task]
status: closed
assignee: zcode
blocked-by: [012-lesson-06.md]
---

## Question

撰写 `lessons/07-*.md`：响应式心智模型（"数据变了页面为什么自动变"——依赖追踪的黑盒级图解，不手写不读源）、ref vs reactive 选择、computed 缓存、为什么要 .value。毕业项目迭代：统计数字变为"响应式数据驱动"（如模拟点击刷新今日数据）。

完成标准：正文发布、project/ 迭代入库、README 勾选 07、提交推送。

## Resolution

**产出**：

- 正文：`lessons/07-reactivity-ref-computed.md`（概念 7.1–7.4：依赖追踪模型、ref 与 .value 盒子、reactive 三限制与选型规则、computed 派生+缓存；实操 8.1–8.5 全在毕业项目；原理 3 条：读即订阅写即通知、.value 是 JS 边界、computed 自带失效的缓存）
- 项目迭代：`project/shop-admin/src/App.vue`——activeMenuId/orderCount/pendingCount → ref（菜单点击切高亮、refreshToday 随机数）、statCards → computed<StatCard[]>（营业额=订单×28.8、alert=待处理>0、v-if 标签随派生）；不变数据保持常量（按需响应式）
- 新增 `demos/07-reactivity/reactivity-lab.mjs`：Node 实验室（watchEffect sync 演示动态依赖收集 + computed getter 日志演示缓存命中/失效），学员复制进 shop-admin 借 node_modules 运行
- README：第 7 课 ✅，进度 7/38

**实测事实**（Node 24 / pnpm 11 / Vite 8.2.2，macOS）：

- `pnpm build` 通过：`dist/assets/index-Cj4sun05.js 63.79 kB │ gzip: 25.53 kB`、`index-GcMJnZvV.css 2.04 kB`、`✓ built in 74ms`
- Playwright 实测交互：初始菜单 `["active","",""]`，点击"商品管理"后 `["","active",""]`；连续点击刷新得 `142 单 ¥4,090 3 件`、`172 单 ¥4,954 8 件`、`168 单 ¥4,838 2 件`（均=订单×28.8 四舍五入）；刷到 `112 单 ¥3,226 0 件` 时 badge 元素从 DOM 移除
- reactivity-lab.mjs 实测输出（node，shop-admin 目录内）：实验 1 中 `count.value = 3` 后无任何渲染输出（visible=false 分支未读 count，依赖已注销——动态依赖收集）；实验 2 中第二次读 revenue 无 getter 日志（缓存命中），orders 改后重算 2929
- 排坑记录：Playwright `--raw eval` 输出的 JSON 带转义反斜杠（`\"badge\":null`），检测 null 的 grep 模式需写 `badge\\*":null`；首次实测 55 次点击未命中 pending=0 即此因，修正后第 7 次命中

