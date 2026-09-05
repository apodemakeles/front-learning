# 第 2 课：Node.js 与 pnpm——前端的 JVM 与 Maven

> 所属模块：模块一 · 起步 ｜ 前置课程：[第 1 课](01-modern-frontend-overview-and-first-vue-app.md) ｜ 预计用时：60–75 分钟
> 版本基准：截至 2026-09（Node 24 LTS、pnpm 11，详见 [版本基准](../notes/tech-baseline.md)）

## 本课目标

学完本课你能：

1. 说清 Node.js 在前端工程里扮演的角色——不再混淆"跑在 Node 上"和"跑在浏览器里"
2. 掌握 pnpm 的日常全套操作：install / add / remove、scripts、依赖树查询
3. 读懂 package.json 的每个关键字段、看懂 lock 文件在锁什么，并理解 pnpm 的 node_modules 布局为什么比 npm 的干净

## 概念讲解

### 2.1 Node.js：开发期的"工作台"

Node.js = **V8 引擎**（Chrome 的 JS 引擎，对标 HotSpot）+ 文件/网络等系统能力。它是一个**运行时**，不是框架——这句话你应该很耳熟，把 JVM 换进去完全成立。

前端项目里跑在 Node 上的东西：pnpm、Vite、vue-tsc……**全是开发期工具**。你的业务代码一行都不跑在 Node 上（本课程范围内），它们最终跑在用户的浏览器里。复习第 1 课的心智模型 1：

| | Java 世界 | 前端世界 |
|---|---|---|
| 开发期运行时 | JVM | Node.js |
| 生产运行时 | JVM（同一个） | **浏览器**（另一个） |

### 2.2 包、registry 与 package.json

前端世界的"包"对标 jar：代码 + 一份元数据（package.json 对标 jar 里的 pom）。包都发布到 **registry**（对标 Maven Central），默认源是 `registry.npmjs.org`；国内普遍配镜像源 npmmirror——你公司存量项目就是这么配的。

**package.json 逐字段解剖**（就是你第 1 课生成的那个）：

| 字段 | 类比 | 说明 |
|---|---|---|
| `name` / `version` | artifactId / version | 包身份 |
| `private: true` | 内部工程不 deploy | 声明"这是应用不是库"，禁止发布到 registry |
| `type: "module"` | — | 声明本项目用 ESM 模块标准，第 3 课细讲 |
| `dependencies` | compile 依赖 | **会进最终产物**的包：vue |
| `devDependencies` | Maven 插件 + test 依赖 | 只在开发/构建期需要、**不进产物**：vite、typescript |
| `scripts` | 绑定到 phase 的插件目标 | 任务定义，见 3.5 节 |
| `engines` | maven-enforcer 的要求 | 声明 Node 版本要求（默认仅提示，不拦截） |

判别一个包该放哪边，就问一句：**"它的代码会出现在 dist/ 里吗？"**——vue 会，vite 不会。

**语义化版本（semver）**：`主版本.次版本.修订号`，而你写的 `^` 和 `~` 是**版本范围声明**，对标 Maven 的版本范围：

| 写法 | 含义 | 类比 Maven |
|---|---|---|
| `^3.5.40` | `>=3.5.40 且 <4.0.0` | `[3.5.40, 4.0.0)` |
| `~3.5.40` | `>=3.5.40 且 <3.6.0` | 只接受修订号升级 |
| `3.5.40` | 精确锁定此版本 | 写死版本 |

**lock 文件**：package.json 里写的是"范围"（意图），`pnpm-lock.yaml` 记录的是"解析结果"（快照）——每个范围最终落到了哪个精确版本，外加内容校验哈希。这就是**确定性构建**：你和 CI 装出**逐字节相同**的 node_modules。所以：

- lock 文件**必须提交进 git**（它就是"依赖锁定"，对标你在 pom 里锁定版本后 `mvn dependency:tree` 的结果固化）
- CI 里用 `pnpm install --frozen-lockfile`，禁止绕过 lock 重新解析

顺带两个你公司存量项目里的真实现象（以后你会遇到）：依赖里出现 `file:xxx-1.5.4.tgz`——本地 tgz 文件直接当包依赖（内部私有包没发源的土办法）；以及不同项目里 `package-lock.json` 与 `yarn.lock` 并存——npm/yarn/pnpm 各有各的 lock 格式，**互不通用**，这也是"一个团队统一包管理器"的理由。

### 2.3 pnpm vs npm：为什么课程主线是 pnpm

