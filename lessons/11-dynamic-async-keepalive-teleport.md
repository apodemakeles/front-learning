# 第 11 课：动态组件、异步组件、KeepAlive、Teleport【毕业项目迭代】

> 所属模块：模块四 · Vue 3 进阶编码（共 6 课）｜ 前置课程：[第 10 课](10-v-model-attrs-provide-inject.md) ｜ 预计用时：60–75 分钟
> 参考实现：[project/shop-admin/](../project/shop-admin/)——本课给统计区加"卡片/列表"双视图（动态组件 + KeepAlive + 异步分包），再加一个 Teleport toast

## 本课目标

学完本课你能：

1. 用 `<component :is>` 做组件级视图切换，用 KeepAlive 保留各视图的私有状态
2. 用 `defineAsyncComponent` + 动态 `import()` 把组件拆出独立分包，按需加载
3. 用 Teleport 把弹层类 UI 送到 `body` 下，并说清"DOM 传送了、组件关系没变"

## 概念讲解

### 11.1 动态组件：`<component :is>`

"同一块区域，按当前状态显示不同组件"——统计区既能卡片展示、也能表格展示。最朴素的写法是一串 v-if：

```html
<StatCards v-if="statView === 'cards'" :cards="statCards" />
<StatListView v-else :cards="statCards" />
```

两个视图尚可忍，五六个就是面条。动态组件把"显示哪个"变成一个数据：

```html
<component :is="statViews[statView]" :cards="statCards" />
```

```ts
type StatView = 'cards' | 'list'
const statView = ref<StatView>('cards')

const statViews: Record<StatView, Component> = {
  cards: StatCards,
  list: StatListView,
}
```

`:is` 接组件对象（不是字符串标签名——那是渲染原生 HTML 时的用法）。tab 按钮只负责改 `statView`，视图怎么渲染、props 怎么接，全是各组件自己的事——又一层"数据驱动"。注意边界：这是**组件级**切换；真正的**页面级**切换（URL 变、可刷新直达）是路由的事，第 16 课。

### 11.2 KeepAlive：切换不销毁

默认行为要先记住：**动态组件切走 = 卸载**——实例销毁、DOM 移除、内部状态清零。切回来的是一个全新实例。

列表视图里有"仅看需关注"勾选框，用户勾了之后切去看卡片、再切回来——勾没了，体验很糟。`<KeepAlive>` 改变这一切：

```html
<KeepAlive>
  <component :is="statViews[statView]" :cards="statCards" />
</KeepAlive>
```

被它包住的组件切走时**不销毁，只是失活**（DOM 从文档摘下、实例进缓存），切回时原样挂回——勾选、滚动位置、输入内容全都在。类比对象池：借出去还回来，不销毁重建。

两个常用旋钮：`include` / `exclude` 按组件名选择性缓存，`max` 限制缓存数量（先进先出）。组件失活/激活时会触发 `deactivated` / `activated` 钩子——生命周期的事，第 15 课统一讲。

### 11.3 异步组件：defineAsyncComponent + import()

```ts
const StatListView = defineAsyncComponent(() => import('./components/StatListView.vue'))
```

`import()`（函数调用形式的动态导入）返回一个 Promise，加载完成才拿到组件。`defineAsyncComponent` 把这个 Promise 包成能放进 `:is` 的组件——**用到它的那一刻才开始下载**。

类比 JVM 的类加载：类是第一次被用到时才加载的，`import()` 就是前端的"第一次用到"。构建工具（Vite/Rolldown）以动态 import 为边界**切分包**：异步组件独立成一个小 js 文件，不进主包。

什么时候值得异步？看两个问题：这个组件**首屏就要吗**（不要→可异步）；它**大吗**（重量级图表、富文本编辑器→值得拆）。统计区的卡片视图首屏就要，同步加载；列表视图是次要视图，异步——一会你看 build 产物里的独立文件。

### 11.4 Teleport：把 DOM 送到别处

弹层类 UI（toast、下拉菜单、模态框）有个共同痛点：它们渲染在组件树内部，就可能被祖先的 `overflow: hidden` 裁掉、被复杂的 `position` 上下文带偏、被兄弟元素的 z-index 压住。Teleport 让**渲染位置**和**组件关系**分离：

```html
<Teleport to="body">
  <div v-if="toast" class="toast">{{ toast }}</div>
</Teleport>
```

