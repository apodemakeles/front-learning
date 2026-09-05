---
id: 002
title: TypeScript 的引入时机与深度
labels: [wayfinder:grilling]
status: closed
assignee: agent（2026-09-05 与学员 grilling 定稿）
blocked-by: []
---

## Question

课程是否使用 TypeScript？从什么时候开始用？用到什么深度？光谱（供讨论）：

- **A. 全程 JS**——学习摩擦最小，但与业界与公司新项目现状脱节
- **B. 前几课 JS 打基础，掌握 Vue 核心后切 TS 并贯穿后续所有课与毕业项目**（过渡式）
- **C. 从第一课起全 TS**——对 Java 背景最自然，但第一课就要同时消化语言与框架

附带要定：

- TS 语言本身教多少（是否设一节"给 Java 开发者的 TypeScript 速成"原理课）
- 公司存量项目的 class 风格 TS 组件（vue-class-component）是否在 Vue 2 存量专题中专门讲

## Notes

- HITL 工单：需要学员在线一问一答推进。
- 结论影响 005 大纲中 TS 相关课时数量与位置。

## Resolution

2026-09-05 与学员 grilling 定稿：

1. **主策略：第一课起全 TS**。从第一个 Vue 组件起就写 TypeScript，与 create-vue 官方脚手架、毕业项目技术栈（工单 001）一致；前几课只做"轻量 TS"（类型推断 + 简单 props 类型），不提前引入高级类型技巧。
2. **速成课：独立一节「给 Java 开发者的 TypeScript 速成」**，排在第一行 Vue 代码出现之前；只讲 TS 与 Java 的差异点（结构化类型/鸭子类型、联合类型与字面量类型、类型收窄、any/unknown、泛型差异），跳过 class/接口/泛型基础（学员已精通 Java 对应物）。
3. **深度上限 = 读写公司级 Vue + TS 代码**：props/emits 类型、泛型组件、常用 utility types（Partial/Pick/Omit 等）讲透；类型体操（条件类型嵌套、infer 递归）不教，公司代码中的复杂类型以"读懂"为目标拆解；.d.ts 声明文件与 vue-tsc 类型检查机制归工程化课。
4. **存量专题配套**：Vue 2 存量专题独立一课讲 class 风格 TS 组件（vue-class-component / vue-property-decorator / vuex-class）——公司存量代码的真实形态，decorator 语法对 Java 背景迁移成本最低。

**对 005（大纲定稿）的输入**：速成课落位在"现代 JavaScript"模块末尾；"TS 深度以读写公司级代码为限"作为各课写作约束。