npm 早期为解决嵌套地狱，把传递依赖**提升（hoisting）到 node_modules 顶层**，形成"扁平化"布局。副作用叫**幽灵依赖（phantom dependencies）**：你没在 package.json 里声明的包，因为提升到了顶层，`import` 也能找到、也能跑——直到某天它的真实声明者升级不再依赖它，你的构建莫名报 `module not found`。

pnpm 的布局从结构上杜绝这件事（三层结构，3.3 节眼见为实）：

1. **全局 store**：每个包每个版本只存一份实体，所有项目共享——最像 `~/.m2/repository` 的设计
2. **项目内 `.pnpm/` 虚拟存储**：从 store 硬链接过来，按 `包@版本` 隔离
3. **node_modules 顶层**：只放你**直接声明**的依赖的符号链接——看得见的就是你声明的

## 动手实操

以下全部在你第 1 课的 `hello-vue` 项目里做（命令均已实测，macOS / Node 24 / pnpm 11）。

### 3.1 解剖 package.json

打开项目根的 `package.json`，对照 2.2 节的表格逐字段过一遍。重点看这两段：

```json
"dependencies": {
  "vue": "^3.5.40"
},
"devDependencies": {
  "@vitejs/plugin-vue": "^6.0.8",
  "typescript": "~6.0.0",
  "vite": "^8.1.5",
  "vue-tsc": "^3.3.7"
}
```

注意三种写法都出现了：`^`、`~`、以及 `@vitejs/plugin-vue` 这种带 scope 的包名（对标 Java 的 groupId 前缀习惯）。

### 3.2 依赖树：谁依赖谁

```bash
pnpm list --depth 0
```

```text
hello-vue@0.0.0 /path/to/hello-vue (PRIVATE)
│
│   dependencies:
├── vue@3.5.42
│
│   devDependencies:
├── typescript@6.0.3
├── vite@8.2.2
└── …（共 10 个直接依赖）
```

注意：package.json 里写的是 `^3.5.40`，这里显示实际装上的是 `3.5.42`——范围的解析结果。

再看"某个包为什么在"：

```bash
pnpm why vue
```

```text
vue@3.5.42
├─┬ @vitejs/plugin-vue@6.0.8
│ └── hello-vue@0.0.0 (devDependencies)
├─┬ vite-plugin-vue-devtools@8.2.1
│ └── hello-vue@0.0.0 (devDependencies)
├── hello-vue@0.0.0 (dependencies)
└─ …

Found 1 version of vue
```

读法：`vue` 是**你的直接依赖**，同时又是 `@vitejs/plugin-vue` 等工具的**传递依赖**；整棵树去重后只有一个 3.5.42。这就是 `mvn dependency:tree` 的前端版。

### 3.3 打开 lock 与 node_modules 两台"机器"

**看 lock 在锁什么**：

```bash
head -20 pnpm-lock.yaml
```

```yaml
importers:

  .:
    dependencies:
      vue:
        specifier: ^3.5.40        # 你声明的范围
        version: 3.5.42           # 实际锁定的快照
```

`specifier` 与 `version` 并排出现——"意图"与"事实"一行看穿。再往下翻还能看到每个包的 `integrity: sha512-…`（内容校验哈希，换镜像源下载也能验证没被篡改）。

**看 node_modules 的真实布局**：

```bash
ls -la node_modules | head -15
```

```text
lrwxr-xr-x   …  typescript -> .pnpm/typescript@6.0.3/node_modules/typescript
lrwxr-xr-x   …  vite -> .pnpm/vite@8.2.2_@types+node@24.13.3/node_modules/vite
drwxr-xr-x   …  .pnpm
```

顶层条目几乎全是**符号链接**，指向 `.pnpm/` 里按"包@版本"隔离的目录。数一下规模差：

```bash
ls node_modules/.pnpm | wc -l
# 154        ← 虚拟存储里的包（含全部传递依赖）
ls -la node_modules | grep -c '^l'
# 顶部链接数远小于 154 —— 顶层只有你直接声明的依赖
```

最后看全局仓库在哪：

```bash
pnpm store path
# /Users/<你>/Library/pnpm/store/v11
```

这台机器上**所有 pnpm 项目共享这一个 store**，每个包实体只存一份——`~/.m2` 的既视感。

### 3.4 加一个依赖的完整生命周期

```bash
pnpm add dayjs
```

```text
dependencies:
+ dayjs 1.11.23

Done in 1.8s using pnpm v11.21.0
```

此刻发生了三件事，用 git 验证（项目如果还没 init，先提交一次再操作）：

```bash
git diff --stat
# package.json     | +1 行 dependencies
# pnpm-lock.yaml   | 新增 dayjs 条目 + integrity 哈希
```

