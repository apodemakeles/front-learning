---
id: 020
title: 写课13：composable 设计模式——useRequest / usePagination
labels: [wayfinder:task]
status: closed
assignee: zcode
blocked-by: [019-lesson-12.md]
---

## Question

撰写 `lessons/13-*.md`：composable（组合式函数）的设计范式：以 use 开头、返回 ref/computed、内部消费副作用并自动清理；提炼 useRequest（含 loading/error 状态机）与 usePagination；与"无状态工具函数"的边界。毕业项目迭代候选：refreshToday 抽成 composable（mock 版 useRequest，第 20 课接 axios 后升级）。

完成标准：正文发布、project/ 迭代入库、README 勾选 13、提交推送。

## Resolution

**产出**：

- 正文：`lessons/13-composables-use-request.md`（概念 13.1–13.4：utils vs composable 边界（静态工具类 vs 有状态 Service）、设计范式四条、useRequest 状态机与 seq 防竞态（乐观锁 version 类比）、usePagination/VueUse 族谱；实操 14.1–14.5；原理 3 条：effect scope 决定副作用归属（"setup 顶层同步调用"的全部原因）、refs 解构安全的充分条件、loading 保留旧数据的产品决策）
- 项目迭代：composables/useMockStats.ts（orderCount/pendingCount/loading refs + statCards computed + async refresh：600ms sleep + seq 防竞态 + rand/AVG_PRICE 随迁）；App 解构消费（六处散装定义收为三行，三个 watch 与 refreshToday 的 toast 编排留在 App——分层示范）；DataTable 补 loading 态（兑现 12 课作业 1）；StatCards/StatListView props 接口对齐（多视图动态组件惯例）
- 新增 demos/13-composables/composable-lab.mjs（refs 解构联动 vs reactive 解构死快照，组件外可运行=单元测试姿势）
- 作业主线：自写 useLocalStorage 收编三处手写持久化（第 8/10 课模式重复三次的正式抽象）
- README：第 13 课 ✅，进度 13/38

**实测事实**（Node 24 / pnpm 11 / Vite 8.2.2，macOS）：

- `pnpm build` 通过：`index-5uNM7ZEC.js 79.37 kB │ gzip: 31.86 kB`、`StatListView-BBiE9hPm.js 1.53 kB`、`✓ built in 125ms`；App.vue 303 行（原 ~330）
- lab 实测输出：`isRef(count) = true` 解构后 inc() 联动（11/22）；reactive 解构 `lost = 0, state.count = 99` 死快照
- loading 三处联动（页内 async eval 采样，规避 CLI 进程开销超过 600ms 窗口的问题）：during=`{按钮"刷新中…", 禁用 true, 表格"加载中…"}`；after=`{按钮恢复, 数据行 3, toast "数据已更新 10:05:14"}`
- 回归：菜单切换 active=1、打烊透传 `stat-list dimmed`、标题后缀、KeepAlive 照常；截图意外抓到一次刷新进行中的真实画面（加载中…+刷新中…），状态最终恢复健康（后续 eval 确认）
- 排坑记录：playwright-cli 逐命令进程开销 > 600ms 的 loading 窗口，时序采样需用单次页内 async eval 完成

