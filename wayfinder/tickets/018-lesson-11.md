---
id: 018
title: 写课11：动态组件、异步组件、KeepAlive、Teleport
labels: [wayfinder:task]
status: closed
assignee: zcode
blocked-by: [017-lesson-10.md]
---

## Question

撰写 `lessons/11-*.md`：`<component :is>` 与动态组件、defineAsyncComponent 异步分包、KeepAlive 缓存组件状态、Teleport 传送到任意位置。毕业项目迭代候选：看板区多视图 tab 切换（KeepAlive 保留各视图状态）。注：真正的页面切换是路由（第 16 课），本课讲组件级切换。

完成标准：正文发布、project/ 迭代入库、README 勾选 11、提交推送。

## Resolution

**产出**：

- 正文：`lessons/11-dynamic-async-keepalive-teleport.md`（概念 11.1–11.4：动态组件与 v-if 链对比、KeepAlive 对象池类比与 include/max、异步组件 JVM 类加载类比与"何时值得异步"两问、Teleport"只挪 DOM 不改父子"；实操 12.1–12.5；原理 3 条：销毁/失活/缓存三态生命周期、import() 是切包唯一依据（17 课路由懒加载续集）、Teleport 渲染目标重定向）
- 项目迭代：components/StatListView.vue（表格视图 + onlyAlert 私有状态 + computed 过滤兑现第 6 课预告 + 单根包裹保透传）；App：statView 联合类型 + views map + KeepAlive 包动态组件（dimmed 透传随当前视图落位）、StatListView defineAsyncComponent 异步引入、toast 状态/定时器 + Teleport to body + refreshToday 触发
- README：第 11 课 ✅，进度 11/38

**实测事实**（Node 24 / pnpm 11 / Vite 8.2.2，macOS）：

- `pnpm build` 通过且**独立分包可见**：`dist/assets/StatListView-2DoHU3Y2.js 0.87 kB │ gzip: 0.57 kB`、`StatListView-BAWX10CI.css 0.63 kB`、主包 `index-xD9uUBVV.js 78.91 kB`
- Playwright：初始卡片视图（3 卡无表格）；点"列表"→ 表格 3 行；dev Network 确认此刻才发 `GET /src/components/StatListView.vue => 200`（含 scoped 样式请求共 2 条）
- KeepAlive 实证：勾"仅看需关注"→ 表格剩 1 行 → 切"卡片"再切回 → `checkedBack: true, rowsBack: 1`（状态保留）
- 透传实证：打烊时列表视图根元素 class 为 `stat-list dimmed`（动态组件根随 :is 变化）
- Teleport 实证：点刷新后 `.toast` 文本"数据已更新 09:37:03"、`parentElement === document.body`、`#app` 内搜不到、2.2 秒后消失
- 截图视觉核对：列表视图表格/tabs/勾选框排版正常

