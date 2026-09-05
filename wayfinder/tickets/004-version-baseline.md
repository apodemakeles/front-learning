---
id: 004
title: 2026-09 版本基准与工具链选型
labels: [wayfinder:research]
status: closed
assignee: agent
blocked-by: []
---

## Question

截至 2026-09，课程各环节应锁定的稳定版本与选型：Node LTS、npm / pnpm、Vue 3、create-vue、Vue Router、Pinia、Vite、Element Plus、TypeScript、ESLint / Prettier、Vitest、VitePress、vue-tsc / Volar 现状、Tailwind 是否引入。

**产出**：`notes/tech-baseline.md`（版本基准表 + 选型建议 + 需要注意的 major 变化），供全部课程写作时统一引用（正文标注"截至 2026-09"）。

## Resolution

已通过研究 agent 于 2026-09-05 完成（npm registry 实时查询 + 官方公告交叉验证），完整结论见 [notes/tech-baseline.md](../../notes/tech-baseline.md)。锁定要点：

- **Node 24 LTS + pnpm 11 主线**（npm 12 作对照）；Node 20 已 EOL，明确淘汰
- **Vue 3.5.x**（3.6/Vapor 仍 RC，锁 ~3.5.x）；Vue 2 止于 2.7.16（EOL 2023-12-31），仅入存量专题
- **Vite 8.2**（Rolldown 已是唯一打包器）+ create-vue 脚手架
- **Vue Router 5.3**（文件路由并入核心）+ **Pinia 4**（API 与 3 一致）
- **TypeScript 6.0 而非 7**：vue-tsc 尚不支持 TS 7（tsgo API 未稳定），官方模板同样锁定 ~6.0.0
- **ESLint 10（flat config 唯一方式）+ Prettier 3.9 + Vitest 4**（5.0 刚 GA，不追）
- **Element Plus 2.14**（Ant Design Vue 事实性停更，不押注）；VitePress 1.6；VSCode 扩展统一 "Vue (Official)"

特别注意：课程技术叙述中"Vite 底层 Rollup+esbuild""eslintrc 配置""Tailwind v3 配置"等旧范式均已失效，详见基准文档第三节。
