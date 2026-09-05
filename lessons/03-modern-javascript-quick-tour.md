# 第 3 课：现代 JavaScript 速览——写给 Java 开发者

> 所属模块：模块二 · 语言 ｜ 前置课程：[第 2 课](02-nodejs-and-pnpm.md) ｜ 预计用时：60 分钟
> 示例代码：[demos/03-js-quick-tour/](../demos/03-js-quick-tour/)（每个文件都可直接 `node xxx.mjs` 运行）

## 本课目标

学完本课你能：

1. 读懂 Vue 代码里出现频率最高的 JS 语法：解构、箭头函数、展开、模板字符串、数组方法链
2. 用 ESM（import / export）组织代码，说清它和 Java 包机制的同与异
3. 用 async / await 写异步代码，并理解 JS 单线程为什么不"卡"

本课**不讲**的：DOM、浏览器 API、闭包原理、原型链——学 Vue 用不到那么深，遇到再查 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)。

## 概念讲解

### 3.1 先校准：JS 和 Java 的三个根本差异

| | Java | JavaScript |
|---|---|---|
| 类型 | 静态，编译期检查 | 动态，运行时才知道（下一课用 TS 补上） |
| 运行方式 | 编译成字节码，JVM 执行 | 引擎直接解释 + JIT（V8 很快，够用） |
| 函数 | 必须挂在类上 | **一等公民**：能存变量、当参数、当返回值 |

还有个最重要的心智模型：**JS 里没有 class 实例那种"包了多少行为"的对象，对象就是一个"属性包"**——`{ name: '拿铁', price: 32 }` 就是完整的一个对象，不需要类定义。class 语法存在，但你 90% 的时间面对的是属性包 + 函数。

练习环境就用 Node：`.mjs` 文件、`node xxx.mjs` 直接跑——比开浏览器顺手得多。

### 3.2 变量与字符串

```js
let count = 0        // 可变
const price = 32     // 不可重新赋值（默认用它，Java 人写 final 的习惯在这儿是标配）
```

字符串拼接用**模板字符串**（反引号），告别 `String.format`：

```js
const name = '拿铁'
console.log(`商品：${name}，价格：¥${price}`)   // 商品：拿铁，价格：¥32
```

### 3.3 箭头函数：就是 lambda

```js
// Java:   p -> p.getName()
// JS:              p => p.name
const getName = p => p.name
const add = (a, b) => a + b
```

函数可以当参数传（马上在数组方法里见）、有默认参数 `function f(x = 10) {}`。this 指向的坑属于历史包袱区，`<script setup>` 里写 Vue 基本碰不到，跳过。

### 3.4 解构与展开：Vue 代码的"空气"

这是你在任何现代前端代码里**每十行必见**的语法，务必练到不假思索：

```js
const product = { id: 1, name: '拿铁', price: 32, tags: ['热饮', '咖啡'] }

// 对象解构：一行取出多个属性（等号右边是属性包，左边是"取件单"）
const { name, price } = product

// 数组解构：按位置取
const [firstTag] = product.tags

// 展开（spread）：把属性包"摊开"
const discounted = { ...product, price: 26 }   // 拷贝并覆盖一个字段
```

最后一行是重点：**"不可变更新"的标准写法**——不改原对象，造一个新对象。Vue 的状态更新到处是这个模式，先混个手熟。

### 3.5 数组方法：把 Stream API 的记忆直接搬过来

| JavaScript | Java Stream 等价物 |
|---|---|
| `map(fn)` | `map` |
| `filter(fn)` | `filter` |
| `find(fn)` | `filter().findFirst()` |
| `some(fn)` / `every(fn)` | `anyMatch` / `allMatch` |
| `reduce(fn, init)` | `reduce` |
| `forEach(fn)` | `forEach` |

差别只有一条：JS 链是**立即求值**（每步生成真数组），Stream 是惰性的。数据量到十万级才有感，中后台开发可以忽略。

一个必踩的坑提前讲：`sort()` 默认**按字符串**比较——`[10, 9, 1].sort()` 得到 `[1, 10, 9]`（字典序）。数字排序必须给比较函数：`sort((a, b) => a - b)`。

### 3.6 异步：Promise 与 async/await

JS 是**单线程**的——没有线程池帮你等 IO。它的解法：遇到 IO 就"挂起当前函数，去干别的，好了再回来"。`Promise` 就是那张"取件凭证"（对标 `CompletableFuture`），`await` 就是"等凭证兑现"：

```js
function fetchProducts() {
  return new Promise(resolve => {
    setTimeout(() => resolve([{ id: 1, name: '拿铁', price: 32 }]), 300)
  })
}

const products = await fetchProducts()   // 写法上像同步，实际让出了线程
```

错误处理就是普通的 `try / catch`（包住 `await`），比 `.then().catch()` 链可读性好得多——日常一律用 async/await。并发用 `Promise.all`（对标 `allOf`）：

```js
const [products, shop] = await Promise.all([fetchProducts(), fetchShopInfo()])
```

### 3.7 ESM 模块：对照 Java 包机制

第 1 课 package.json 里那个 `"type": "module"` 就是声明"本项目用 ESM"。规则对照着记：

