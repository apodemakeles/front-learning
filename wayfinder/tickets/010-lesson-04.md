---
id: 010
title: 写课04：给 Java 开发者的 TypeScript 速成
labels: [wayfinder:task]
status: closed
assignee: agent（2026-09-06 完成）
blocked-by: [009-lesson-03.md]
---

## Question

撰写 `lessons/04-*.md`：只讲 TS 与 Java 的差异点——结构化类型（鸭子类型）、联合类型与字面量类型、类型收窄、any/unknown、泛型差异、类型推断习惯；跳过 class/接口/泛型基础（学员已精通 Java 对应物）。深度上限 = 读写公司级代码（工单 002 决议）。

实操方式（运行 TS 的最短路径，写作时实测选定，如 tsx / tsc）、示例放 `demos/04-ts-quick-tour/`。作业 = 把第 3 课的练习脚本改写为 TS 并补类型（含验收清单）。

完成标准：正文与 demos 发布、README 目录勾选 04、提交推送。

## Resolution

2026-09-06 完成。产出：[lessons/04-typescript-for-java-devs.md](../../lessons/04-typescript-for-java-devs.md) + [demos/04-ts-quick-tour/](../../demos/04-ts-quick-tour/)（5 个文件）。

- **运行方式选定（实测）**：Node 24 原生直接运行 `.ts`（类型擦除，零配置），全部 demo `node xxx.ts` 实跑通过；类型检查用 `pnpm --package=typescript@6 dlx tsc --noEmit --strict`（实测注意点：pnpm dlx 对多 bin 包必须用 `--package=pkg dlx bin` 形式；不锁版本会拉到 TS 7 tsgo——正文已作版本注）。
- **实测中抓到的真错误转为教材**：`let x: string|number = 42` 后 else 分支收窄为 `never`（赋值收窄），已写进 02 示例彩蛋与正文。
- **核心演示**：05-why-typecheck.ts 同一文件 node 能跑（输出 undefined，静默错误）vs tsc 报 `TS2339 Property 'nmae' does not exist (8,21)`——"运行时没有类型，检查靠编译期"的实证。
- 六个差异点齐备：结构化类型 / 联合与字面量 / 收窄与可辨识联合 / any vs unknown / 推断与泛型形状约束 / `?.`与`??`；跳过清单明确（class、枚举、utility types 留第 14 课）。
- 作业=第 3 课脚本 TS 化（tsc --strict 零错误为验收）。README 已勾选 04，进度 4/38。模块二（语言）完成。
