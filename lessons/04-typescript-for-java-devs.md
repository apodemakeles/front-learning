# 第 4 课：给 Java 开发者的 TypeScript 速成

> 所属模块：模块二 · 语言 ｜ 前置课程：[第 3 课](03-modern-javascript-quick-tour.md) ｜ 预计用时：60 分钟
> 示例代码：[demos/04-ts-quick-tour/](../demos/04-ts-quick-tour/) ｜ 版本：TypeScript 6.0（课程基准，"截至 2026-09"）

## 本课目标

学完本课你能：

1. 理解 TS 与 Java 最根本的差异——**结构化类型**，并知道它带来的自由与纪律
2. 掌握前端代码里最高频的 TS 特性：字面量联合、类型收窄、可辨识联合、unknown、可选链
3. 建立"类型检查发生在哪"的正确认知：**运行时没有类型，检查全靠编辑器与构建期**

本课**不讲**（你已会或后续课讲）：class / 继承 / 接口实现语法（Java 对应物你精通）、泛型基础、工具类型 `Partial` / `Pick` / `Omit`（第 14 课在 Vue 场景里讲）、枚举（现代 TS 社区已基本用字面量联合替代，认识即可）。

## 概念讲解

### 4.1 TS 是什么：一层可擦除的类型皮肤

TypeScript = JavaScript + **编译期类型层**。类型信息编译时全部擦掉，产物就是普通 JS——对标"源码 → javac"，只是类型不进产物。这带来一个必须刻在脑子里的认知（实操环节会眼见为实）：

> **运行时没有任何类型检查**。拼写错误、传错类型，node 照跑不误、页面照常渲染——直到那行代码执行时才炸。安全全部来自编辑器（红波浪线）和构建期检查（vue-tsc / tsc）。所以第 33 课的"质量链"里，类型检查是必配项。

### 4.2 差异一：结构化类型——"长得像，就兼容"

Java 是**名义类型**（nominal）：两个接口方法签名一模一样，也是互不兼容的两种类型，除非显式 `implements`。

TS 是**结构化类型**（structural）：**只看形状**。声明了 `{ name: string; price: number }`，任何有这两个字段的对象都能传——不管它是哪个接口、哪个字面量、有没有别的字段。

```ts
interface Product { name: string; price: number }
interface Goods { name: string; price: number }

const p: Product = { name: '拿铁', price: 32 }
const g: Goods = p   // ✓ 合法！Java 里这绝不可能
```

好处：不需要为了满足接口去写适配层，对象字面量拿来就用——前端代码因此非常轻。代价与纪律：编译器只认形状，**重命名一个字段就是静默的契约变更**（对方还带着旧字段名，形状对不上了）。把它当"API 契约思维"来用，你会觉得非常亲切。

### 4.3 差异二：联合类型与字面量类型——"值域"即类型

Java 里没有 `string | number` 这种写法（最接近的是 sealed interface）。TS 里联合是基础中的基础，而**字符串字面量联合**是前端建模状态的神器：

```ts
type Status = 'idle' | 'loading' | 'success' | 'error'
```

`Status` 类型的变量只能取这四个值之一——拼错成员名（`'loadign'`）在编译期就被拒绝。对比你在 Java 里写常量类 + if-else 链的日子。

### 4.4 差异三：类型收窄——控制流就是证据

联合类型的值，经过 `if` / `switch` / `typeof` 判断后，在分支内**自动缩小**为更精确的类型：

```ts
function describe(input: string | number): string {
  if (typeof input === 'number') {
    return input.toFixed(1)      // 这里 input: number，能点出 toFixed
  }
  return input.toUpperCase()      // 这里 input: string，能点出 toUpperCase
}
```

进阶形态是**可辨识联合**（discriminated union）——对标 Java 的 sealed interface + switch 模式匹配，且分支内自动"长出"对应字段：

```ts
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number }

switch (s.kind) {
  case 'circle': return Math.PI * s.radius ** 2  // 此分支知道有 radius
  case 'square': return s.side ** 2
}
```

给 `Shape` 加第三个成员而漏写分支，编译器报错——**穷尽性检查**，重构时的安全网。

### 4.5 差异四：any 与 unknown——两种"我不确定"

- `any`：**关闭检查**的逃生舱。`any` 上的任何调用都合法——编译器沉默，运行时爆炸。存量代码里常见，新代码里尽量别写。
- `unknown`：**安全的不确定**。可以承接任何值（`JSON.parse` 的返回、未知的 API 响应），但**必须先收窄才能使用**：

```ts
const raw: unknown = JSON.parse('{"name":"拿铁"}')
if (typeof raw === 'object' && raw !== null && 'name' in raw) {
  // 收窄通过，才允许继续
}
```

### 4.6 差异五：推断为主 + 泛型的"形状约束"

TS 的推断比 Java 的 `var` 激进得多——`const names = ['拿铁', '美式']` 直接推成 `string[]`，链式调用全程自动。**必须手写的只有**：函数参数（没有上下文可推断）、公共 API 的返回值（写全，契约清晰）。

泛型语法你闭眼都会，唯一的认知差异：`<T extends { id: number }>` 里的 `extends` 不是"继承自"，而是"**形状满足**"——传入的对象只要有 `id: number` 就行。

### 4.7 前端日常三件套：`?`、`?.`、`??`

