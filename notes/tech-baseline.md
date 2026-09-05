# 前端课程版本基准（基准时点：2026-09-05）

> 来源：wayfinder 工单 [004 版本基准与工具链选型](../wayfinder/tickets/004-version-baseline.md) 的调研结论。
> 所有课程文章统一按本基准写作，正文标注"截至 2026-09"。
> 版本号均于 2026-09-05 通过 npm registry（`registry.npmjs.org`）实时查询核验，并交叉验证官方公告 / GitHub Releases。

## 一、课程锁定清单（写作时直接采用）

| 类别 | 锁定版本 | 关键理由 |
|---|---|---|
| Node.js | **24.x（Active LTS，支持至 2028-04）** | 全链路 engines 的最优交集（create-vue 要求 ^22.18 或 ≥24.12、pnpm 11 要求 ≥22.13）；Node 20 已 EOL，教材中明确淘汰 |
| 包管理器 | **pnpm 11 主线，npm 12 作对照** | Vue/Vite 官方文档已全面 pnpm 化；pnpm 的 store+symlink 结构对后端工程师更有"系统包管理器"心智抓手；npm 人人都有，兜底演示 |
| Vue | **3.5.x（锁 ~3.5.x）** | npm latest 与 create-vue 官方模板双确认；3.6/Vapor 仍 RC，只作"未来展望"带过；**Vue 2 止于 2.7.16，EOL 2023-12-31**，仅入存量专题 |
| 脚手架 | **create-vue** | 官方唯一推荐；模板生成 vue ^3.5.42 + vite ^8.2.2 + TS ~6.0.0 |
| 构建 | **Vite 8.2.x** | create-vue 默认；Vite 8 已用 Rolldown（Rust）作为唯一打包器 |
| 路由 | **Vue Router 5.3.x** | latest 稳定线；文件路由已并入核心，是加分教学点 |
| 状态管理 | **Pinia 4.0.x** | 与 Pinia 3 的 store API 完全一致；Pinia 3 起不再支持 Vue 2 |
| TypeScript | **TS 6.0.x（不用 7）** | **vue-tsc 尚不支持 TS 7**（tsgo API 未稳定），官方模板也锁定 ~6.0.0；TS 7 的 10x 性能作为话题讲解 |
| Lint / 格式化 | **ESLint 10（flat config）+ eslint-plugin-vue 10 + Prettier 3.9** | ESLint 10 已彻底移除 eslintrc，从第一天就教 flat config |
| 测试 | **Vitest 4.x + Vue Test Utils 2.5** | Vitest 5.0 于 2026-09-03 刚 GA，锁 4.x 风险最低；讲义标注"最新大版本为 5.0" |
| 组件库 | **Element Plus 2.14.x** | 中文生态最活跃（周下载约 62 万）；Ant Design Vue 近 21 个月未发版，不押注 |
| 文档站（可选） | **VitePress 1.6.x** | 2.0 仍是 alpha 重写版，勿用于教学 |
| 编辑器工具链 | VSCode 扩展 **Vue (Official)** + **vue-tsc 3.3** | 官方唯一推荐扩展（Volar 已更名 language-tools） |
| CSS 工具（可选章节） | **Tailwind CSS 4.3.x** | v4 已稳定一年半，CSS-first 配置，直接教 v4 |

## 二、完整版本快照总表

