# 第 13 课：composable 设计模式——useRequest / usePagination【毕业项目迭代】

> 所属模块：模块四 · Vue 3 进阶编码（共 6 课）｜ 前置课程：[第 12 课](12-scoped-slots-and-renderer-pattern.md) ｜ 预计用时：60–75 分钟
> 参考实现：[project/shop-admin/](../project/shop-admin/)——本课把"今日经营数据"抽成 `useMockStats`，加上 loading 状态机

## 本课目标

学完本课你能：

1. 分清"无状态工具函数"与"组合式函数"的边界，按 use 前缀范式编写可复用的有状态逻辑
2. 提炼 useRequest 形态的 composable（data / loading / 动作三件套），并正确处理防竞态
3. 说清 composable 为什么返回 refs 而不是 reactive，以及它的副作用为什么会自动清理

## 概念讲解

### 13.1 从工具函数到组合式函数

先看边界。你写过的 `rand()`、`sleep()` 是**无状态工具函数**：进什么出什么，两次调用互不相干——类比静态工具类（`StringUtils`）。而"今日经营数据"这块逻辑是**有状态的**：orderCount、pendingCount 是活的状态，statCards 是派生，refresh 是改状态的动作，还要带个 loading。

把这样一组"状态 + 派生 + 动作"封装成函数，就是**组合式函数（composable）**——约定俗成的记号是 **use 开头**。类比：工具函数像静态方法，composable 像**一个可 new 出来的有状态 Service**——每调用一次得到一套独立的状态（实例），函数体内用第 7、8 课的全部武器（ref/computed/watch）。

我们的痛点很具体：App.vue 里散装着 orderCount、pendingCount、AVG_PRICE、statCards、rand、refreshToday——第 16 课路由来了以后"每个页面都要拉自己的数据"，这套逻辑必须能整体搬走。现在就抽。

### 13.2 设计范式四条

```ts
export function useMockStats() {
  const orderCount = ref(128)          // ① 状态：ref
  const statCards = computed(() => …)  // ② 派生：computed
  async function refresh() { … }       // ③ 动作：函数，改状态
  return { orderCount, statCards, refresh }  // ④ 返回 refs（不返回 reactive）
}
```

1. **入参**：配置对象（`useXxx(options)`），本课的 composable 暂无配置，保持零参
2. **返回 refs，不返回 reactive**——这是最容易踩的坑，原因见原理深入第 2 条，一会用实验实锤
3. **动作函数一并返回**：使用方拿到的是"状态 + 操作"的完整能力包，不是裸数据
4. **内部副作用自动清理**：composable 在 setup 里调用时，它内部的 watch/watchEffect 注册到**当前组件实例**的作用域，组件卸载自动停止——第 8 课"写在 setup 里自动停止"的机制原样生效

### 13.3 useRequest 形态：data / loading / 动作

凡是"向远端要数据"的逻辑，无论 mock 还是真实接口，都是同一台状态机：

```text
idle ──send()──▶ loading ──成功──▶ data 更新，loading=false
                    │
                    └──失败──▶ error（第 20 课接上真实请求后处理）
```

```ts
async function refresh() {
  const requestId = ++seq      // 防竞态版本号
  loading.value = true
  await sleep(600)             // 模拟网络延时
  if (requestId !== seq) return // 已有更新的请求发出，本次结果作废
  orderCount.value = rand(80, 200)
  pendingCount.value = rand(0, 9)
  loading.value = false
}
```

**防竞态**值得现在记住：用户连点两次刷新，第一次的响应后到，不能让它覆盖第二次的结果。`seq` 是版本号——**类比乐观锁的 version 字段**：提交时版本对不上就作废。本课的按钮在 loading 期间禁用（UI 层挡住了连点），seq 是数据层的第二道防线——将来搜索框输入时（没法用禁用挡住用户），这道防线就是唯一的防线。真实请求场景第 21 课展开。

### 13.4 同族模式与生态

同一范式能装下你后半程课程要用的所有东西：

