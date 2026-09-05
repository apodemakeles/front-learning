# 第 1 课：现代前端全景与你的第一个 Vue 应用

> 所属模块：模块一 · 起步 ｜ 前置课程：无 ｜ 预计用时：45–60 分钟
> 版本基准：截至 2026-09（Node 24 LTS、pnpm 11、Vue 3.5、Vite 8，详见 [版本基准](../notes/tech-baseline.md)）

## 本课目标

学完本课你能：

1. 在脑中建立"现代前端世界"的地图——每个技术都能对应到你熟悉的后端概念
2. 用官方脚手架 create-vue + pnpm 创建并跑起第一个 Vue 3 + TypeScript 项目
3. 完成第一处代码修改，体验前端开发最爽的"保存即热更新"

## 概念讲解

### 1.1 先看全景：一个前端项目由什么构成

你是 Java 老兵，最快的入门方式就是一张"两国对照表"。本课程会反复使用它：

| 前端世界 | 你熟悉的后端世界 | 一句话职责 |
|---|---|---|
| Node.js | JVM | 运行时（但角色微妙，见心智模型 1） |
| pnpm / npm | Maven / Gradle | 依赖管理 + 任务执行 |
| package.json | pom.xml | 项目元数据与依赖清单 |
| pnpm-lock.yaml | Maven 的版本锁定 | 确定性构建 |
| node_modules | ~/.m2/repository | 依赖实体（但装在项目目录里） |
| Vite | mvn compile + 热部署 + package | 开发服务器 + 生产构建 |
| Vue | Spring（生态位对应） | 应用框架 |
| Element Plus | 各种 starter / 轮子库 | 现成 UI 组件库 |
| 浏览器 | JVM（真正的生产运行时） | 最终执行你代码的地方 |

这张表里最容易搞错的是 Node.js 的定位，所以先立两个心智模型——它们是后端转前端的第一道坎，想通了后面 37 课都顺：

**心智模型 1：前端代码的生产运行时是浏览器，不是 Node。**

Java 世界里，JVM 既是开发运行时也是生产运行时，一套到底。前端世界不是：**Node 只在开发期出现**（跑构建工具、包管理器），生产环境里执行你代码的，是**用户的浏览器**。无论你用了多时髦的框架和语言特性，项目最终"编译"出来的只有三样东西：HTML、CSS、JavaScript——浏览器只认这三样。

**心智模型 2：前端项目的部署产物是静态文件，不是进程。**

Spring Boot 打出 jar 包、在服务器上起一个 JVM 进程；前端项目 build 出的是一个 `dist` 目录——一堆静态文件。任何能伺服静态文件的东西（比如 nginx）就足以让它"上线"。没有进程、没有端口监听你的应用逻辑，这是前端部署和后端部署最大的形态差异，也是为什么课程的毕业部署（第 37 课）只需要一个 nginx。

用一张图把两个模型串起来：

```text
开发期（你的电脑）                生产期（服务器）
┌─────────────────────┐        ┌──────────────────────┐
│  你写: .vue / .ts    │        │  vite build          │
│        │             │        │        │             │
│        ▼             │  ───►  │        ▼             │
│  Vite dev server     │  构建   │  dist/               │
│  （跑在 Node 上）     │        │   ├ index.html      │
│        │  即时转译    │        │   ├ assets/*.js     │
│        ▼             │        │   └ assets/*.css    │
│  浏览器（开发用）      │        │        │             │
└─────────────────────┘        │        ▼  nginx 伺服  │
                                │  用户的浏览器          │
                                └──────────────────────┘
```

### 1.2 Vue 是什么

一句话：**Vue 是一个声明式 UI 框架**。

用你熟悉的方式对比一下。**命令式**（原生 JS）是"一步步下指令"：

```js
// 找到元素 → 改它的内容；数据变了？自己再改一遍
document.querySelector('#count').textContent = 42
```

**声明式**（Vue）是"描述界面是数据的函数"：

```html
<span>{{ count }}</span>
```

你只声明"`count` 是多少，这里就显示多少"；`count` 变了页面怎么更新，是框架的事。这就像从"手写 JDBC 逐行 rs.next()"换成"写一句查询、ORM 负责映射"——你描述**是什么**，而不是**怎么 做**。

另外两个定位，先混个脸熟，不展开：

