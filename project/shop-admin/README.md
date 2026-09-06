# shop-admin —— 毕业项目：云上拿铁（虚拟门店）管理后台

课程的贯穿项目参考实现，随课程逐课迭代。**学员应自己从第 5 课开始搭建同名项目**，本目录用于对照与排错（diff 我的实现 vs 你的实现）。

- 技术栈与功能范围见 [课程 README](../../../README.md) 与 [wayfinder 工单 001](../../../wayfinder/tickets/001-capstone-project.md)
- 版本基准：[notes/tech-baseline.md](../../../notes/tech-baseline.md)（截至 2026-09：Vue 3.5 / Vite 8 / TS 6）
- 运行：`pnpm install && pnpm dev`

## 迭代记录

| 课 | 迭代内容 |
|---|---|
| 第 5 课 | create-vue 初始化（仅 TS）；首页静态版：顶栏 + 侧菜单 + 欢迎卡片 + 三张统计卡片（App.vue 单文件、无 v-for / 响应式） |
| 第 6 课 | 菜单与统计卡片数据化：v-for + :key（稳定 id）、:class 对象语法（active 高亮）、@click.prevent 帮助链接、v-if"待关注"标签；数据仍为普通常量 |
| 第 7 课 | 响应式：activeMenuId/orderCount/pendingCount 改 ref（点击菜单切高亮、模拟刷新随机数）、statCards 改 computed（营业额 = 订单数 × 客单价、待关注标签随派生）；不变的数据仍是普通常量 |
| 第 8 课 | watch / watchEffect：菜单高亮 localStorage 持久化（watch 单源）、数据变更记录审计日志（多源 watch + 新旧值，保留 3 条）、标签页标题跟随订单数（watchEffect）；App.vue 开始变大——第 9 课拆组件 |
