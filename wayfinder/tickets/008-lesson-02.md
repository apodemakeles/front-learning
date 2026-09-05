---
id: 008
title: 写课02：Node.js 与 pnpm
labels: [wayfinder:task]
status: closed
assignee: agent（2026-09-06 完成）
blocked-by: [006-repo-structure.md]
---

## Question

撰写 `lessons/02-*.md`：Node.js 运行时定位（不是框架）、pnpm 与 npm 对照、package.json 各字段=pom.xml、semver ^~ 规则=Maven 版本范围、lock 文件与确定性构建、node_modules 结构、镜像源、scripts。可引用 notes/company-stack.md 中公司真实依赖现象（本地 tgz 包、锁文件并存）做案例。

要求：按 AGENTS.md 标准课结构；作业=分析第 1 课项目的依赖树、解读 lock、装一个依赖并观察变化，含验收标准。

完成标准：正文发布、README 目录勾选 02、提交推送。

## Resolution

2026-09-06 完成。产出：[lessons/02-nodejs-and-pnpm.md](../../lessons/02-nodejs-and-pnpm.md)。

- **写作前实测**（重建 create-vue 项目，Node v24.14.1 / pnpm 11.21.0）：`pnpm why vue`（直接依赖 + @vitejs/plugin-vue 等传递依赖，dedup 为 1 个 3.5.42）、`pnpm list --depth 0`、`pnpm-lock.yaml` 头部（specifier `^3.5.40` → version `3.5.42` + integrity sha512）、`ls -la node_modules`（顶层符号链接 → `.pnpm/`，虚拟存储 154 个包）、`pnpm store path`（~/Library/pnpm/store/v11）、`pnpm add dayjs`（+1.11.23，lock 双处变化）/ `pnpm remove`、`pnpm config get registry`、自定义 script 执行。课文输出关键行全部来自实测。
- 正文结构：Node 角色双运行时表 → package.json 逐字段类比表 + semver 范围对照表 → 幽灵依赖与 pnpm 三层布局 → 实操六节 → 三个心智模型（确定性构建三件套 / 中央仓库三层 / 幽灵依赖）→ 作业（含 pre-greet 钩子、.npmrc 镜像重装）+ 5 项验收。
- 引用了公司存量真实现象（file:tgz 依赖、双 lock 并存），按脱敏纪律未出现内部信息。
- README 目录已勾选 02，进度 2/38。