- **渐进式**：Vue 可以只用来增强一个页面的一个角落，也可以全家桶构建整站应用，按需取用。
- **SPA（单页应用）**：你们公司的管理后台就是这种形态——浏览器只加载一次页面，之后"翻页"其实是 JS 在切换视图，不再整页刷新。原理第 16 课（路由）讲。

课程主线教 **Vue 3**（公司新项目形态），公司存量的 **Vue 2** 在第 36 课用一课速览对照——你上班读老代码够用。

### 1.3 工具链：create-vue 与 Vite

- **create-vue**：官方脚手架，角色等同 **Spring Initializr**——问几个问题，生成一个能跑的项目骨架（Vite 配置、TS 配置、ESLint 全都配好）。本课马上用它。
- **Vite**（读作 /viːt/，法语"快"）：新一代构建工具，一个工具两个角色——开发期它是**开发服务器**（秒级启动 + 热更新），生产期它是**打包器**（把项目编译成 dist 静态产物）。本课只把它当"启动器"用，内部机制第 31 课专门拆。
- **pnpm**：包管理器，本课程的默认选择。Vue / Vite 官方生态的命令示例如今都以 pnpm 为主；它对标 npm，但磁盘占用和安装速度显著更好（原理第 2 课讲，今天先当 Maven 用）。

## 动手实操

所有命令都已在 macOS（Node 24、pnpm 11）上实测，预期输出的关键行一并给出。

### 2.1 检查环境

```bash
node -v
# v24.14.1   ← 课程基准是 Node 24 LTS；≥ 22 也可

pnpm -v
# 11.21.0
```

如果没有 pnpm，一行装上（它自己也是个 npm 包）：

```bash
npm install -g pnpm
```

### 2.2 创建项目

`cd` 到你放代码的目录，执行：

```bash
pnpm create vue@latest hello-vue --ts
```

`--ts` 表示启用 TypeScript，其余特性（Router、Pinia、测试、ESLint……）一律先不选——**它们每一个都对应后面的一课，到那一课再打开**。这是本课程的纪律：不在你能理解全貌之前，塞给你看不懂的配置。

预期输出（关键行）：

```text
┌  Vue.js - The Progressive JavaScript Framework

Scaffolding project in .../hello-vue...
│
└  Done. Now run:

   cd hello-vue
   pnpm install
   pnpm dev
```

> 不带 `--ts` 直接运行 `pnpm create vue@latest` 会进入交互式问答，效果相同。

### 2.3 安装依赖并启动

```bash
cd hello-vue
pnpm install        # 依据 package.json 拉取全部依赖到 node_modules/
```

预期输出结尾：

```text
Done in 9.8s using pnpm v11.21.0
```

（`node_modules/` 刚才发生了什么、为什么它有几十 MB——第 2 课解剖。）

启动开发服务器：

```bash
pnpm dev
```

预期输出：

```text
  VITE v8.2.2  ready in 859 ms
  ➜  Local:   http://localhost:5173/
```

注意这个启动速度——**不到 1 秒**。用惯了 Maven + Spring 启动一分半的你，值得在这一行多看两眼。

浏览器打开 <http://localhost:5173/>，看到 Vue 的 logo 和一句 **"You did it!"**——项目跑起来了。

### 2.4 你的第一次修改

保持 `pnpm dev` 运行，打开编辑器改两处：

**改动 1**：`src/App.vue` 第 13 行附近，把传给子组件的标题改掉：

```html
<!-- 文件：src/App.vue -->
<HelloWorld msg="我的第一个前端项目" />
```

**改动 2**：`src/components/HelloWorld.vue` 模板里那句英文自述，换成你的签名文案：

```html
<!-- 文件：src/components/HelloWorld.vue（节选） -->
<h3>
  写给 20 年后端老兵的第一行前端代码，By 你的名字
</h3>
```

保存的瞬间切回浏览器：**页面变了，但没有整页刷新**（盯着浏览器的标签页加载图标验证）——这就是 **HMR（热模块替换）**，热部署的前端形态。原理一句话：它不是重启应用，而是像外科手术一样只替换你改动的那块代码。深入机制第 31 课讲。

顺便留意一个细节：你改的第一行里，`msg` 从 `App.vue` 传给了 `HelloWorld.vue`——这就是"父组件向子组件传数据"（props），Vue 组件世界的第一块积木，第 5、9 课正式讲。今天只需要建立感觉："改这里，那边会变"。