- `usePagination`：page/pageSize/total 三个 ref + next/prev 动作 + hasNext 派生（第 26 课分页实战）
- `useLocalStorage(key, initial)`：返回一个 ref，读时取 localStorage、写时回写——我们手写的持久化 watch 模式（已重复三次！）的通用化（本课作业）
- `useDebounce`、`useToggle`、`useEventListener`……全是这个配方

生态里有个库叫 **VueUse**——两百多个现成 composable 的集合，类比 Apache Commons：自己会写之后再用库，知道每个工具的内部长什么样。延伸阅读里有链接，建议本课作业后浏览一遍目录，建立"哪些轮子不用造"的地图。

## 动手实操

### 14.1 抽出 useMockStats

新建 `src/composables/useMockStats.ts`（完整代码见[参考实现](../project/shop-admin/src/composables/useMockStats.ts)）：orderCount/pendingCount/loading 三个 ref、statCards computed、带 seq 防竞态的 async refresh（600ms 模拟延时）。AVG_PRICE 和 rand 也搬进去——客单价与随机数是"数据逻辑"，不是"应用编排"。

### 14.2 App 消费 composable

App.vue 里原来散装的六处定义（两个 ref、常量、computed、rand、refreshToday 的实现）换成三行：

```ts
const { orderCount, pendingCount, loading, statCards, refresh } = useMockStats()

async function refreshToday() {
  await refresh()
  showToast(`数据已更新 ${new Date().toLocaleTimeString('zh-CN')}`)
}
```

注意**分层**：composable 提供"数据能力"；App 保留三个 watch（持久化、审计日志、标题）——它们是**应用级编排**（消费数据、联动 localStorage/DOM），不该混进数据层。refreshToday 也只编排"成功后弹 toast"。

按钮吃上 loading：

```html
<button class="primary" :disabled="!shopOpen || loading" @click="refreshToday">
  {{ loading ? '刷新中…' : '模拟刷新今日数据' }}
</button>
```

### 14.3 DataTable 补 loading 态

第 12 课作业 1 给 DataTable 加过 `loading?: boolean`——现在它是主角（当时没做的，代码在此）：

```html
<template v-if="loading">
  <tr class="empty-row"><td>加载中…</td></tr>
</template>
<template v-else-if="rows.length === 0">
  …暂无数据…
</template>
```

两个小决定：StatListView 新增 `loading` prop 下传给 DataTable；**StatCards 也声明同名 prop**（虽暂不用）——动态组件切换的两个视图接口对齐，`:loading` 才能统一写在 `<component :is>` 上，不会变成透传的杂散属性。

### 14.4 实验：composable 是普通函数

把 [demos/13-composables/composable-lab.mjs](../demos/13-composables/composable-lab.mjs) 拷进 shop-admin 运行（老规矩，借 node_modules）。实测输出：

```text
解构后：isRef(count) = true，count = 10，double = 20
inc() 后：count = 11，double = 22   ← 解构没有丢响应式

reactive 解构：lost = 0，state.count = 99   ← lost 是解构时的快照，永远停在 0
isReactive(state) = true，isRef(lost) = false
```

两个结论：composable **在组件外也能跑**（单元测试就这么干——不用渲染组件就能验证逻辑）；**返回 refs 的理由**是解构安全，返回 reactive 的话使用方一解构就拿到死快照（第 7 课限制在 composable 场景的再现）。

### 14.5 联动实测 + 回归

点"模拟刷新"后 150ms 与 1050ms 各采样一次（页内 async eval，实测）：

```json
{
  "during": { "按钮": "刷新中…", "禁用": true, "表格": "加载中…" },
  "after":  { "按钮": "模拟刷新今日数据", "数据行": 3, "toast": "数据已更新 10:05:14" }
}
```

三处 loading 联动同时生效：按钮文案与禁用、表格"加载中…"、0.6 秒后数据更新 + toast。回归照常（实测通过）：菜单切换、打烊蒙灰（`stat-list dimmed`）、标题后缀、KeepAlive。

```bash
pnpm build
```

```text
dist/assets/StatListView-BBiE9hPm.js    1.53 kB │ gzip:  0.87 kB
dist/assets/index-5uNM7ZEC.js          79.37 kB │ gzip: 31.86 kB
✓ built in 125ms
```

