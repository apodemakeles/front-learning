# 第 9 课：组件基础——props / emit / 插槽【毕业项目迭代 · 模块三收官】

> 所属模块：模块三 · Vue 3 基础（共 5 课）｜ 前置课程：[第 8 课](08-watch-and-side-effects.md) ｜ 预计用时：75–90 分钟
> 参考实现：[project/shop-admin/](../project/shop-admin/)——本课把三课攒出来的 App.vue 拆成组件树

## 本课目标

学完本课你能：

1. 把一个臃肿的单文件组件拆成"状态编排 + 无状态视图"的组件树，说清状态该放在哪
2. 用 `defineProps` 接数据、`defineEmits` 抛事件，遵守单向数据流（props 下行、事件上行）
3. 用默认插槽做"容器型"复用组件，并知道插槽内容的样式与数据归谁管

## 概念讲解

### 9.1 什么时候拆、怎么拆

拆的时机很好判断：一个 `.vue` 文件的 template 长到你找不到想改的那行。我们的 App.vue 到第 8 课已经 318 行——顶栏、菜单、欢迎区、卡片、日志全挤在一起，改任何一块都要在整个文件里上下翻。

拆的原则比时机更重要：

- **视图单元各安其家**：顶栏、侧菜单、统计卡片、日志——每个"视觉上独立、职责单一"的块，独立成一个组件文件
- **状态提升到"够用的最低处"**：菜单数组、激活 id、订单数……这些被多个块共用的状态，放在它们最近的共同祖先（目前就是 App）。子组件**不持有状态**，只负责展示
- **共享类型独立成模块**：`MenuItem` 这种父子的 props 都要用的类型，放 `src/types.ts`（就是第 3 课的普通 ESM 模块，`export interface`）

类比：App 变成了**装配层**——像 Spring 的配置类只做组装与注入，业务逻辑分散到各个 bean；子组件像无状态 bean，数据进（props）、动作上报（emit），自己不拿主意。

拆完的文件结构（本课成品）：

```text
src/
├── App.vue                  ← 166 行：布局 + 全部状态 + 状态的修改函数
├── types.ts                 ← 跨组件共享的类型
└── components/
    ├── AppTopbar.vue        ← props：shopName/today；emit：help
    ├── SideMenu.vue         ← props：items/activeId；emit：select
    ├── StatCards.vue        ← props：cards（纯展示）
    ├── ChangeLogs.vue       ← props：logs（纯展示，内部组合 BasePanel）
    └── BasePanel.vue        ← props：title；插槽装内容（通用容器）
```

### 9.2 props：数据从父到子

```vue
<script setup lang="ts">
// AppTopbar.vue
defineProps<{ shopName: string; today: string }>()
</script>

<template>
  <span class="brand">{{ shopName }} · 管理后台</span>
</template>
```

父组件用普通属性语法传入（`:today="today"`）。两个规矩：

1. **单向数据流**：props 是父组件的财产，子组件**只读不写**。类比方法参数的不可变约定——传进来的引用不该被改。想改？下一条
2. **命名两副面孔**：script 里 camelCase（`shopName`），模板里 kebab-case（`:shop-name="shopName"`）——和 HTML 属性不区分大小写的老规矩妥协，两副脸都是同一个 prop

`defineProps` 是编译器宏：不需要 import，类型参数直接写成 TS 泛型——类型即声明，vue-tsc 会检查父组件传的每个 prop。

### 9.3 emit：动作从子到父

```vue
<script setup lang="ts">
// SideMenu.vue——点击不改数据，"上报"给父组件
const emit = defineEmits<{ select: [id: string] }>()
</script>

<template>
  <a v-for="item in items" :key="item.id" @click="emit('select', item.id)">
</template>
```

```html
<!-- App.vue：$event 是 emit 的第一个参数（第 6 课原生事件的 $event，自定义事件同款） -->
<SideMenu :items="menuItems" :active-id="activeMenuId" @select="activeMenuId = $event" />
```

SideMenu 明明一行 `activeId = item.id` 就能自己切换高亮，为什么要绕一圈 emit？因为**谁拥有状态，谁拥有修改权**：activeMenuId 是 App 的（它还要负责写 localStorage），子组件私自改了，父组件的 watch、持久化、后续的路由跳转全都失控。emit 把"用户点了 X"这个**事实**上报，改不改、怎么改由状态的主人决定。

这就是完整的数据回路：**props 下行（数据）、events 上行（意图）**。类比依赖注入 + 回调接口：props 是构造注入的参数，emit 是你交给对方的回调。第 10 课的 v-model，本质上就是 Vue 把"props 进 + emit 出"这套回路封装成了一个指令——下节课见分晓。

### 9.4 插槽：内容从父到子