- **一个文件 = 一个模块**（没有 package 关键字，文件路径就是模块路径）
- **命名导出**：`export function foo()` / `export const X`——一个模块可以导出很多个，导入时**花括号 + 名字必须对**：`import { foo, X } from './utils.mjs'`
- **默认导出**：`export default xxx`——一个模块最多一个"主角"，导入**不用花括号、名字随便起**：`import anything from './format.mjs'`
- 想换名：`import { foo as bar }`；一次全拿：`import * as utils`
- **动态导入** `const mod = await import('./x.mjs')` 返回 Promise——这是路由懒加载的基石，第 17 课见

和 Java 最大的差异：**没有访问修饰符**——export 了就是 public，没 export 就是 private（模块外拿不到）。

## 动手实操

示例全部在 [demos/03-js-quick-tour/](../demos/03-js-quick-tour/)，跟着做一遍：

```bash
mkdir js-tour && cd js-tour
# 把下面 4 组文件依次建好（或直接对照 demos/ 目录）
```

**1. 基础语法**（[01-basics.mjs](../demos/03-js-quick-tour/01-basics.mjs)）：模板字符串、解构、展开各写一小段：

```js
const product = { id: 1, name: '拿铁', price: 32, tags: ['热饮', '咖啡'] }
console.log(`商品：${product.name}，价格：¥${product.price}`)
const { name, price } = product
const discounted = { ...product, price: Math.round(price * 0.8) }
console.log(discounted.price, product.price)
```

```bash
node 01-basics.mjs
# 商品：拿铁，价格：¥32
# 拿铁 32
# 26 32        ← 新对象 26，原对象还是 32
```

**2. 数组方法**（[02-array-methods.mjs](../demos/03-js-quick-tour/02-array-methods.mjs)）：对商品数组做一遍 map / filter / find / reduce，验证你 Stream 的肌肉记忆：

```bash
node 02-array-methods.mjs
# [ '拿铁', '美式', '摩卡' ]
# [ '拿铁', '摩卡' ]
# { id: 2, name: '美式', price: 25, stock: 0 }
# true true
# 510          ← 32×10 + 25×0 + 38×5
# [ 1, 10, 9 ] ← sort 的坑现场
# [ 1, 9, 10 ]
```

**3. 异步**（[03-async.mjs](../demos/03-js-quick-tour/03-async.mjs)）：两个"请求"用 `Promise.all` 并发，顶层 await 直接写在 `.mjs` 里：

```bash
node 03-async.mjs
# 店铺：虚拟门店（杭州）
# 共 2 个商品，总价格 ¥57
# 两个请求都完成，总耗时约 300ms（并发）而不是 500ms（串行）
```

**4. ESM**（[04-utils.mjs](../demos/03-js-quick-tour/04-utils.mjs) / [04-format.mjs](../demos/03-js-quick-tour/04-format.mjs) / [04-main.mjs](../demos/03-js-quick-tour/04-main.mjs)）：把命名导出、默认导出、两种导入各用一遍：

```js
// 04-main.mjs
import { formatPrice, TAX_RATE } from './04-utils.mjs' // 命名导入：名字必须对
import summarize from './04-format.mjs'                 // 默认导入：名字随便起
```

```bash
node 04-main.mjs
# ¥32.00
# 含税：¥33.92
# 共 2 件，合计 ¥57
```

## 原理深入

**1. 单线程为什么不卡**：把 JS 引擎想成**一个线程的事件循环**——所有函数排队执行，IO 完成事件也进队。`await` 不是阻塞等待，而是"登记回调、立即返回，事件到了再从登记处继续往下跑"。对比 Java 的"一请求一线程（池）"：JS 用"让出 + 事件"换来了单线程下的高并发。这就是 Node 能扛高 IO 并发的全部秘密。

**2. 立即求值 vs 惰性**：`arr.filter().map()` 每一步都真实生成中间数组——写法像 Stream，语义像 `for` 循环套 `for` 循环。日常无感，但别拿它处理百万级数据。

**3. 动态类型的自由与代价**：今天写的所有代码都没有类型声明——爽，但把 `product.nmae` 打错了，运行到那行才知道。这正是下一课 TypeScript 存在的理由：**把 Java 的编译期安全带回来，还不用写 class**。

## 作业

**任务**：在本地建 `js-tour` 目录，完成一个"商品小工具"：

1. `products.mjs`：命名导出商品数组（至少 5 件，含 price/stock 字段）和一个 `TAX_RATE` 常量；默认导出一个 `formatList(list)` 函数（返回"共 N 件，合计 ¥XX"）
2. `main.mjs`：用 Promise + setTimeout 模拟"加载商品"（200ms）；`await` 拿到后：解构出第一个商品、用链式方法算出**有库存商品的总价**、用展开语法给全场打 8 折生成新数组（不改原数组）
3. 全部用模板字符串输出，每种结果一行

**验收标准**（做完逐项自查）：

- [ ] `node main.mjs` 一次跑通，输出包含：第一个商品名、有库存商品总价（数值对得上）、打折后数组长度不变且原数组价格未变
- [ ] `products.mjs` 的默认导出与命名导出在 `main.mjs` 里用了两种不同的导入写法
- [ ] 代码里没有出现 `var` 和 `==`
- [ ] 删掉 `products.mjs` 里任何一个 export，`node main.mjs` 会报错（体会"没 export 就是 private"）

## 延伸阅读

- [MDN JavaScript 指南（中文）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide)——当参考书查，不必通读
- [现代 JavaScript 教程](https://zh.javascript.info/)——社区最好的系统教程，第 2、10、11 章对应本课
- [Node.js ESM 官方文档](https://nodejs.org/api/esm.html)
