---
id: 009
title: 写课03：现代 JavaScript 速览
labels: [wayfinder:task]
status: closed
assignee: agent（2026-09-06 完成）
blocked-by: []
---

## Question

撰写 `lessons/03-*.md`：面向 Java 开发者的现代 JS 速览——let/const、模板字符串、箭头函数（对标 lambda）、解构与展开、数组方法（对标 Stream API）、Promise 与 async/await（对标 CompletableFuture）、ESM（对照 Java 包机制，含命名/默认导出）。示例放 `demos/03-js-quick-tour/` 并在本机实测运行。

要求：按 AGENTS.md 标准课结构与 notes/writing-style.md 笔法；作业 = 小脚本练习 ESM 与异步（含验收清单）。

完成标准：正文与 demos 发布、README 目录勾选 03、提交推送。

## Resolution

2026-09-06 完成。产出：[lessons/03-modern-javascript-quick-tour.md](../../lessons/03-modern-javascript-quick-tour.md) + [demos/03-js-quick-tour/](../../demos/03-js-quick-tour/)（7 个文件）。

- **实测**：demos 下 4 个可运行入口（01-basics / 02-array-methods / 03-async / 04-main）全部 `node` 实跑，课文输出行逐条来自实测（含 sort 字典序坑 `[1,10,9]`、reduce 总价 510、Promise.all 并发 300ms、含税 ¥33.92）。
- 内容取舍：只讲 Vue 高频语法（解构/展开/箭头函数/数组方法链/async-await/ESM 两种导出），Stream API 对照表直迁记忆；明确不讲 DOM/闭包/原型链（心智模型="对象是属性包"）。
- demos 目录首次随课入库（01/02 课为学员自建项目不入库），符合 demos/README 约定。
- README 已勾选 03，进度 3/38。