在代码里就能 `import dayjs from 'dayjs'` 了（import 语法第 3 课讲，今天不展开）。用完删掉：

```bash
pnpm remove dayjs
# - dayjs 1.11.23   Done in 420ms
```

换台新机器，只需要 `pnpm install`——按 lock 的快照复原出与你这台**完全一致**的 node_modules。给 CI 加 `--frozen-lockfile`，谁改了依赖没提交 lock 就直接失败。

> `pnpm add -D <包>` 装到 devDependencies；`pnpm add -g <包>` 装到全局（给命令行工具用，别装业务库）。

### 3.5 scripts：你的任务入口

`package.json` 里的 scripts 就是"可执行任务"（对标 mvn 的 phase）。除了脚手架自带的 `dev` / `build` / `preview`，加一个自己的：

```json
"scripts": {
  "dev": "vite",
  "greet": "echo hello from script"
}
```

```bash
pnpm greet
# $ echo hello from script
# hello from script
```

两个小知识：`pnpm greet` 是 `pnpm run greet` 的省略形式，但 script 名与 pnpm 内置命令撞名时必须写全 `run`；另外 pnpm 还有 `pnpm dlx <包>`——不安装、一次性运行某个包的命令（对标 npx），比如临时跑个脚手架。

### 3.6 registry 与镜像（国内现实）

```bash
pnpm config get registry
# https://registry.npmjs.org/     ← 官方源（默认）
```

国内访问慢或超时，就在**项目根**放一个 `.npmrc`（随 git 提交，全团队生效）：

```ini
# 文件：.npmrc
registry=https://registry.npmmirror.com
```

换源只影响"从哪儿下载"。lock 里的 integrity 哈希保证：无论官方源还是镜像，装到手的包内容必须一致，否则报错。

## 原理深入

**1. 确定性构建三件套**：semver 范围表达**意图**（"我要兼容 3.x 的最新修复"），lock 快照固化**事实**（"3.5.42，就是这个"），integrity 哈希提供**校验**（"字节级没被换"）。你写 pom 的版本范围、又在 release 里锁死版本时，干的就是同一件事。

**2. pnpm 的三层"中央仓库"设计**：全局 store 存唯一实体 → 项目 `.pnpm/` 硬链接隔离 → 顶层符号链接声明可见性。硬链接意味着多项目零拷贝复制；"包@版本"目录隔离意味着不同版本互不污染。

**3. 幽灵依赖为什么是隐患**：npm 扁平化布局下"能 import 到"不等于"你声明了"。构建工具的解析顺序今天帮了你，明天换个包管理器、或者某个上游依赖不再传递依赖它，你的代码就断——**"能跑"不等于"声明正确"**，这在后端世界同样成立（你不也会把没声明的 classpath 依赖当坏味道吗）。

## 作业

**任务**（继续在 hello-vue 项目里做）：

1. 对照 2.2 节表格，给 package.json 每个字段写一句中文注释（本地文件，不用提交）
2. 运行 `pnpm why vue`，记录输出；回答：为什么 vue 在 dependencies 而 vite 在 devDependencies？
3. `git init` 提交初始状态 → `pnpm add dayjs` → `git diff pnpm-lock.yaml` 找出 specifier 与 resolution 两处新增 → `pnpm remove dayjs` 确认恢复
4. 新增 script `greet` 输出你的名字；再新增 `pregreet`（输出 "准备打招呼"），观察两个任务的执行顺序
5. 配置项目 `.npmrc` 使用 npmmirror，删掉 node_modules 后重装成功（保留或改回随意）

**验收标准**（做完逐项自查）：

- [ ] `pnpm why vue` 显示 `hello-vue@0.0.0 (dependencies)`，且全树只有 1 个版本 3.5.42
- [ ] 能指着 pnpm-lock.yaml 说出 `specifier: ^3.5.40` 与 `version: 3.5.42` 各自是什么
- [ ] dayjs 增删的 git diff 只涉及 package.json 与 pnpm-lock.yaml 两个文件
- [ ] `pnpm greet` 按预期输出，且 `pregreet` 先于它执行
- [ ] 能用三句话说清 store / .pnpm / node_modules 顶层链接的三层关系

## 延伸阅读

- [pnpm 官方文档（中文）](https://pnpm.io/zh/)——重点读 [npm 与 pnpm 的区别](https://pnpm.io/zh/pnpm-vs-npm)
- [semver 规范（中文）](https://semver.org/lang/zh-CN/)
- [package.json 字段官方参考](https://docs.npmjs.com/cli/v11/configuring-npm/package-json)
- [Node.js 官方 · 关于](https://nodejs.org/en/about)
