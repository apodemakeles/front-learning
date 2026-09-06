# 第 8 课：watch 家族——watch / watchEffect 与副作用【毕业项目迭代】

> 所属模块：模块三 · Vue 3 基础（共 5 课）｜ 前置课程：[第 7 课](07-reactivity-ref-computed.md) ｜ 预计用时：60–75 分钟
> 参考实现：[project/shop-admin/](../project/shop-admin/)——本课给毕业项目加三个副作用：菜单持久化、数据变更记录、标签页标题跟随

## 本课目标

学完本课你能：

1. 分清"算值"与"做事"：该用 computed 还是该用 watch，一眼定夺
2. 用 `watch` 盯住明确的数据源（含多源与新旧值），用 `watchEffect` 写"依赖自动收集"的联动
3. 识别两个高频坑：对象 mutate 时新旧值同引用、`deep: true` 的代价

## 概念讲解

### 8.1 副作用：computed 算值，watch 做事

第 7 课留了一句话："数据变了要**做**点什么，是 watch 的领地"。现在展开。

**副作用（side effect）**= 渲染之外的一切动作：写 localStorage、改 `document.title`、发请求、打日志。这些活儿有个共同点——**产物不是"一个值"**，没法用 `x = ...` 接收。判据就这一条：

| 逻辑的产物 | 用什么 | 类比 |
|---|---|---|
| 一个值（从别的数据**算**出来） | `computed` | getter 方法 / 纯函数 |
| 一件事（数据变了之后**做**个动作） | `watch` / `watchEffect` | @EventListener：条件触发，执行动作 |

第 7 课的营业额是算值（computed）；本课的"菜单变了要写 localStorage"是做事（watch）。用错方向的信号：computed 的 getter 里开始改别的状态、发请求——那是副作用混进了纯函数。

### 8.2 watch：明确指源的侦听

```ts
import { watch } from 'vue'

// 单源：直接给 ref
watch(activeMenuId, (id) => {
  localStorage.setItem('shop-admin:active-menu', id)
})

// 多源：数组，回调按位置解构拿新旧值
watch([orderCount, pendingCount], ([orders, pending], [prevOrders, prevPending]) => {
  console.log(`订单 ${prevOrders} → ${orders}`)
})

// 盯对象的某个属性：getter 形式（指到具体路径，别用 deep，见 8.4）
watch(() => form.price, (price) => { ... })
```

三个要点：

1. **默认懒执行**：创建时不跑，数据第一次变化才跑。想"创建时也跑一遍"加 `{ immediate: true }`
2. 回调参数 `(newVal, oldVal)`，多源时是数组——**新旧值是本课审计日志的主角**
3. 写在 `<script setup>` 里的 watch 在组件卸载时**自动停止**，不用手动清理（App 根组件永不卸载，本项目暂时无感，第 9 课拆出组件后就是真话了）

### 8.3 watchEffect：不指源，跑了才知道

```ts
watchEffect(() => {
  document.title = `云上拿铁 · 今日 ${orderCount.value} 单`
})
```

不用告诉它盯谁：回调**立即执行一次**（这就是为什么标题一打开页面就对），执行中读了 `orderCount.value`，就自动盯上 `orderCount`——第 7 课依赖追踪模型的直接应用，第 7 课 Node 实验里你已经借用过它当"模拟渲染"。

选择规则两条：

- **知道确切的数据源、需要新旧值** → `watch`
- **依赖一串、不需要旧值、希望声明即生效** → `watchEffect`

拿不准就用 watch（显式指源的代码，半年后还读得懂）。

### 8.4 两个坑与 deep

**坑 1：对象 mutate 时，新旧值是同一个引用。**

```ts
const form = reactive({ price: 28 })
watch(form, (nv, ov) => {
  console.log(nv.price, ov.price)  // 30 30 —— 同一个对象，"旧值"也已经是新的了
})
form.price = 30
```

原因：你改的是对象**内部**，盒子没换。想要真旧值，就**替换式更新**（`form.value = { ...form.value, price: 30 }` 之类整体换新对象）。本课项目里盯的是 number，天然没这个坑；第 27 课表单会遇到，先记住结论。