| 技术 | 当前稳定版本 | 一句话说明/备注 | 来源 |
|---|---|---|---|
| Node.js（Active LTS） | 24.x | 2025-05-06 发布；Maintenance 至 2028-04 | nodejs.org/en/about/previous-releases |
| Node.js（Maintenance LTS） | 22.x | 支持至 2027-04 | 同上 |
| Node.js（Current，非 LTS） | 26.x | 2026-05-05 发布，2026-10 转 LTS，课程不采用 | 同上 |
| Node.js（已 EOL） | 20.x | 2026-04-30 EOL | endoflife.date/nodejs |
| npm | 12.0.2（上代 11.x） | npm 12 于 2026-07-08 发布，install 安全默认有变化 | github.blog changelog |
| pnpm | 11.25.0 | pnpm 11 于 2026-04-28 发布，要求 Node ≥22.13 | pnpm.io/blog/releases/11.0 |
| yarn (Berry) | 4.18.x | Classic 冻结在 1.22.22；经 Corepack 分发 | github.com/yarnpkg/berry |
| Vue 3 | 3.5.42（2026-08-27） | 3.6（Vapor Mode）仍 RC（3.6.0-rc.7） | github.com/vuejs/core/releases |
| Vue 2 | 2.7.16（最终版） | EOL 2023-12-31，无安全补丁 | v2.vuejs.org/eol/ |
| create-vue | 3.23.0 | 官方脚手架；模板 vue ^3.5.42 + vite ^8.2.2 + TS ~6.0.0 | github.com/vuejs/create-vue |
| Vue Router | 5.3.1（5.0.0 = 2026-01-29） | v4→v5 迁移成本低 | router.vuejs.org migration |
| Pinia | 4.0.3 | Pinia 3（2025-02）放弃 Vue 2；Pinia 4（2026-07-14）仅技术性破坏 | github.com/vuejs/pinia CHANGELOG |
| Vite | 8.2.2（8.0.0 = 2026-03-12） | Rolldown（Rust）为唯一打包器 | vite.dev/blog/announcing-vite8 |
| Element Plus | 2.14.5 | 维护活跃，2026 年持续发版 | element-plus releases |
| Ant Design Vue | 4.2.6 | 最后发版 2024-11-11，事实性停更 | github issue 8381 |
| TypeScript（latest） | 7.0.2（GA 2026-07-08） | Go 原生编译器（tsgo）；programmatic API 未稳定 | devblogs.microsoft.com |
| TypeScript（课程采用） | 6.0.x（6.0.2 = 2026-03-23） | 最后一个 JS 实现的大版本；create-vue 模板锁定 ~6.0.0 | typescriptlang.org 6.0 release notes |
| ESLint | 10.10.0（10.0.0 = 2026-02-06） | v10 彻底移除 eslintrc | eslint.org blog |
| eslint-plugin-vue | 10.10.0 | 与 flat config 配套 | github releases |
| Prettier | 3.9.6 | v4 仅 alpha | github releases |
| Vitest | 5.0.0（2026-09-03 GA）；成熟线 4.x | 课程锁 4.x | github releases |
| Vue Test Utils | 2.5.0（2026-08-27） | 活跃维护 | npmjs |
| VitePress | 1.6.4 | 2.0 仍 alpha（2.0.0-alpha.20） | vitepress CHANGELOG |
| Vue 语言工具 | vue-tsc 3.3.11；仓库更名 vuejs/language-tools（原 Volar） | VSCode 官方扩展 "Vue (Official)"（Vue.volar）；vue-tsc 不支持 TS 7 | github.com/vuejs/language-tools |
| Tailwind CSS | 4.3.3（4.0 = 2025-01-21） | CSS-first 配置 | tailwindlabs releases |

## 三、写作时必须注意的 major 变化（防止"照旧文教错"）

1. **ESLint 10 移除 eslintrc**：flat config（`eslint.config.js`）是唯一方式；网上大量 Vue 教程仍是旧预设，课程需显式对比。
2. **Vite 5→6→7→8 不到两年**：老教程"Vite 底层是 Rollup + esbuild"的说法在 Vite 8 已过时（Rolldown 单一打包器）；讲构建原理按 Vite 8 叙述，讲公司存量 webpack4 时做对照。
3. **TypeScript 双轨制**：TS 7（tsgo）已 GA 但工具链（vue-tsc 等）未跟上；TS 6.0 改了一批默认 compiler options，tsconfig 讲解以 6.0 为准。
4. **Pinia 3/4 连续 major**：3 移除 Vue 2 支持；4 ESM-only、devtools-api 变 peer——对 Vite 项目几乎无感。
5. **Vue Router 5 吸收 unplugin-vue-router**：文件路由成为核心能力，教学顺序要调整。
6. **Tailwind v4 配置彻底改变**：默认无 `tailwind.config.js`，改 CSS 内 `@import "tailwindcss"` + `@theme`；v3 教材全部失效。
7. **pnpm 10/11 与 npm 12 的安全默认**：pnpm 默认不执行依赖的 lifecycle scripts（esbuild 等需 `approve-builds`）——学员最容易"装完跑不起来"的地方，值得单独演示。
8. **Vue 3.6/Vapor 在 RC**：课程统一锁 `~3.5.x`，防止学员装到 preview 版。
9. **Node 发布节奏变更**：2026-10 起"一年一个大版本（4 月发布、10 月转 LTS）"，讲版本策略按新模型。
10. **Vitest 5.0 刚 GA（2026-09-03）**：锁 4.x，讲义标注最新版为 5.0。

## 四、局限声明

- npm 12 的逐条 breaking changes 未逐一核验，备课用到时先读官方 release notes
- Ant Design Vue 无官方停更公告，"事实性停更"基于最后发版时间的描述
- TS 6.0.0 首发精确日期未核验（按 2026-03 口径）；Node 24/22 版本代号未核验
