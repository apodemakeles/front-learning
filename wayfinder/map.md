---
id: 0
title: 前端课程地图
labels: [wayfinder:map]
status: open
---

## Destination

GitHub 上的一套完整前端课程仓库：20 年经验的后端开发者跟随学完后，能独立用 Vue 3（并能读懂、维护存量 Vue 2 项目）完成前端开发、构建、部署、上线。课程全部原创撰写、由浅入深、每课有作业，贯穿项目（毕业项目）有可访问的线上地址。

## Notes

- 领域：前端教学。写作规范、学员画像、后端类比表见根目录 `AGENTS.md`——每个会话开工前必读。
- tracker 为本地 markdown，规约见 `wayfinder/README.md`。
- 本 effort 允许携带执行：大纲定稿（005）之后，"写课"以 task 工单进入地图，每次会话推进一课。
- HITL 工单（grilling）需要学员在线一问一答推进，agent 不代答。
- 公司存量栈速记（详细版 `notes/company-stack.md`）：存量主力 Vue 2.6 + vue-cli4/webpack4 + Vuex + element-ui（class 风格 TS）；新项目 Vue 3 + Vite + Pinia + TS；部署 nginx（+ Docker 多阶段）+ 多环境 .env 构建模式。课程主线教新版本，存量技术以"维护视角"专题覆盖。
- 学员偏好（001 确立）：示例场景可虚拟、不追求业务贴近；技术栈与工程形态必须贴近公司真实栈。增强类功能（权限菜单/上传/WebSocket）不进毕业项目主线。

## Decisions so far

- [毕业项目选型](tickets/001-capstone-project.md) — 虚拟门店轻量管理后台；基础功能包（登录/守卫、商品列表分页筛选、CRUD 表单、看板图表）；mock 主线 + 可选自建后端；场景可虚拟、技术贴近公司栈
- [TypeScript 的引入时机与深度](tickets/002-typescript-strategy.md) — 第一课起全 TS（轻量起步）；独立「给 Java 开发者的 TS 速成」只讲差异点；深度以读写公司级代码为限、不做类型体操；class 风格组件入存量专题独立一课

- [2026-09 版本基准与工具链选型](tickets/004-version-baseline.md) — 锁定 Node 24 / pnpm 11 / Vue 3.5 / Vite 8 / Router 5 / Pinia 4 / TS 6（vue-tsc 不支持 TS 7）/ ESLint 10 / Vitest 4 / Element Plus 2.14，详见 [notes/tech-baseline.md](../notes/tech-baseline.md)

## Not yet specified

- 每课作业的验收方式：自查清单还是脚本自动检查
- 课程配套代码的组织方式：随课目录、独立示例仓库还是 git tag 快照
- 是否需要一节 React 概览课拓宽视野
- 课程页是否升级为 VitePress 文档站（当前用 README 目录）

## Out of scope

- HTML / CSS / Ajax 基础教学（学员已明确排除）
- Node.js 服务端开发（Express / NestJS 等）——只覆盖前端工程所需
- React 及其他 MV* 框架的深度教学
- 移动端跨端框架（uni-app / 小程序 / RN）与微前端（wujie）实操——最多概览带过
