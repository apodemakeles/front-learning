# 第 7 课：响应式心智模型——ref / reactive / computed【毕业项目迭代】

> 所属模块：模块三 · Vue 3 基础（共 5 课）｜ 前置课程：[第 6 课](06-template-syntax-details.md) ｜ 预计用时：60–75 分钟
> 参考实现：[project/shop-admin/](../project/shop-admin/)——本课兑现第 6 课的钩子：菜单点击切换高亮、统计数字"模拟刷新"

## 本课目标

学完本课你能：

1. 用"依赖追踪"心智模型说清"数据变了，页面为什么自动变"，并在 Node 实验里亲眼看到依赖的登记与注销
2. 用 `ref` 组织会变的状态（脚本里 `.value`、模板里自动解包），并说清为什么必须有 `.value`
3. 用 `computed` 表达派生数据并吃到缓存红利；知道 `ref` 与 `reactive` 怎么选

## 概念讲解

### 7.1 从"渲染一次"到"数据动了页面跟着动"

前两课的页面其实都是**渲染一次就完了**：第 6 课的 `activeMenuId` 是普通常量，你在控制台里改它，页面毫无反应——Vue 根本不知道它变了。响应式系统解决的就是这一件事。

心智模型（黑盒级，够你写对代码）：

```text
   ① 渲染时读数据 → 自动登记依赖            ③ 数据被写 → 通知所有登记过的渲染
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ 渲染函数跑了，读了          │          │ orderCount.value = 142    │
   │ orderCount、pendingCount  │          │ → 通知 → 渲染重跑          │
   └──────────────────────────┘          └──────────────────────────┘
                  ② 下次重跑时读哪些数据，依赖列表就动态更新成哪些
```

- 渲染函数执行时**读了哪些响应式数据**，就自动登记为那些数据的依赖
- 任何一个被登记的数据被写，渲染就重跑
- 重跑走的分支可能不同、读的数据可能不同，依赖列表**动态更新**

类比 Spring 的事件机制（发布-订阅），但**订阅零代码**：你不写任何 @EventListener，读一下数据就完成了订阅；赋一次值就完成了发布。全自动的代价是两条纪律：脚本里改 ref 必须写 `.value`（7.2 讲为什么）；想让页面跟着变，改的必须是响应式数据——普通常量变了没人通知。实验证据在 8.4，Node 里亲眼看。

### 7.2 ref：装基本类型的响应式盒子

```ts
import { ref } from 'vue'

const orderCount = ref(128)

orderCount.value = 142  // 脚本里：读和写都走 .value
```

```html
<p>{{ orderCount }}</p>  <!-- 模板里：自动解包，不写 .value -->
```

**为什么非要 `.value`**：JS 的 Proxy 只能拦截**对象**的属性读写，拦不住 `let x = 1; x = 2` 这种对基本类型的赋值。要让 number/string 变成"可追踪的数据"，唯一办法是装进盒子 `{ value: 128 }`——对 `.value` 的读写发生在盒子这个对象上，才拦得住。所以纪律：**脚本里永远 `.value`，模板里永远不写**（编译器自动补，纯编译期变换）。

顺着盒子模型还能解释一个坑：解构。`const { value } = orderCount` 拿到的是裸数字，盒子被丢在一边——读写它都没有追踪。对象解构丢响应式的坑在 7.3 展开。

ref 也能装对象和数组（`ref([...])`），内部自动做深层响应式——所以"全部用 ref"是完全成立的策略，不少团队就这么定规约。

### 7.3 reactive 与怎么选

```ts
import { reactive } from 'vue'

const form = reactive({ name: '', price: 0 })

form.price = 28  // 直接点访问，没有 .value
```

`reactive` 是 Proxy 的"原生形态"：只能用于对象，访问自然。三条限制都源于同一个事实——**响应式活在代理对象身上，脱离代理就没有追踪**：

1. **解构丢响应式**：`const { price } = form` 之后 price 是普通数字
2. **不能整体替换**：`form = reactive({ ... })` 重新赋值变量，模板认的还是旧对象，界面不更新
3. **只对对象生效**：number/string 装不进去

选型规则一条就够：**默认 ref；一组字段强内聚、总是整组读写（典型：表单模型）时用 reactive**。本课项目 ref 就够了——reactive 的主场是第 27 课的表单和第 18 课的 Pinia store，到时候用场景加深印象。

（存量对照：Vue 2 的 `data()` 里一切都是自动响应式，没有 ref/reactive 之分，底层用 Object.defineProperty，数组下标赋值还追踪不到——第 36 课专讲。）

### 7.4 computed：派生数据 + 白捡的缓存

```ts
const revenue = computed(() => Math.round(orderCount.value * AVG_PRICE))
```

"营业额"这种**从别的数据算出来**的值，永远不该自己维护一份——改了订单忘了改营业额，就是 bug。用 `computed` 声明派生关系，派生逻辑只存在一处。

