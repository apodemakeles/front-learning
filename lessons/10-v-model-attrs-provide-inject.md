# 第 10 课：v-model 与 defineModel、透传、provide/inject【毕业项目迭代】

> 所属模块：模块四 · Vue 3 进阶编码（共 6 课）｜ 前置课程：[第 9 课](09-component-basics.md) ｜ 预计用时：60–75 分钟
> 参考实现：[project/shop-admin/](../project/shop-admin/)——本课加营业状态开关（v-model）、打烊联动（透传）、主题色注入（provide/inject）

## 本课目标

学完本课你能：

1. 说清 v-model 的本质（props 进 + emit 出的回路封装），用 `defineModel` 写出支持 v-model 的组件
2. 掌握 attribute 透传：class / 事件 / 任意属性如何"穿过"组件落到根元素，多根组件怎么办
3. 用 provide / inject 做跨层级注入（`InjectionKey` 类型安全），并知道它与 props 的取舍边界

## 概念讲解

### 10.1 v-model 的解剖：兑现第 9 课的钩子

第 9 课结尾说过：v-model 就是"props 进 + emit 出"这套回路的封装。现在兑现。

**表单元素上**（第 6 课一瞥的完整版）：

```html
<input v-model="keyword" />
<!-- 等价于 -->
<input :value="keyword" @input="keyword = $event.target.value" />
```

**组件上**，同样的回路换个名字：

```html
<ShopSwitch v-model="shopOpen" />
<!-- 等价于 -->
<ShopSwitch :model-value="shopOpen" @update:model-value="shopOpen = $event" />
```

`v-model` 拆开就是两个绑定：一个叫 `modelValue` 的 prop 向下传，一个叫 `update:modelValue` 的事件向上抛。你在第 9 课手写过 SideMenu 的 select 回路——一模一样的结构，Vue 给它起了个短名字。

### 10.2 defineModel：v-model 组件的现代写法

Vue 3.4 起（截至 2026-09 已稳定两年多），组件声明 v-model 支持只需一行：

```vue
<script setup lang="ts">
// ShopSwitch.vue
const open = defineModel<boolean>()
</script>

<template>
  <button class="switch" :class="{ on: open }" @click="open = !open">
    {{ open ? '营业中' : '已打烊' }}
  </button>
</template>
```

`open` 用起来就是一个 ref：模板里读、表达式里赋值。区别在于它的**读取来自父组件的 props，赋值自动变成 emit**——第 9 课的回路代码一行都不用写。

什么时候用 v-model、什么时候手写 emit？看语义：

- **值本身的双向同步**（开关的开/关、输入框的内容）→ v-model
- **意图通知**（"用户选了菜单 X"，改不改、怎么改父组件说了算）→ emit

SideMenu 的 `select` 是意图（父组件还要联动持久化和将来的路由），ShopSwitch 的 `open` 是值——两课的写法差异不是风格，是语义。

顺带认识**命名 v-model**：`v-model:title="pageTitle"` 对应 `title` prop + `update:title` 事件，一个组件可以挂多个。用到再查文档即可。

### 10.3 透传：未声明的属性自动"穿过"组件

父组件在标签上写的东西，凡是子组件**没有声明为 props** 的（class、style、事件监听、任意属性），都不会消失——它们被收进 `$attrs`，自动绑定到**单根组件的根元素**上：

```html
<!-- StatCards 的 props 里只有 cards，class 不是 props -->
<StatCards :cards="statCards" :class="{ dimmed: !shopOpen }" />

<!-- 渲染结果：dimmed 落到了它的根元素 section 上 -->
<section class="cards dimmed">…</section>
```

类比装饰器模式：包装层把没处理的参数原样转发给被包装的对象。`@click` 这类事件监听同样透传——你在组件标签上写的 `@click` 会落到根元素上（除非组件内部已经处理）。

两条边界规则：

1. **多根组件不自动透传**——模板有两个根节点时 Vue 不知道该给谁，必须显式写 `v-bind="$attrs"` 指定
2. 组件可以用 `defineOptions({ inheritAttrs: false })` 关闭自动透传（常见于"属性应该给内部某个元素而不是根元素"的场景），然后用 `v-bind="$attrs"` 手动转发到目标位置

### 10.4 provide / inject：跨层级注入

props 是逐层传递的：App → ChangeLogs → BasePanel。如果数据要穿三层以上、中间层完全不用它，逐层转发就是纯体力活（术语叫 prop drilling）。provide/inject 让数据"越过"中间层：