**坑 2：`deep: true` 有代价。** 盯一个 ref 对象时默认只盯"盒子被整体替换"（`.value =`）；想盯内部任何属性变化就开 `deep: true`——代价是递归遍历整棵对象树登记依赖，大对象上不便宜。能用 `() => obj.prop` 指到具体路径，就不用 deep。

一句话带过、到课再讲的两个：回调里要操作**更新后的 DOM**（`flush: 'post'` / nextTick）→ 第 15 课；侦听器里发请求时的**过期响应清理**（onCleanup）→ 第 21 课。

## 动手实操

### 9.1 菜单持久化：watch 的本职

"记住用户上次停在哪个菜单"是中后台刚需，正好是一个教科书级副作用。两处改动：

初始值从 localStorage 读（`??` 兜底首次访问，第 4 课的空值合并又出场了）：

```ts
// 菜单高亮从 localStorage 恢复上次的选择（写回由下面的 watch 负责）
const activeMenuId = ref(localStorage.getItem('shop-admin:active-menu') ?? 'dashboard')
```

变化时写回：

```ts
// 副作用 1：菜单高亮变化 → 写入 localStorage，下次打开页面恢复
watch(activeMenuId, (id) => {
  localStorage.setItem('shop-admin:active-menu', id)
})
```

import 行补上 `watch`。保存后点击菜单切换几次，按 F5——高亮停在你最后点的菜单上。实测：点击"商品管理"后 `localStorage.getItem('shop-admin:active-menu')` 返回 `"products"`，刷新页面后高亮仍在第二项。

### 9.2 数据变更记录：多源 watch 与新旧值

给每次"模拟刷新"留一条审计日志（中后台的操作日志就是这个模式）。先准备日志状态，注意 key 用递增 id 而不是数组下标——第 6 课的纪律：

```ts
// 数据变更记录（审计日志）：watch 副作用的产物，只保留最近 3 条
let logSeq = 0
const changeLogs = ref<{ id: number; text: string }[]>([])
```

多源 watch，回调把新旧值写进日志：

```ts
// 副作用 2：统计数据变化 → 追加审计日志（多源 watch，回调同时拿到新旧值）
watch([orderCount, pendingCount], ([orders, pending], [prevOrders, prevPending]) => {
  const time = new Date().toLocaleTimeString('zh-CN')
  changeLogs.value.push({
    id: ++logSeq,
    text: `[${time}] 订单 ${prevOrders} → ${orders}，待处理 ${prevPending} → ${pending}`,
  })
  if (changeLogs.value.length > 3) changeLogs.value.shift()
})
```

模板在统计卡片下面加一段（完整样式见参考实现）：

```html
<section v-if="changeLogs.length" class="logs">
  <h2>数据变更记录</h2>
  <ul>
    <li v-for="log in changeLogs" :key="log.id">{{ log.text }}</li>
  </ul>
</section>
```

注意 `v-if="changeLogs.length"`：页面刚打开没有日志（watch 默认懒），整个区块不渲染。实测连点"模拟刷新"4 次，日志恰好 3 条，且旧新值首尾衔接成链：

```text
[10:09:06] 订单 190 → 124，待处理 1 → 8
[10:09:07] 订单 124 → 112，待处理 8 → 6
[10:09:08] 订单 112 → 122，待处理 6 → 2
```

第一条的起点 190 是第 1 次点击的结果——它作为最老的一条已被 shift 挤掉，留下的链条能对上每一次点击。watch 回调里改 `changeLogs` 触发列表重渲染，**副作用改状态再驱动渲染**，这条链路是响应式应用的常态（第 20 课"请求改 loading 再改数据"还是它）。

### 9.3 标题跟随：watchEffect 上场

```ts
// 副作用 3：标签页标题跟随订单数（watchEffect：不指定数据源，读了谁就盯谁）
watchEffect(() => {
  document.title = `云上拿铁 · 今日 ${orderCount.value} 单`
})
```

保存，看浏览器标签页：标题已经是"云上拿铁 · 今日 128 单"——watchEffect **创建即执行**。点"模拟刷新"，标题实时变（实测：卡片刷成 122 单后标题为 `云上拿铁 · 今日 122 单`）。