### 2.5 一眼扫过项目结构

| 文件 / 目录 | 类比你熟的 | 一句话 |
|---|---|---|
| `index.html` | 唯一的入口页面 | 整个应用唯一的一个 HTML，挂载点在里面 |
| `src/main.ts` | main 方法 | 创建 Vue 应用实例，挂到 index.html 上 |
| `src/App.vue` | 根组件 | 界面树的根 |
| `src/components/` | 你的包结构 | 可复用组件放这里 |
| `package.json` | pom.xml | 依赖清单 + 可执行任务（scripts） |
| `vite.config.ts` | 构建插件配置 | Vite 的配置文件 |
| `tsconfig.json` | 编译器配置 | TypeScript 编译选项 |

`package.json` 里的 `scripts` 就是你的"可执行任务"（对标 Maven 的 phase）：

```bash
pnpm dev        # 启动开发服务器（日常开发 95% 的时间用它）
pnpm build      # 生产构建：类型检查 + 打包到 dist/
pnpm preview    # 本地预览 build 出来的产物
```

好奇的话，现在就可以跑一次 `pnpm build` 看看产物长什么样：

```text
✓ 27 modules transformed.
dist/index.html                  0.42 kB │ gzip:  0.28 kB
dist/assets/index-CyVfN59t.css   3.56 kB │ gzip:  1.16 kB
dist/assets/index-DIvsHyf0.js   71.33 kB │ gzip: 27.65 kB
✓ built in 537ms
```

看到没——`Hello World` 级别的 Vue 项目，产物就是 **1 个 HTML + 1 个 JS + 1 个 CSS**。心智模型 2 的实物证据。文件名里那串 `DIvsHyf0` 是内容 hash（缓存策略的关键），第 37 课讲部署时它就是主角。

### 2.6 （可选）纳入 git

create-vue 已生成 `.gitignore`（`node_modules/` 等不会入库），直接：

```bash
git init && git add -A && git commit -m "lesson 01: first vue app"
```

## 原理深入

今天只立三个心智模型，够用就好：

**1. "编译"去哪儿了？** 浏览器不认识 `.vue` 和 `.ts` 文件。开发期，Vite 在你请求某个文件时**即时转译**发给浏览器（所以启动快、按需编译）；生产期，`vite build` 把整个项目一次性编译打包成浏览器认识的三件套。对标 Java：前者像 IDE 的增量编译，后者像 `mvn package`。

**2. 一切最终收敛为三样东西。** 框架（Vue）、语言扩展（TS）、构建工具（Vite）都只为**开发体验**服务；无论链条多长，终点永远是 HTML + CSS + JS。想通这一点，你就明白了前端工程化的全部意义：**在"浏览器只认三件套"的约束下，尽力给你现代的开发体验**。

**3. HMR 不是重新部署。** 它是运行中的页面只替换被改动的模块、保留应用状态的技术。对比你熟悉的整包热部署（重启进程、丢会话），粒度细了一个数量级。

## 作业

**任务**：

1. 确认 Node ≥ 22（推荐 24）与 pnpm 已安装
2. 用 create-vue 创建项目（只启用 TypeScript）
3. `pnpm install` + `pnpm dev` 跑起来
4. 把页面主标题改成"我的第一个前端项目"，副标题署上你的名字
5. 保存修改，观察热更新；再跑一次 `pnpm build`，找到 dist 里的三个产物文件
6. （可选）把项目提交进 git

**验收标准**（做完逐项自查）：

- [ ] `node -v` 显示 v24.x（或 ≥ v22）
- [ ] 浏览器 http://localhost:5173 显示你改过的标题和署名
- [ ] 保存修改后页面 1 秒内变化，且浏览器没有出现整页刷新（看标签页的加载图标）
- [ ] 能指着 `dist/` 里三个文件说出它们分别是什么
- [ ] 能用一句话说出 App.vue / main.ts / index.html 三者的关系

## 延伸阅读

- [Vue 官方指南 · 简介（中文）](https://cn.vuejs.org/guide/introduction.html)——只读"什么是 Vue"一节即可
- [create-vue 仓库](https://github.com/vuejs/create-vue)——看看脚手架都能生成什么
- [Vite 官网](https://vite.dev/)——读首页"Why Vite"感受定位，配置先不碰
- [Node.js 发布版本策略](https://nodejs.org/en/about/previous-releases)——LTS 节奏与支持周期
