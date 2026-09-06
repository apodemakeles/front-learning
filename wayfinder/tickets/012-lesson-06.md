---
id: 012
title: 写课06：模板语法细节——绑定、条件、列表与 key
labels: [wayfinder:task]
status: closed
assignee: zcode
blocked-by: [011-lesson-05.md]
---

## Question

撰写 `lessons/06-*.md`：v-bind 全貌（class/style 绑定）、v-on 细节（修饰符）、v-if vs v-show、v-for 与 :key（key 的心智模型：diff 的"身份证"）、v-model 一瞥或留给表单课（第 27 课实战，此处只讲原理雏形）。毕业项目迭代：菜单与统计卡片改 v-for。

完成标准：正文发布、project/ 迭代入库、README 勾选 06、提交推送。

## Resolution

**产出**：

- 正文：`lessons/06-template-syntax-details.md`（概念 6.1–6.5：v-bind class/style、$event 与修饰符、v-if vs v-show、v-for/:key、v-model 一瞥；实操 7.1–7.5 全在毕业项目上迭代；原理 3 条：key=diff 身份证、两本成本账、修饰符=编译期语法糖）
- 项目迭代：`project/shop-admin/src/App.vue`（菜单/卡片 v-for + :key 稳定 id、:class active、@click.prevent 帮助链接、v-if 待关注标签）+ README 迭代记录
- README：第 6 课 ✅，进度 6/38

**实测事实**（Node 24 / pnpm 11 / Vite 8.2.2，macOS）：

- `pnpm build` 通过：`dist/assets/index-BhsHzt_b.js 63.00 kB │ gzip: 25.25 kB`、`index-0RayWvM0.css 1.93 kB`、`✓ built in 66ms`（第 5 课为 61.57 kB / 1.60 kB）
- Playwright 实测渲染 DOM：菜单 `<a class="active">经营看板</a><a class="">…`（:class 对象语法生效）；`v-if` 为假处只剩 `<!--v-if-->` 占位注释；临时实验 `v-show="false"` 元素在 DOM 且 `style="display: none;"`
- `.prevent` 实测：点击"帮助"后 `location.href` 保持 `http://localhost:5173/`，Console 打出 openHelp 日志
- 编译产物证据（`vue/compiler-sfc` compileTemplate 实跑）：`onClick: _withModifiers(..., ["prevent"])`、`_renderList(menuItems, item => ({ key: item.id, class: _normalizeClass({active: ...}) }))`、`card.alert ? ... : _createCommentVNode("v-if", true)`——课文原理部分引用