用 watch 写同样功能得写成 `watch(orderCount, (n) => { document.title = ... })`，还得记得 `{ immediate: true }` 否则首次标题不对。两相对比，选择规则（8.3）就不是教条而是体验了。

### 9.4 构建验证 + git

```bash
pnpm build
```

实测输出（对比第 7 课 JS 63.79 → 64.41 kB）：

```text
dist/index.html                  0.47 kB │ gzip:  0.37 kB
dist/assets/index-ChJmiYf1.css   2.35 kB │ gzip:  0.73 kB
dist/assets/index-DB5BDrSM.js   64.41 kB │ gzip: 25.76 kB
✓ built in 76ms
```

```bash
git add -A && git commit -m "lesson 08: watch/watchEffect——菜单持久化、审计日志、标题跟随"
```

## 原理深入

**1. watch 与 watchEffect 是同一个底座。** 两者都是"副作用 + 依赖追踪"（第 7 课的心智模型）：区别只在**依赖怎么登记**——watch 由你显式指源（懒，登记发生在数据第一次变化前的订阅里）；watchEffect 靠立即执行一遍来收集（立即，跑了才知道依赖）。所以 watch 天然拿得到"变化前"的旧值（它从订阅那一刻起就记录），watchEffect 没有清晰的"变化前"概念，不提供旧值。

**2. 级联是常态，环是事故。** 本课 watch 回调里 push 了 `changeLogs`，它变了又触发列表重渲染——"数据变化 → 副作用 → 改另一个数据 → 再渲染"的链路在真实应用里层层相扣（第 20 课的"改筛选 → 重新请求 → 改数据 → 重渲染"就是三连环）。链条不能成环：如果 watch 改的数据正是自己盯的，就会无限自我触发，页面失控（Vue 控制台会报递归警告）。作业选做 4 让你亲手造一次这个事故——看一眼就删，印象深刻远胜背结论。

**3. 引用陷阱的根子：watch 盯的是"引用"，不是"内容"。** `watch(form, ...)` 订阅的是 form 这个**代理对象本身**的属性读写；`form.price = 30` 改了内部属性、盒子没换，回调拿到的 new/old 自然指向同一个对象。替换式更新（`.value = 新对象`）之所以能留下旧值，是因为旧盒子还在旧值的引用里。这也解释了 deep：盯"内部任何属性"需要 Vue 递归遍历整棵树去逐属性登记，正是它的成本来源。

## 作业

**任务**：在你自己的项目上完成 9.1–9.4 全部迭代，然后：

1. 日志保留条数改成 5，并加一个"清空记录"按钮（`changeLogs.value = []`——清空后整个日志区块应该消失，想想为什么）
2. （选做）标题同时带上待处理数：`云上拿铁 · 今日 ${orderCount.value} 单 · 待处理 ${pendingCount.value} 件`——只改一行，依赖自动多一个，体会 watchEffect 的自动收集
3. （选做·事故实验）临时加一行 `watch(orderCount, () => { orderCount.value++ })`，保存观察几秒（数字失控、控制台告警），然后删掉恢复——亲手制造一次"环"

**验收标准**（做完逐项自查）：

- [ ] 点击"商品管理"后按 F5，高亮仍停在"商品管理"上
- [ ] 页面刚打开时没有"数据变更记录"区块（watch 默认懒执行）
- [ ] 连点"模拟刷新"4 次：日志最多 3 条、最早一条被挤掉，且上条新值 = 下条旧值
- [ ] 标签页标题随订单数实时变化，与卡片数字一致
- [ ] 若做选做 1：点"清空记录"后区块消失（v-if 生效），再点刷新又重新出现
- [ ] 若做选做 3：观察到失控现象后删除该行，页面恢复正常
- [ ] `pnpm build` 零错误

## 延伸阅读

- [Vue 官方 · 侦听器（watch / watchEffect 全文档）](https://cn.vuejs.org/guide/essentials/watchers.html)——deep、immediate、once、cleanup 的官方说明都在这一页