```ts
// App.vue（提供方）
import { provide, reactive } from 'vue'
import { THEME_KEY } from './types'   // InjectionKey

const theme = reactive({ primary: '#1652f0' })
provide(THEME_KEY, theme)
```

```ts
// BasePanel.vue（消费方——不管隔了几层）
const theme = inject(THEME_KEY, { primary: '#1652f0' })  // 第二参数：默认值
```

三个要点：

1. **InjectionKey 类型安全**：`THEME_KEY` 是 `Symbol` + 泛型的组合（定义在 types.ts）。用字符串当 key 的话 inject 拿到的是 `unknown`；用 InjectionKey，inject 的返回类型自动是 `ShopTheme`
2. **默认值**：inject 第二参数——组件脱离这个应用单独使用（比如抄到别的项目）也不崩，库组件的基本礼貌
3. **提供响应式对象**：provide 出去的是 `reactive` 对象的引用，改 `theme.primary`，所有 inject 的组件同步更新——注入不是"拷贝一次"，是"共享同一个"

类比：Spring 的 ApplicationContext——组件不逐层要依赖，从容器里按类型取；代价也一样：**依赖关系从构造参数里消失了**，光看 BasePanel 的代码不知道 theme 从哪来。所以取舍规则：两层以内用 props（显式可读）；跨多层且中间层不关心，才用 inject。

## 动手实操

### 11.1 ShopSwitch：v-model 开关 + 打烊联动

新组件 `src/components/ShopSwitch.vue`（见 10.2 完整代码）。App 里接入状态——持久化与菜单同一个套路，标题联动顺手让 watchEffect 多收一个依赖：

```ts
const shopOpen = ref(localStorage.getItem('shop-admin:open') !== '0')

watch(shopOpen, (open) => {
  localStorage.setItem('shop-admin:open', open ? '1' : '0')
})

watchEffect(() => {
  document.title = `云上拿铁 · 今日 ${orderCount.value} 单${shopOpen.value ? '' : ' · 已打烊'}`
})
```

欢迎区的按钮组最前面放上开关：

```html
<div class="actions">
  <ShopSwitch v-model="shopOpen" />
  <button class="primary" :disabled="!shopOpen" @click="refreshToday">模拟刷新今日数据</button>
  <button :style="{ color: theme.primary, borderColor: theme.primary }" @click="greet">打个招呼</button>
</div>
```

### 11.2 打烊的界面联动：透传 class

打烊时统计卡片"蒙灰"，但**不改 StatCards 一行代码**——用透传：

```html
<StatCards :cards="statCards" :class="{ dimmed: !shopOpen }" />
```

样式写在 App.vue 的 scoped 里（子组件的根节点同时受父组件 scoped 样式影响——第 9 课"插槽内容归父"原理的孪生条款）：

```css
.dimmed {
  opacity: 0.45;
  filter: grayscale(1);
}
```

实测（点击开关的一瞬间，五处同时变）：

```text
标题        云上拿铁 · 今日 128 单        → 云上拿铁 · 今日 128 单 · 已打烊
开关文案    营业中（class "switch on"）    → 已打烊
卡片根元素  class "cards"                 → class "cards dimmed"（透传落位）
刷新按钮    可点                          → disabled
localStorage  （无此键）                   → shop-admin:open = "0"
```

刷新页面——打烊状态原样恢复（持久化生效）。

### 11.3 主题色注入：provide / inject 全链路

types.ts 加类型与注入键：

```ts
import type { InjectionKey } from 'vue'

export interface ShopTheme {
  primary: string
}

export const THEME_KEY: InjectionKey<ShopTheme> = Symbol('shop-theme')
```

App 提供主题 + 换色圆点（换色就是改 `theme.primary`，一个赋值）：

```ts
const theme = reactive({ primary: '#1652f0' })
provide(THEME_KEY, theme)
```

```html
<div class="theme-picker">
  主题：
  <button
    v-for="c in ['#1652f0', '#722ed1', '#fa8c16']"
    :key="c"
    class="dot"
    :style="{ background: c }"
    @click="theme.primary = c"
  />
</div>
```

BasePanel 消费（第 9 课的文件只加两行）：

```ts
const theme = inject(THEME_KEY, { primary: '#1652f0' })
```

```html
<h2 class="panel-title" :style="{ color: theme.primary }">{{ title }}</h2>
```