和方法调用的差别：模板里写 `{{ getRevenue() }}`，每次渲染都重新执行；computed 是**缓存**的——依赖没变，读多少次都直接返回上次的结果；依赖变了才算下一次。类比 @Cacheable，但失效是自动的（依赖追踪），不用你管 key。

纪律一条：computed 的 getter 里**别写副作用**（改别的状态、发请求）——它是"算东西的"，不是"做事的"。"数据变了要**做**点什么"（打日志、发请求）是下一课 watch 的领地。

## 动手实操

### 8.1 兑现承诺：点亮菜单

第 6 课埋的钩子——`activeMenuId` 是常量，点菜单没反应。现在两处改动：

script：常量换 ref（`computed` 8.3 才用，一次引入）：

```ts
import { computed, ref } from 'vue'

const activeMenuId = ref('dashboard')
```

template：菜单 `<a>` 加 `@click`，直接给响应式变量赋值：

```html
<a
  v-for="item in menuItems"
  :key="item.id"
  :class="{ active: item.id === activeMenuId }"
  @click="activeMenuId = item.id"
>
  {{ item.label }}
</a>
```

两个细节：模板里的 `activeMenuId` 没写 `.value`（自动解包）；`@click="activeMenuId = item.id"` 是**内联语句**——事件绑定的值允许写赋值这类简单语句（`{{ }}` 插值里不行），这是 v-on 的特例。

保存后点菜单，高亮实时切换。你只改了一个变量，`:class` 的重算、DOM 的补丁全是框架的事——第 5 课说的"声明式的分界线"在此刻兑现。

### 8.2 让数字动起来：模拟刷新

统计数字换成 ref，再加一个模拟刷新函数（随机数假装是"接口返回的新数据"）：

```ts
const orderCount = ref(128)
const pendingCount = ref(3)

// 模拟刷新今日数据（第 22 课接入 mock 后，这里换成真正的接口请求）
function refreshToday() {
  orderCount.value = rand(80, 200)
  pendingCount.value = rand(0, 9)
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
```

欢迎卡的两个按钮包进一个容器（样式见参考实现）：

```html
<div class="actions">
  <button class="primary" @click="refreshToday">模拟刷新今日数据</button>
  <button @click="greet">打个招呼</button>
</div>
```

此刻 statCards 还是第 6 课的**常量数组**——点刷新数字会变，但卡片纹丝不动（常量变了没人通知，模板也不会重跑）。这个"坏状态"别急着修，先点两下感受一下，再进下一步。

### 8.3 卡片接上：computed 派生

```ts
// 虚拟客单价：营业额 = 订单数 × 客单价（派生数据，不需要自己的 ref）
const AVG_PRICE = 28.8

interface StatCard {
  id: string
  label: string
  value: string
  alert?: boolean // 为 true 时卡片显示"待关注"标签
}

const statCards = computed<StatCard[]>(() => [
  { id: 'orders', label: '今日订单', value: `${orderCount.value} 单` },
  {
    id: 'revenue',
    label: '今日营业额',
    value: `¥${Math.round(orderCount.value * AVG_PRICE).toLocaleString('zh-CN')}`,
  },
  {
    id: 'todos',
    label: '待处理事项',
    value: `${pendingCount.value} 件`,
    alert: pendingCount.value > 0,
  },
])
```

模板的 v-for **一行不用改**——computed 返回的还是数组，照常遍历。注意类型参数 `computed<StatCard[]>`：让 alert 恢复可选字段的身份，否则数组字面量推断成"有的有 alert、有的没有"的联合类型，模板里 `card.alert` 过不了 vue-tsc。

保存后点"模拟刷新"，实测（连续三次点击）：

```text
142 单  ¥4,090  3 件    ← 142 × 28.8 = 4089.6 → 4090
172 单  ¥4,954  8 件    ← 172 × 28.8 = 4953.6 → 4954
168 单  ¥4,838  2 件
```

两处"白捡"的联动值得盯着看：营业额自动跟随订单数；"待关注"标签随待处理数出现/消失——实测刷出 `0 件` 时 badge 从 DOM 里消失（v-if 的判断本身就住在 computed 里）。

改一处状态、三处 UI 跟着对。**状态只存一份，其余全是推导**——这是响应式代码最重要的组织原则。同时注意：`shopName`、`today`、`menuItems` 仍是普通常量——**按需响应式**，不会变的、不需要追踪的数据就不进盒子。

### 8.4 在 Node 里亲眼看依赖追踪

页面点起来很爽，但"依赖追踪"到底怎么发生的？10 分钟实验，不开浏览器。把 [demos/07-reactivity/reactivity-lab.mjs](../demos/07-reactivity/reactivity-lab.mjs) 复制到你的 shop-admin/ 下（借它的 node_modules），跑完删掉：

```bash
cp <课程仓库路径>/demos/07-reactivity/reactivity-lab.mjs .
node reactivity-lab.mjs
rm reactivity-lab.mjs
```

脚本两段：`watchEffect` 当"模拟渲染"演示依赖登记（它也是下一课主角，这里先借用），computed 的 getter 日志演示缓存。实测输出：

