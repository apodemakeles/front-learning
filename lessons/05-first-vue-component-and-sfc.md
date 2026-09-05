# 第 5 课：第一个 Vue 组件——模板与 SFC【毕业项目开工】

> 所属模块：模块三 · Vue 3 基础（共 5 课）｜ 前置课程：[第 4 课](04-typescript-for-java-devs.md) ｜ 预计用时：60–75 分钟
> 参考实现：[project/shop-admin/](../project/shop-admin/)——**毕业项目从本课开始逐课迭代**，每课先自己写，再对照参考实现 diff

## 本课目标

学完本课你能：

1. 看懂 SFC（单文件组件）的三段结构，理解"组件 = 自包含的视图单元"
2. 掌握模板最小集：插值 `{{ }}`、属性绑定 `:attr`、事件绑定 `@event`（完整细节下一课）
3. 初始化毕业项目"云上拿铁管理后台"，独立完成首页静态版

## 概念讲解

### 5.1 组件是什么：自包含的视图单元

前端页面由"组件树"搭成：顶栏、侧边菜单、统计卡片……每个组件**结构（HTML）+ 逻辑（JS）+ 样式（CSS）三合一**，装在一个 `.vue` 文件里，这就是 **SFC（Single File Component，单文件组件）**。

类比：像 Thymeleaf fragment / 自定义 JSP tag"自带逻辑和样式"的升级版——但组件是**可组合、可复用的函数单元**，不只是模板片段。

三段结构（拿我们马上要写的 App.vue 看个整体）：

```text
┌──────────────────────────────┐
│ <script setup lang="ts">     │ ← 逻辑：这个组件的数据与行为
│   const shopName = '云上拿铁'  │    （TS 写法，第 4 课的技能用上了）
│   function greet() {...}     │
│ </script>                    │
│ <template>                   │ ← 结构：HTML + 模板语法
│   <h1>{{ shopName }}</h1>    │    （声明式，见 5.2）
│ </template>                  │
│ <style scoped>               │ ← 样式：只作用于本组件
│   h1 { font-size: 20px; }    │
│ </style>                     │
└──────────────────────────────┘
```

### 5.2 template：声明式的地盘

模板里你只描述"**界面是数据的函数**"，三种最基本的写法先混熟：

**插值**——数据出现在哪，页面就显示什么：

```html
<h1>欢迎回来</h1>
<p>{{ today }}</p>
```

**属性绑定**（`v-bind` 的缩写 `:`）——HTML 属性的值也可以是表达式：

```html
<!-- title 是变量/表达式的求值结果，鼠标悬停显示 -->
<span :title="`今天是 ${today}`">店长：老曹</span>
```

**事件绑定**（`v-on` 的缩写 `@`）——用户操作触发 script 里的函数：

```html
<button @click="greet">打个招呼</button>
```

规则两条：`{{ }}` 和 `""` 里放的是**表达式**（三元、方法调用都行），不能放语句（没有 `if`）——和你写过的 EL 表达式同一个限制；带 `v-` 前缀的叫**指令**（模板的特殊行为），本课用到最常用的边界即止，全家福下一课。

### 5.3 script setup：组件的逻辑，一句话都不用"注册"

`<script setup lang="ts">` 是 Vue 3 的语法糖：**顶层声明的任何变量、函数，模板里直接可用**——不用 export、不用 return。对比你以后会在公司存量 Vue 2 代码里看到的 `data() { return {...} }` + `methods: {...}` 写法（一切都要"注册"），`setup` 就是把这两样干掉了。存量写法第 36 课专讲。

本课 script 里只有**普通常量和普通函数**——刻意如此。你可能会问：改了 `shopName` 页面会变吗？现在**不会**（普通常量不是响应式的）。"数据变了页面自动变"需要响应式系统，第 6、7 课揭密——本课先把组件的"壳"玩熟。

### 5.4 style scoped：样式的作用域

`<style scoped>` 里的 CSS **只作用于本组件**——你在 App.vue 里写 `h1 { color: red }`，不会污染全页面所有 h1。分工惯例：**全局的东西**（字体、背景、重置）放 `src/assets/main.css`，**组件自己的样子**放组件的 scoped style。实现原理见原理深入第 3 条，一句话：编译期魔法，运行时零成本。

## 动手实操：初始化毕业项目

从本课起，每课的实操都在**你自己的毕业项目**上迭代。以下步骤与课程仓库参考实现（[project/shop-admin/](../project/shop-admin/)）完全一致，全部实测过。

### 6.1 脚手架初始化

```bash
cd 你放代码的目录
pnpm create vue@latest shop-admin --ts
```

项目名随意（课程参考实现叫 `shop-admin`），`--ts` 只启用 TypeScript——Router、Pinia 等到对应课程再手动加装（增量引入，每样都知道为什么存在）。

### 6.2 清掉演示文件

脚手架自带演示页面对毕业项目是噪音，删掉：