注意注入路径：theme 从 App 直接到达 BasePanel，**中间的 ChangeLogs 不转发也不知情**。App 自己要变色则不走 inject——它就是 provider，直接用 `theme.primary`（两个按钮的 `:style` 都绑了它）。

实测点紫色圆点（#722ed1）：面板标题、主按钮背景、ghost 按钮描边**同时**变成 `rgb(114, 46, 209)`——inject 拿到的是同一个 reactive 对象，改一处、全员联动。

### 11.4 回归 + 构建

第 9 课的老三样照常（实测通过）：点"商品管理"高亮跳位、模拟刷新出日志、打烊→恢复营业后刷新按钮恢复可用。

```bash
pnpm build
```

```text
dist/assets/index-BEBtZ0Oe.css   2.84 kB │ gzip:  0.95 kB
dist/assets/index-Zorj7PkB.js   68.10 kB │ gzip: 27.25 kB
✓ built in 153ms
```

```bash
git add -A && git commit -m "lesson 10: ShopSwitch(v-model) + 透传 dimmed + 主题 provide/inject"
```

## 原理深入

**1. defineModel 是编译期宏。** `const open = defineModel<boolean>()` 在编译时展开成"props 声明 + 本地代理 ref"：读 `open` 返回 `props.modelValue`；写 `open = !open` 自动触发 `emit('update:modelValue', 值)`。等价的手写回路长这样（Vue 3.3 及以前的标准写法，读存量代码会遇到）：

```ts
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
// 模板里 :class 绑 props.modelValue，@click 里 emit('update:modelValue', !props.modelValue)
```

**2. $attrs 是"未声明属性"的收纳箱。** class、style、事件监听、任何没被 props 声明的属性都收在这里。单根组件在渲染时自动 `v-bind="$attrs"` 到根节点；class 和 style 特殊——它们与根元素自带的**合并**而不是覆盖（`class="cards"` + 透传 `dimmed` → `class="cards dimmed"`）。多根模板没有"默认落点"，必须手工 `v-bind="$attrs"` 指定，否则 Vue 会在控制台警告。

**3. inject 的查找像原型链。** 组件树里每个 provider 是一环，inject 沿父链**向上**找到最近的一个同名 key 就停——所以"局部覆盖全局"天然成立：某子树自己 provide 一个 THEME_KEY，该子树内的组件拿到的是局部值，子树外不受影响。inject 拿到的是 provider 传出的那个引用（不是拷贝）：reactive 对象改属性全员联动；如果 provide 的是个普通值（比如字符串），inject 方就不会更新——要联动就 provide ref/reactive，这在写全局配置（主题、当前登录人）时是高频决定。

## 作业

**任务**：在你自己的项目上完成 11.1–11.4 全部迭代，然后：

1. SideMenu 也成为主题消费者：注入 THEME_KEY，把激活菜单项的颜色从写死的 `#1652f0` 改成 `:style` 绑 `theme.primary`（改动只应在 SideMenu.vue 内部，App 不动——注入的价值再体验一次）
2. 主题色加第四个圆点（颜色自选），确认 SideMenu 激活色同步变化
3. （选做）透传实验：给 `<BasePanel title="欢迎回来" data-testid="panel-welcome">`，F12 Elements 确认 `data-testid` 落在了 panel 的根元素上
4. （选做）装 Vue DevTools 扩展 → Components 面板选中 App → 找到 theme 状态直接改 `primary` 的值——页面即时变色（inject 与 provider 共享同一响应式对象的直观证据）

**验收标准**（做完逐项自查）：

- [ ] 点开关：文案/颜色、标题"已打烊"后缀、卡片蒙灰、刷新按钮禁用**同时**发生
- [ ] 打烊后刷新页面，打烊状态与蒙灰保持（localStorage 持久化）
- [ ] 切主题色：面板标题、两个按钮、SideMenu 激活项同时变色
- [ ] 打烊时 Elements 里能看到 StatCards 根元素 class 为 `cards dimmed`
- [ ] `pnpm build` 零错误

## 延伸阅读

- [Vue 官方 · 组件上的 v-model](https://cn.vuejs.org/guide/components/v-model.html)——defineModel 与命名 v-model 全表
- [Vue 官方 · 透传 Attributes](https://cn.vuejs.org/guide/components/attrs.html)——$attrs 的边界与 inheritAttrs
- [Vue 官方 · 依赖注入（Provide / Inject）](https://cn.vuejs.org/guide/components/provide-inject.html)——含"使用 Reactivity 保持响应性"一节