```bash
git add -A && git commit -m "lesson 13: useMockStats composable + loading 状态机"
```

## 原理深入

**1. composable 是"可移植的 setup 片段"。** 它没有任何魔法——就是普通函数调用响应式 API。之所以能自动清理副作用，是因为 Vue 给每个组件实例挂了一个**当前作用域**（effect scope）：setup 执行期间创建的 watch/watchEffect/computed 自动登记到这个作用域，组件卸载时整批停止。composable 在 setup 里被调用，它的副作用就落进宿主组件的作用域；在组件外调用（如单元测试），则落在全局作用域——照样能跑，只是清理要自己负责。**执行时机决定副作用归属**，这就是"在 setup 顶层同步调用 composable"这条官方建议的全部原因（异步之后再调用，作用域就接不上了）。

**2. 返回 refs 是解构安全的充分条件。** reactive 对象的响应式活在代理对象身上（第 7 课），解构等于把属性值抄走——拿到的是快照；而 ref 的响应式活在盒子里，解构只是把盒子本身递给使用方，读写照旧被拦截。所以 composable 的返回类型基本是"一堆 ref/computed + 函数"的对象。若想逼使用方不能解构、保持点访问，也有返回 reactive 的写法（Pinia 的 store 就允许两种），但默认姿势是 refs——**接口的解构自由是使用方的便利**。

**3. loading 期间保留旧数据是一种产品决策。** 本课的 refresh 在 loading 时不清空 statCards——表格只在列表视图显示"加载中…"（loading 行替代数据行），卡片视图维持旧数字。两种策略各有适用：保留旧数据（本课）适合"刷新"场景，界面不闪；清空再加载适合"换筛选条件"场景，旧数据已无意义。这个决策第 20 课接真实请求、第 25 课商品列表筛选时会反复出现——现在先有意识。

## 作业

**任务**：在你自己的项目上完成 14.1–14.5 全部迭代，然后：

1. 写 `composables/useLocalStorage.ts`：`useLocalStorage(key, initial)` 返回 ref——初始读 localStorage（没有则 initial），值变化写回。用它替换 App 里手写的**三处**持久化（菜单、营业状态）——`const activeMenuId = useLocalStorage('shop-admin:active-menu', 'dashboard')`，两个 watch 直接删掉
2. （选做）安装 VueUse：`pnpm add @vueuse/core`，用它的 `useLocalStorage` 替换你写的，对比行为是否一致——自己造过轮子，才知道轮子里有什么
3. （选做）给 useMockStats 加 error 态：refresh 内 10% 概率抛错，App 的 refreshToday 用 try/catch 捕获并 toast"刷新失败"（注意 finally 里loading 的收尾或让 composable 内部兜底——想清楚错误归谁处理）
4. （选做）在 lab 里再写一个 `useToggle(initial)` 返回 `{ value, toggle }`，然后改成返回 `[value, toggle]`（数组）——VueUse 里两种风格都有，体会差别

**验收标准**（做完逐项自查）：

- [ ] 点刷新：按钮变"刷新中…"并禁用；列表视图表格显示"加载中…"；约 0.6 秒后数字更新、toast 出现
- [ ] App.vue 里搜不到 `AVG_PRICE`、`rand`、`orderCount = ref`——数据逻辑全部住在 composable
- [ ] 若做作业 1：菜单/打烊的持久化行为与之前完全一致（切换后刷新页面仍保持），但 App 里只剩两行 `useLocalStorage(...)` 调用
- [ ] lab 输出与 14.4 一致（尤其 reactive 解构后 `lost = 0` 的死快照）
- [ ] `pnpm build` 零错误

## 延伸阅读

- [Vue 官方 · 组合式函数（Composables）](https://cn.vuejs.org/guide/reusability/composables.html)——官方的命名/返回值约定与本课范式对读
- [VueUse 官方文档](https://vueuse.org/)——两百多个现成 composable 的目录，重点浏览 Functions 一栏建立地图