props 传的是**数据**，插槽传的是**一块模板**。BasePanel 是通用容器（白卡片 + 标题），但内容它说了不算：

```vue
<!-- BasePanel.vue -->
<template>
  <section class="panel">
    <h2 class="panel-title">{{ title }}</h2>
    <slot />
  </section>
</template>
```

```html
<!-- App.vue：标签之间写的内容，会填进 <slot /> 的位置 -->
<BasePanel title="欢迎回来">
  <p class="date">{{ today }}</p>
  <div class="actions">
    <button class="primary" @click="refreshToday">模拟刷新今日数据</button>
  </div>
</BasePanel>
```

类比 JSP 自定义标签的 body：标签内部写什么由使用方页面决定，标签只负责包壳。

一个容易忽视的规则：**插槽内容编译在父组件的作用域**——`{{ today }}` 取的是 App 的数据，`.date` 的 scoped 样式挂在 App 的 `data-v` 上（哪怕 DOM 最终渲染在 BasePanel 内部）。所以本课拆分后，欢迎区的日期和按钮样式**留在 App.vue**，BasePanel 对内容一无所知。具名插槽（`<slot name="footer">` + `#footer`）本课不展开，第 12 课插槽实战见。

## 动手实操：拆！

以下改动全部实测过（Node 24 / pnpm 11 / Vite 8.2）。步骤顺序有讲究：先建新文件（不破坏现状），最后一步才给 App.vue 瘦身。

### 10.1 抽共享类型：src/types.ts

```ts
export interface MenuItem {
  id: string
  label: string
}

export interface StatCard {
  id: string
  label: string
  value: string
  alert?: boolean // 为 true 时卡片显示"待关注"标签
}

export interface LogEntry {
  id: number
  text: string
}
```

App.vue 里删掉内联的 interface，改成 `import type { LogEntry, MenuItem, StatCard } from './types'`（`import type`：只导类型、编译后消失，不进产物）。

### 10.2 BasePanel：插槽容器

见 9.4 的完整代码。样式（白卡片、标题）从原 `.welcome`/`.logs` 里提炼出来搬进去——**两处重复的卡片壳，一处实现**。

### 10.3 AppTopbar：props + emit

把顶栏的 template + 样式搬过去，script 里声明 props 和 emit（9.2/9.3 的代码）。原来 `@click.prevent="openHelp"` 变成 `@click.prevent="emit('help')"`——.prevent 拦截默认跳转照旧（修饰符跟着事件走，搬进子组件依然生效），但"帮助"具体做什么由 App 决定。

### 10.4 SideMenu：props + emit + v-for 整体搬迁

v-for、`:key`、`:class` 高亮逻辑**原样搬进子组件**——列表怎么渲染是菜单自己的私事，App 只关心"哪项激活"和"用户选了哪项"。

### 10.5 StatCards 与 ChangeLogs：纯展示

StatCards 把 v-for 卡片整体搬走，props 只要 `cards: StatCard[]`。ChangeLogs 搬走日志列表，标题交给 BasePanel——**组件组合组件**，ChangeLogs 的根节点就是 `<BasePanel title="数据变更记录">`。

### 10.6 App.vue 瘦身 + 全量回归

App 的 template 最终只剩组件标签与插槽内容：

```html
<template>
  <div class="layout">
    <AppTopbar :shop-name="shopName" :today="today" @help="openHelp" />

    <div class="body">
      <SideMenu
        :items="menuItems"
        :active-id="activeMenuId"
        @select="activeMenuId = $event"
      />

      <main class="content">
        <BasePanel title="欢迎回来">
          <p class="date">{{ today }}</p>
          <div class="actions">
            <button class="primary" @click="refreshToday">模拟刷新今日数据</button>
            <button @click="greet">打个招呼</button>
          </div>
        </BasePanel>

        <StatCards :cards="statCards" />
        <ChangeLogs v-if="changeLogs.length" :logs="changeLogs" />
      </main>
    </div>
  </div>
</template>
```

布局样式里给 `.content` 加 `display: flex; flex-direction: column; gap: 16px`——块与块的间距由父容器统一管，子组件就不用关心"我在页面里该离别人多远"。

**拆分是重构，行为必须分毫不变。**拿第 6–8 课的验收清单全量回归（实测，逐项通过）：

```text
回归 1（初始）：title="云上拿铁 · 今日 128 单"（watchEffect 立即）
              菜单第 0 项高亮；无日志（watch 懒）；顶栏品牌与"欢迎回来"面板在
回归 2（emit 链）：点"系统设置"→ 高亮跳到第 2 项，localStorage 存入 "settings"
              刷新页面 → 高亮仍在第 2 项
回归 3（日志与标题）：连点 2 次刷新 → 2 条日志（订单 128 → 106 → 100 链条）
              title 同步为"今日 100 单"
回归 4（帮助拦截）：点"帮助" → URL 不变，Console 打出 openHelp 的日志
              （日志来源显示 App.vue——emit 确实回到了父组件的处理函数）
```