这行代码在 App.vue 里，但 `.toast` 渲染出来直接挂在 `<body>` 下——不在 `#app` 里。而它的数据（`toast`）、样式（App 的 scoped）、事件全部照旧。一句话记牢：**Teleport 只挪 DOM，不改父子**。

## 动手实操

### 12.1 列表视图组件

新建 `src/components/StatListView.vue`——表格展示 + 一个私有状态：

```vue
<script setup lang="ts">
// 统计数据 · 列表视图：表格展示。"仅看需关注"是本视图的私有状态——
// 切到卡片视图再切回来仍保留，因为外层用 KeepAlive 缓存了本组件实例
import { computed, ref } from 'vue'
import type { StatCard } from '../types'

const props = defineProps<{ cards: StatCard[] }>()

const onlyAlert = ref(false)

// 过滤用 computed（不要在 v-for 里塞 filter）：派生数据留在 script 里
const shownCards = computed(() =>
  onlyAlert.value ? props.cards.filter(c => c.alert) : props.cards,
)
</script>
```

模板是表格 + 勾选框，外层**用一个 div 单根包裹**——多根组件不自动透传（第 10 课规则），外层的 `dimmed` class 要能落到根元素上。完整代码见[参考实现](../project/shop-admin/src/components/StatListView.vue)。两个细节：

- 过滤逻辑在 computed 里——第 6 课"过滤用 computed"的预告在此兑现
- 勾选框用 `v-model="onlyAlert"` 绑 ref：表单元素上的 v-model（`:checked` + `@change` 的糖），第 10 课解剖过的原理直接用

### 12.2 视图切换 + KeepAlive

App.vue 里把 `<StatCards ...>` 那行换成整个统计区：

```ts
type StatView = 'cards' | 'list'
const statView = ref<StatView>('cards')
const statViews: Record<StatView, Component> = {
  cards: StatCards,
  list: StatListView,
}
```

```html
<div class="stats-zone">
  <div class="view-tabs">
    <button :class="{ on: statView === 'cards' }" @click="statView = 'cards'">卡片</button>
    <button :class="{ on: statView === 'list' }" @click="statView = 'list'">列表</button>
  </div>
  <KeepAlive>
    <component
      :is="statViews[statView]"
      :cards="statCards"
      :class="{ dimmed: !shopOpen }"
    />
  </KeepAlive>
</div>
```

注意 `dimmed` 的透传对动态组件照样生效——落到**当前视图**的根元素。实测 KeepAlive 的完整剧本：

```text
① 点"列表" → 表格出现（3 行），勾选"仅看需关注" → 表格剩 1 行
② 点"卡片" → 卡片回来
③ 再点"列表" → 勾选还在、表格仍只剩 1 行   ← 状态被缓存了
```

（对照实验：把 `<KeepAlive>` 包裹临时去掉，重复 ①②③——勾选丢失，回到全量 3 行。看完把 KeepAlive 加回来。）

### 12.3 异步分包

App.vue 里 StatListView 的引入改成异步（`Component` 类型从 vue 导入 `import type`）：

```ts
const StatListView = defineAsyncComponent(() => import('./components/StatListView.vue'))
```

`statViews` 里放的就是它——**异步组件对 `:is` 和 KeepAlive 完全透明**，模板不用改一个字。证据有两份，实测都拿到了：

dev 模式 Network（F12 → Network，清空后点"列表"tab）——只有切过去的那一刻才发起请求：

```text
[GET] http://localhost:5173/src/components/StatListView.vue        => 200
[GET] http://localhost:5173/src/components/StatListView.vue?vue&…  => 200（它带的样式）
```

build 产物——独立文件，主包里没有它：

```text
dist/assets/StatListView-2DoHU3Y2.js    0.87 kB │ gzip:  0.57 kB
dist/assets/StatListView-BAWX10CI.css   0.63 kB │ gzip:  0.31 kB
dist/assets/index-xD9uUBVV.js          78.91 kB │ gzip: 31.66 kB
```

### 12.4 Teleport toast

点"模拟刷新"给个右下角提示。App 加状态与函数（定时器句柄记下来，重复点击先清旧定时器）：

```ts
const toast = ref<string | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | undefined

function showToast(msg: string) {
  toast.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = null), 2000)
}
```

`refreshToday` 末尾加一行 `showToast(\`数据已更新 ${new Date().toLocaleTimeString('zh-CN')}\`)`，模板末尾放 Teleport（样式见参考实现：fixed 定位右下角）：