```text
== 实验 1：依赖追踪（watchEffect 模拟一次"渲染"）==
[渲染] count = 1
-- 改 count = 2：上次渲染读过它，是依赖，重跑 --
[渲染] count = 2
-- 改 visible = false：visible 是依赖，重跑；这次分支没读 count --
[渲染] count 已隐藏，本次不读 count
-- 再改 count = 3：没有任何渲染发生（count 已不是依赖）--

== 实验 2：computed 的缓存 ==
（营业额 getter 执行了一次）
第一次读 revenue：2900
第二次读 revenue：2900
-- 改 orders = 101 --
（营业额 getter 执行了一次）
依赖变了再读：2929
```

三个看点：

1. `count.value = 3` 之后**没有任何渲染输出**——上一轮渲染走了 `visible=false` 分支、没读 count，依赖已自动注销。依赖收集是**动态**的，按实际执行路径走，不是静态分析
2. 第二次读 revenue 没有 getter 日志——缓存直接命中
3. orders 变了再读，getter 重新执行——失效也是自动的

### 8.5 构建验证 + git

```bash
pnpm build
```

实测输出（对比第 6 课 JS 63.00 → 63.79 kB——响应式运行时本来就打进包里，业务代码只多了一点点）：

```text
dist/index.html                  0.47 kB │ gzip:  0.37 kB
dist/assets/index-GcMJnZvV.css   2.04 kB │ gzip:  0.68 kB
dist/assets/index-Cj4sun05.js   63.79 kB │ gzip: 25.53 kB
✓ built in 74ms
```

```bash
git add -A && git commit -m "lesson 07: 响应式——ref 菜单高亮与统计数字、computed 派生卡片"
```

## 原理深入

**1. 依赖追踪：读即订阅，写即通知。** Vue 3 用 Proxy 包住响应式数据：读属性时，当前正在执行的"副作用"（渲染函数、watchEffect、computed getter）被记进这个属性的依赖表；写属性时，通知表里的副作用重跑。粒度到属性级——改 `orderCount` 不碰 `pendingCount`，就只有读过 orderCount 的地方重算。这是观察者模式，但两端全自动：不用手动 subscribe，也不用手动 notify。8.4 实验里"分支换了、依赖跟着换"证明收集是运行时按实际执行路径做的。

**2. `.value` 不是设计缺陷，是 JS 的边界。** Proxy 只能代理对象，"让 number 可追踪"的唯一办法就是放进对象——ref 的本质是 `{ value: T }` 的响应式盒子，`.value` 是唯一被拦截的存取口。想通这一点，两个现象就通了：模板里不写 .value（编译器把 `{{ orderCount }}` 展开成对 `.value` 的读取，纯编译期）；`const { value } = orderCount` 之后失去响应式（裸数字拿走了，盒子被丢掉了）。

**3. computed = 自带失效的缓存。** 每个 computed 内部也是一个副作用：第一次被读时执行 getter、把结果存住、登记 getter 读过的所有依赖；此后再读直接返回存的结果；任何一个依赖被写就标记为脏，下次读取重算。依赖不变，N 次读取只算 1 次。比起你手写的 memoize，它连"什么时候失效"都不用你管——这就是 8.4 实验 2 的全部解释。

## 作业

**任务**：在你自己的项目上完成 8.1–8.5 全部迭代，然后：

1. 加第四张卡片"客单价"：营业额 ÷ 订单数，保留一位小数——computed 链再延一层（卡片本身也是 computed 数组的一项）
2. 菜单加第 4 项 `{ id: 'members', label: '会员管理' }`（第 6 课作业加过就保留），确认点击高亮切换正常
3. （选做）把 greet 的问候语改成带上当前订单数——普通函数里读 ref，一样用 `.value`
4. （选做）连点"模拟刷新"二十次，盯"待关注"标签：出现/消失是否始终与待处理数是否为 0 一致

**验收标准**（做完逐项自查）：

- [ ] 点击"商品管理"，高亮立即跳过去；再点"系统设置"又跳走——全程没有页面刷新
- [ ] 点"模拟刷新"数字每次都变；营业额始终 = 订单数 × 28.8（四舍五入，心算核对两次）
- [ ] 刷出"0 件"时"待关注"标签消失，非 0 时出现
- [ ] "客单价"卡片数值随订单数变化（改 orderCount 后营业额、客单价两张卡同时变）
- [ ] reactivity-lab.mjs 输出与 8.4 一致——尤其 count=3 后没有渲染输出、第二次读 revenue 没有 getter 日志
- [ ] `pnpm build` 零错误

## 延伸阅读

- [Vue 官方 · 响应式基础（ref 与 reactive）](https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Vue 官方 · 计算属性](https://cn.vuejs.org/guide/essentials/computed.html)
- [Vue 官方 · 深入响应式系统](https://cn.vuejs.org/guide/extras/reactivity-in-depth.html)（选读：黑盒往里看一层，Proxy 拦截的真实位置）