```bash
cd shop-admin
rm -rf src/components src/assets/base.css src/assets/logo.svg public/favicon.ico README.md
```

留下来的就是最小骨架：

```text
src/
├── App.vue          ← 根组件（本课主战场）
├── main.ts          ← 入口（类比 main 方法，不用动）
└── assets/main.css  ← 全局样式（要改）
index.html           ← 唯一的 HTML（要改）
```

### 6.3 三处定制

**1）index.html**：语言与标题（SPA 的"门面"，用户浏览器标签上显示的就是它）：

```html
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>云上拿铁 · 管理后台</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

**2）src/assets/main.css**：换成全局重置 + 中文字体栈（完整内容见参考实现，核心就三行——`* { box-sizing: border-box; margin: 0; padding: 0 }` + body 的字体与背景色）。

**3）src/App.vue**：整个首页重写。结构如下（完整代码看[参考实现](../project/shop-admin/src/App.vue)，带中文注释）：

- script：`shopName` / `today` 两个常量 + `greet()` 函数
- template：顶栏（`{{ shopName }}` + 悬停提示 `:title`）、侧边菜单（**先写死 3 项**）、欢迎卡（`{{ today }}` + `@click="greet"` 按钮）、三张统计卡片（**先复制三份**）
- style scoped：flex 布局——顶栏横排、下方"菜单 + 主区"左右分栏、卡片横向排列

菜单写死、卡片复制——不是偷懒，是**给下一课留的作业钩子**：学完 v-for 你会亲手消除这些重复。

### 6.4 跑起来 + 构建验证

```bash
pnpm install
pnpm dev        # VITE ready，浏览器 http://localhost:5173
pnpm build      # 类型检查 + 打包
```

实测输出（参考实现，Node 24 / pnpm 11）：

```text
✓ built in 327ms
dist/index.html                  0.47 kB │ gzip:  0.37 kB
dist/assets/index-CERKeYLK.css   1.60 kB │ gzip:  0.58 kB
dist/assets/index-s05-_3CE.js   61.57 kB │ gzip: 24.52 kB
```

`build` 会先跑 `vue-tsc` 类型检查再打包——**每次 build 都过一遍类型检查**，这就是第 4 课说的"检查挂到构建期"。

### 6.5 纳入 git

```bash
git init && git add -A && git commit -m "lesson 05: 项目初始化 + 首页静态版"
```

## 原理深入

**1. SFC 不是浏览器认识的格式。** Vite 在开发期把每个 `.vue` 文件编译成 JS 模块：`template` 被编译成**渲染函数**，`style` 被注入为带作用域的 CSS。所以"组件"最终就是一个 JS 函数——描述"给我这些数据，我返回这样的界面"。这就是为什么 `.vue` 文件能被 `import`（第 3 课的 ESM）。

**2. 声明式的分界线。** 你写的模板是"**数据 → 界面**"的映射关系；"界面怎么从旧样子变成新样子"（DOM 增删改）全部归框架。本课数据是静态的还看不出威力——第 7 课数据一变你就明白了：你只改数据，页面自己动。

**3. scoped 的实现：编译期加"暗号"。** 编译器给本组件每个元素加上 `data-v-x7f2a9` 这样的属性，同时把你写的 `h1 { ... }` 改写成 `h1[data-v-x7f2a9] { ... }`——作用域就隔离了。纯编译期变换，运行时零开销。

## 作业

**任务**：完成你自己的毕业项目初始化与首页静态版（6.1–6.5 全流程），要求：

1. 店名换成你自己起的虚拟门店名（别叫云上拿铁，练手要练自己的）
2. 首页包含：顶栏（店名 + 日期插值 + 悬停提示）、侧边菜单 ≥3 项、欢迎卡（含 @click 按钮，控制台输出问候）、统计卡片 ≥3 张
3. 全部写在 App.vue 一个文件里；**不用** v-for、不用响应式 API
4. `pnpm build` 通过后做第一次 git 提交

**验收标准**（做完逐项自查）：

- [ ] 页面呈现完整布局：深色顶栏 / 白色侧菜单 / 欢迎卡 / 三张统计卡
- [ ] 顶栏日期是"X年X月X日 星期X"格式且就是今天（插值生效）
- [ ] 鼠标悬停"店长"一秒，浮出"今天是…"提示（`:title` 绑定生效）
- [ ] 点击按钮，DevTools 控制台（F12 → Console）输出问候（`@click` 生效）
- [ ] `pnpm build` 零错误；在 `dist/assets/*.js` 里能搜到你的店名

## 延伸阅读

- [Vue 官方 · 单文件组件（中文）](https://cn.vuejs.org/guide/scaling-up/sfc.html)
- [Vue 官方 · 模板语法](https://cn.vuejs.org/guide/essentials/template-syntax.html)——本课只看了前三分之一，下一课前可预习
- [Vue 官方 · 创建一个应用](https://cn.vuejs.org/guide/essentials/application.html)——main.ts 那两行的官方解释