行数对账：App.vue 318 → 166 行；新增 5 个组件共 215 行 + types.ts 18 行。总行数变多了——**拆分买的不是行数，是隔离**：以后改菜单不用碰 App，改卡片样式不影响日志。

```bash
pnpm build
```

```text
dist/assets/index-BZCiNUqZ.css   2.19 kB │ gzip:  0.77 kB
dist/assets/index-CpRELpbI.js   66.08 kB │ gzip: 26.45 kB
✓ built in 110ms
```

（JS 64.41 → 66.08 kB：每个组件多出一层定义与 props/emits 声明，正常成本。）

```bash
git add -A && git commit -m "lesson 09: 拆组件——AppTopbar/SideMenu/StatCards/ChangeLogs/BasePanel + types.ts"
```

## 原理深入

**1. 组件即函数，props 即参数，emit 即回调。** 编译后每个 SFC 就是一个返回渲染结果的函数：父模板里的 `<SideMenu :items="menuItems" @select="...">` 本质是"调 SideMenu 这个函数，传 items 参数，注册 select 回调"。插槽是更高阶的参数——传的不是值，是一段"延迟求值的模板"。第 5 课说"组件是可组合的函数单元"，现在这句话的所有零件你都凑齐了。

**2. 单向数据流是为了"修改权唯一"。** 状态像共享变量，多处可写就处处可疑：第 8 课的 watch、localStorage 持久化、第 16 课将加的路由守卫，全都挂在 activeMenuId 的变化上——如果子组件也能改它，排查"高亮怎么变了"就要搜整棵组件树。props 下行、events 上行，把所有修改收敛到状态拥有者的一处代码里，出了问题只看一个文件。这和你把 Service 的字段收敛成 private、只留方法入口是同一种防御。

**3. 插槽内容编译在父作用域。** `{{ today }}`、`.date` 的 scoped 属性（`data-v-xxx`），都是在 App.vue 编译时确定的——插槽分发的是**编译好的 vnode**，不是字符串。所以插槽内容天然拿到父组件的数据与样式，BasePanel 对内容零认知；反过来说，子组件里的私有状态也无法被插槽内容访问（各管各的词法作用域，和闭包一个道理）。

## 作业

**任务**：在你自己的项目上完成 10.1–10.6 全部拆分与回归，然后：

1. 把欢迎区也拆出去：新建 `WelcomeCard.vue`——props 接 `today`，两个按钮的动作用 emit 上抛（`refresh` 和 `greet` 两个事件，App 里接住分别调用 refreshToday/greet），内容容器继续用 BasePanel
2. 菜单加第 4 项"会员管理"（加过就保留）：这次**只改 App 的 menuItems 数组**，SideMenu 一行不动——体会拆分后"加菜单"和"菜单长什么样"已经解耦
3. （选做）F12 → Vue DevTools（没有就装官方扩展）→ Components 面板：点选 SideMenu，右侧面板看它的 props（items/activeId），在页面上点菜单再看 activeId 有没有变（它自己不变，变的是 App 的 activeMenuId——父子各司其职的直观版本）
4. （选做）给 BasePanel 加一个具名插槽 `actions`（面板标题右侧放小按钮用）：`<slot name="actions" />` + 使用处 `#actions`，给"欢迎回来"面板塞一个"查看说明"小按钮

**验收标准**（做完逐项自查）：

- [ ] App.vue 的 template 只有组件标签与插槽内容，没有任何结构性 HTML（header/aside/nav 都不在它里面）
- [ ] 第 6–8 课的验收项全部回归通过（菜单切换、刷新保持高亮、审计日志、标题跟随、帮助拦截）
- [ ] SideMenu.vue 里没有一个 ref/reactive——它完全无状态
- [ ] 新加"会员管理"菜单项时，没有碰过 SideMenu.vue
- [ ] `pnpm build` 零错误
- [ ] DevTools Elements 里 DOM 结构与拆分前一致（header/aside/section 都在，只是改由不同组件渲染）

## 延伸阅读

- [Vue 官方 · 组件基础](https://cn.vuejs.org/guide/essentials/component-basics.html)
- [Vue 官方 · Props](https://cn.vuejs.org/guide/components/props.html)——单向数据流的官方表述
- [Vue 官方 · 组件事件](https://cn.vuejs.org/guide/components/events.html)——defineEmits 的类型写法全表
- [Vue 官方 · 插槽](https://cn.vuejs.org/guide/components/slots.html)——默认/具名插槽；作用域插槽部分第 12 课再啃