API 返回的字段可能缺失——这是前端与"外部数据"打交道的日常，三个符号解决：

```ts
interface User { name: string; nickname?: string; address?: { city?: string } }

u1.nickname ?? '（未设置）'    // ??：null/undefined 时取右侧
u1.address?.city ?? '未知城市' // ?.：中途不存在就短路成 undefined，不抛 NPE
```

`?.` 就是 Java 里你写惯的 `Objects.requireNonNullElse(o.map(...))` 那套的语法糖版。

## 动手实操

示例在 [demos/04-ts-quick-tour/](../demos/04-ts-quick-tour/)。**运行方式很惊喜**：Node 24 已原生支持直接运行 `.ts` 文件（自动擦掉类型）——本课全程零配置：

```bash
node 01-structural.ts
# 拿铁
# 美式 ¥25
# 摩卡 ¥38
```

**1. 结构化类型**（[01-structural.ts](../demos/04-ts-quick-tour/01-structural.ts)）：两个"无关"接口互相赋值、字面量直接满足形状、多字段变量照样传。

**2. 联合与收窄**（[02-union-narrowing.ts](../demos/04-ts-quick-tour/02-union-narrowing.ts)）：

```bash
node 02-union-narrowing.ts
# 加载中…
# 状态：success
# 42.0 HI
# 12.57
# 9
```

文件末尾留了个彩蛋：收窄细到连**赋值**都被追踪——`let x: string | number = 42` 后立刻 `typeof` 判断，else 分支里 `x` 的类型是 `never`。亲手试一次，感受 TS 控制流分析的强度。

**3. any / unknown / 可选链**（[03-any-unknown.ts](../demos/04-ts-quick-tour/03-any-unknown.ts)）：注意 `unknown` 上直接调方法那行被注释掉了——去掉注释，编辑器立刻标红。

**4. 推断与泛型**（[04-inference.ts](../demos/04-ts-quick-tour/04-inference.ts)）。

**5. 见证类型检查的威力**（[05-why-typecheck.ts](../demos/04-ts-quick-tour/05-why-typecheck.ts)）——本课最重要的一次实验。第 3 课埋过的雷（属性名拼错），两种方式跑：

```bash
node 05-why-typecheck.ts
# undefined          ← 运行时静默错误！页面会显示空白而不是报错

pnpm --package=typescript@6 dlx tsc --noEmit --strict 05-why-typecheck.ts
# 05-why-typecheck.ts(8,21): error TS2339: Property 'nmae' does not exist on type
# '{ name: string; price: number; }'.
```

同一个文件：node 能跑（它只擦类型不检查），tsc 当场抓获并给出**文件、行、列**。这就是为什么真实项目里类型检查必须挂在编辑器 + 构建流水线上——第 33 课配置。

> 版本注：`dlx` 不锁版本会拉到最新的 TS 7（tsgo，Go 原生实现），所以这里显式锁了 `typescript@6`——与课程基准及 create-vue 模板一致（背景见[版本基准](../notes/tech-baseline.md)）。

## 原理深入

**1. 擦除式类型层**：TS 类型只活在编译期，产物是纯 JS。所以它做不了 Java 反射那种"运行时读类型"的事——需要运行时校验（比如校验 API 响应结构）时，要用收窄代码或校验库，而不是指望类型。

**2. 结构化的自由与代价**：免适配层是自由；"形状即契约"是纪律——删改字段等同于破坏契约，且编译器只能帮你到"形状对不上"为止，语义对不对仍靠人。

**3. 收窄的本质**：TS 对每条控制流维护"当前可能的类型集合"，`if` / `switch` / `typeof` / 真值判断都是给集合去掉不可能成员的证据。理解了这一点，各种"红线忽明忽暗"都能推理出来。

## 作业

**任务**：把第 3 课作业的 `products.mjs` / `main.mjs` 改写为 `products.ts` / `main.ts`：

1. 给商品定义 `type Product`（含必填 `name` / `price` / `stock`，可选 `description?`）
2. 定义 `type Status = 'idle' | 'loading' | 'success' | 'error'`，模拟加载函数返回"状态 + 数据"的可辨识联合
3. 模拟外部输入：`JSON.parse` 的结果声明为 `unknown`，收窄后再使用
4. 所有函数参数标注类型，公共函数返回值写全；`?.` 与 `??` 至少各用一处
5. 用 `pnpm --package=typescript@6 dlx tsc --noEmit --strict *.ts` 检查到零错误

**验收标准**（做完逐项自查）：

- [ ] `node main.ts` 输出与第 3 课 JS 版完全一致
- [ ] `tsc --noEmit --strict` 全绿；故意拼错一个属性名后再跑，能看到"文件(行,列)"格式的报错
- [ ] 全程没有出现 `any`
- [ ] `unknown` 上直接调用方法会被 tsc 拒绝（先制造一次这个报错，再修好它）

## 延伸阅读

- [TS Handbook（中文）——日常类型](https://typescript.bootcss.com/everyday-types.html) 与 [收窄](https://typescript.bootcss.com/narrowing.html) 两章，对应本课
- [TS 官方文档](https://www.typescriptlang.org/zh/docs/)
- [TypeScript 入门教程](https://ts.xcatliu.com/)——中文社区经典，补漏用