```html
<Teleport to="body">
  <div v-if="toast" class="toast">{{ toast }}</div>
</Teleport>
```

实测（点刷新后）：

```text
.toast 文本        数据已更新 09:37:03
.parentElement    === document.body   （直接挂在 body 下）
#app 内搜索 .toast  找不到             （确实不在应用容器里）
2.2 秒后           .toast 从 DOM 消失  （v-if 翻转）
```

样式小注：`.toast` 的 scoped 样式写在 App.vue 里依然生效——Teleport 只挪 DOM 节点，节点上编译期就打好的 `data-v` 属性跟着走，样式匹配不受影响。

### 12.5 回归 + 构建

老三样照常：菜单切换、打烊联动（两个视图都蒙灰）、主题换色。构建零错误（完整输出见 12.3 的 build 产物），提交：

```bash
git add -A && git commit -m "lesson 11: 动态组件/KeepAlive/异步分包 + Teleport toast"
```

## 原理深入

**1. 切换、缓存、销毁是三种生命周期。** 无 KeepAlive 时，`component :is` 切走触发完整卸载（状态、DOM、事件监听全部回收——第 7 课"v-if 真销毁"的组件版）；KeepAlive 把"卸载"拦截成"失活"：实例和渲染过的 vnode 存进缓存 Map，DOM 从文档摘除但不销毁，切回时跳过重新创建、直接挂回。代价是内存常驻——`max` 就是缓存上限的保险丝。取舍和 v-if/v-show 同源：**切换频繁且要保状态 → KeepAlive；切换少或状态无所谓 → 裸切换**。

**2. 动态 import() 是构建器切包的唯一依据。** 你写 `import('./StatListView.vue')`，Rolldown 就以此为边界产出一个新 chunk，主包里留下一句"需要时去加载这个 URL"的运行时代码；`defineAsyncComponent` 负责把"加载 Promise"适配成组件——等待期渲染 loading 组件（可配）、失败渲染 error 组件（可配）。这个机制的第 17 课续集是路由懒加载：每个页面一个 chunk，正是同一招用在路由上。

**3. Teleport 是"渲染目标重定向"。** 组件树（props、事件、provide/inject、scoped 样式、生命周期归属）在编译与运行时都按**逻辑父子**建立，Teleport 只在挂载那一步把真实 DOM 节点挂到 `to` 选择器命中的容器上。所以 body 下的 toast 依然由 App 的数据驱动、吃 App 的 scoped 样式；卸载时 Vue 也会正确地从 body 下摘掉它。中后台的弹层组件库（第 29 课 Element Plus 的 Dialog）内部全是这一招。

## 作业

**任务**：在你自己的项目上完成 12.1–12.5 全部迭代，然后：

1. 视图偏好持久化：`statView` 写入 localStorage、初始读回（第 8 课菜单的套路）——刷新后停在用户上次选的视图
2. toast 增强：显示时长改 3 秒，且点击 toast 本身立即关闭（`@click="toast = null"`）
3. （选做）对照实验：临时去掉 KeepAlive，确认勾选状态丢失后加回——亲手看一次"销毁"与"失活"的差别
4. （选做）dev 模式 F12 → Network：清空请求列表后点"列表"tab，亲眼确认 StatListView.vue 此刻才加载；再来回切几次，确认**只有第一次**有请求（KeepAlive 缓存的是已加载的组件）

**验收标准**（做完逐项自查）：

- [ ] 卡片/列表 tab 切换正常；打烊时两个视图都蒙灰（透传对动态组件生效）
- [ ] 勾"仅看需关注"→ 切卡片 → 切回列表：勾选保留、表格仍是过滤后的 1 行（KeepAlive）
- [ ] `pnpm build` 后 dist/assets 里能找到 StatListView 独立的 js 文件（异步分包）
- [ ] 点"模拟刷新"：右下角出现 toast；Elements 里 `.toast` 的父元素是 `<body>` 而不是 `#app`
- [ ] 若做选做 4：来回切换只有第一次产生 StatListView 请求
- [ ] `pnpm build` 零错误

## 延伸阅读

- [Vue 官方 · 动态组件与 KeepAlive](https://cn.vuejs.org/guide/components/dynamic.html)
- [Vue 官方 · 异步组件](https://cn.vuejs.org/guide/components/async.html)——loadingComponent / errorComponent / delay 配置
- [Vue 官方 · Teleport](https://cn.vuejs.org/guide/built-ins/teleport.html)
