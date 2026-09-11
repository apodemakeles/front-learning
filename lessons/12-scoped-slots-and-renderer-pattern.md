# 第 12 课：插槽实战——作用域插槽与渲染器模式【毕业项目迭代】

> 所属模块：模块四 · Vue 3 进阶编码（共 6 课）｜ 前置课程：[第 11 课](11-dynamic-async-keepalive-teleport.md) ｜ 预计用时：60–75 分钟
> 参考实现：[project/shop-admin/](../project/shop-admin/)——本课写出通用 DataTable 组件（渲染器模式），统计表格与变更记录全部吃上

## 本课目标

学完本课你能：

1. 用作用域插槽让子组件向插槽内容"回传"数据，读懂 `#row="{ row }"` 这类写法
2. 用"渲染器模式"设计通用列表/表格组件：数据归组件、渲染归使用方
3. 用插槽 fallback 给组件的开放点配默认行为，做到"不传也能用"

## 概念讲解

### 12.1 作用域插槽：数据流向的反转

第 9 课的插槽有个没展开的问题：**BasePanel 的插槽内容是静态的**——App 写什么它显示什么，子组件插不上手。但列表场景里，"每一行显示什么"该由使用方定义，而"每一行的数据"在子组件手里（它在遍历数组）。数据得从子组件流回插槽内容——这就是作用域插槽（scoped slot）：

```html
<!-- 子组件：slot 标签上"绑参数"，像在调用一个函数 -->
<tr v-for="(row, index) in rows" :key="rowKey(row)">
  <slot name="row" :row="row" :index="index" />
</tr>
```

```html
<!-- 使用方：#row 的值是一个解构参数的模板，接收子组件回传的数据 -->
<template #row="{ row }">
  <td>{{ row.label }}</td>
  <td>{{ row.value }}</td>
</template>
```

类比：**回调函数的参数**。你把一段渲染代码（回调）交给子组件，子组件在遍历中"调用"它，把 `row`、`index` 当实参传进来。第 9 课说"插槽是组件的高阶参数"——作用域插槽就是这句话的完全体：不只是传一段模板，还带签名。

### 12.2 渲染器模式：数据归组件，渲染归使用方

通用表格组件（以及将来的 Element Plus `el-table`）都是同一个设计：**把所有使用方都需要的部分收进组件，把每个使用方不同的部分留给插槽**。

| 归组件（大家都要，写一次） | 归插槽（每家不同） |
|---|---|
| 行遍历与 `:key` | 表头有哪些列 |
| 空态提示 | 每个单元格显示什么 |
| 表格样式（边框、hover） | 特定列的样式（如红色告警） |
| 将来：loading 态、分页（第 20、26 课） | 操作列放什么按钮（第 25 课） |

这就是模板方法模式的声明式版本：骨架（遍历/空态/样式）固定在组件里，变化点（单元格）通过插槽注入。本课写出 `DataTable.vue`，然后把统计表格换成它——你会发现表格的"通用部分"从业务代码里彻底消失了。

### 12.3 具名插槽进阶与 fallback

三个补遗，一次说清：

1. **缩写与全称**：`#row` 是 `v-slot:row` 的缩写；跟 v-on 的 `@`、v-bind 的 `:` 一个套路。`#default` 是默认插槽的名字
2. **fallback（默认内容）**：`<slot>` 标签之间写的内容，使用方不传该插槽时生效——组件的开放点自带出厂设置：

```html
<li v-for="log in logs" :key="log.id">
  <slot name="row" :log="log">{{ log.text }}</slot>
</li>
```

使用方不写 `#row`，就是纯文本日志（现状不变）；写了，行渲染立即换皮肤——**不传也能用，传了更灵活**，组件开放接口的礼貌

3. **动态插槽名**（`#[dynamicName]`）：低频，知道存在即可，用到查文档

### 12.4 一个提前亮相的语法：泛型组件

DataTable 要接受"任意类型的行数组"，靠 `<script setup generic="T">`：

```ts
generic = 'T'
defineProps<{ rows: T[]; rowKey: (row: T) => string | number }>()
```

`T` 由使用方传入 `rows` 的那一刻确定（统计表格里 T = StatCard，日志里 T = LogEntry），插槽回传的 `row` 自动就是那个类型——**在插槽里写错字段名，构建期就报错**（一会实测给你看）。泛型组件全貌是第 14 课的主菜，本课照抄这一行、先享受类型联动。

## 动手实操

### 13.1 DataTable：渲染器模式本体

新建 `src/components/DataTable.vue`：

```vue
<script setup lang="ts" generic="T">
// 通用表格组件（渲染器模式）：所有使用方都一样的部分归这里——
// 行遍历、:key、空态、表格样式；每个使用方不同的部分（表头/单元格内容）
// 留给插槽：#head 写表头，#row 作用域插槽写单元格（row/index 由本组件回传）
defineProps<{
  rows: T[]
  rowKey: (row: T) => string | number
  emptyText?: string
}>()
</script>

<template>
  <table class="data-table">
    <thead>
      <tr>
        <slot name="head" />
      </tr>
    </thead>
    <tbody>
      <template v-if="rows.length === 0">
        <tr class="empty-row">
          <td>{{ emptyText ?? '暂无数据' }}</td>
        </tr>
      </template>
      <template v-else>
        <tr v-for="(row, index) in rows" :key="rowKey(row)">
          <slot name="row" :row="row" :index="index" />
        </tr>
      </template>
    </tbody>
  </table>
</template>
```

样式（全宽、行分隔线、行 hover、空态居中）见[参考实现](../project/shop-admin/src/components/DataTable.vue)。三个设计决定值得咀嚼：

- `rowKey` 是**函数**（`card => card.id`）而不是字段名字符串——组件不假设你的数据结构，第 6 课的 :key 纪律由使用方履行
- 空态用 `<template v-if>` / `v-else` 包裹两组 `<tr>`——不让 v-if 和 v-for 挤在同一个元素上（第 6 课坏味道）
- 表头也开了插槽（`#head`）：列名、列宽、对齐都是使用方的事

### 13.2 统计表格换用 DataTable

StatListView 里手写的 `<table>` 整段删除，换成：

```html
<DataTable :rows="shownCards" :row-key="card => card.id">
  <template #head>
    <th>指标</th>
    <th>数值</th>
    <th>状态</th>
  </template>
  <template #row="{ row }">
    <td>{{ row.label }}</td>
    <td>{{ row.value }}</td>
    <td :class="{ warn: row.alert }">{{ row.alert ? '需关注' : '—' }}</td>
  </template>
</DataTable>
```

原来 30 行的表格模板变成 12 行"列声明"。**类型联动的实测证据**——在 `#row` 里故意把 `row.value` 写成 `row.pricex`，`pnpm build` 当场翻脸：

```text
src/components/StatListView.vue(29,20): error TS2339: Property 'pricex' does not exist on type 'StatCard'.
```

改回后构建通过。插槽里的 `row` 不是 `any`——它通过 `generic="T"` 与传入的 `shownCards`（StatCard[]）绑定了类型。

### 13.3 ChangeLogs：开放行渲染，默认行为不变

ChangeLogs 的 `<li>` 里套一个带 fallback 的作用域插槽（完整代码见参考实现）：

```html
<li v-for="log in logs" :key="log.id">
  <slot name="row" :log="log">{{ log.text }}</slot>
</li>
```

**App.vue 一行不改**——不传 `#row` 就走 fallback，日志还是那行纯文本。这是"重构不改变行为"的又一次实践：开放接口的最好证明，是不用它的使用方毫无感知。

### 13.4 空态实测

DataTable 的空态要亲眼看到：列表视图勾上"仅看需关注"后连点"模拟刷新"，直到刷出"0 件"（无待关注行）——过滤结果为空数组，实测：

```text
勾选状态        checked: true
空态行          "暂无数据"（.data-table .empty-row td）
数据行数量      0
```

空态是每个列表组件的必修课——真实的商品列表（第 25 课）一定有"查无结果"的时候，没有空态的表格会渲染出一个光秃秃的表头，用户不知道是坏了还是没数据。

### 13.5 回归 + 构建 + git

老三样照常（实测通过）：菜单切换、打烊蒙灰、主题换色；KeepAlive 依然生效——切走列表视图再切回，勾选与过滤结果原样保留（这次回归顺带证明：**换皮 DataTable 没有伤到第 11 课的缓存机制**）。

```bash
pnpm build
```

```text
dist/assets/StatListView-RRxU08ka.js    1.35 kB │ gzip:  0.80 kB   ← 比上课多 0.5 kB：DataTable 进了列表视图的异步包
dist/assets/index-n19-jpwD.js          78.98 kB │ gzip: 31.70 kB
✓ built in 80ms
```

```bash
git add -A && git commit -m "lesson 12: DataTable 渲染器模式 + 作用域插槽 + fallback"
```

## 原理深入

**1. 作用域插槽编译成真正的回调函数。** "类比回调"不是修辞——把使用方的模板编译给你看（`vue/compiler-sfc` 实测）：

```js
// <template #row="{ row }"><td>{{ row.label }}</td></template> 的编译产物
row: _withCtx(({ row }) => [
  _createElementVNode("td", null, _toDisplayString(row.label), 1 /* TEXT */)
])
```

`#row` 模板变成了一个**以 `{ row }` 为参数的函数**，挂在组件的 slots 对象上；子组件渲染到 `<slot name="row" :row="row">` 时，就是拿着 `{ row, index }` 调用这个函数。所以类型能从使用方一路流进插槽内容——函数签名本来就该有类型。

**2. fallback 是"插槽缺席检查"。** slot 渲染时先查 `$slots` 里有没有对应名字的插槽：有，调用使用方的函数；没有，渲染 `<slot>` 标签之间预留的默认 vnode。所以 ChangeLogs 不传 `#row` 走默认文本，传了走自定义——同一次渲染里两类使用方可以并存，互不影响。

**3. 渲染器模式的分界线会随课程移动。** 本课 DataTable 收编了遍历、key、空态；第 20 课会加 loading 态（请求进行中表格灰掉）；第 26 课加分页；第 25 课你会发现 Element Plus 的 `el-table` + `el-table-column` 正是这个模式的工业级版本——`<el-table-column>` 组件本身就是"一格渲染器"的声明式外衣。现在自己写一遍的意义：用 EP 时你清楚每层抽象在替你做什么、报错该去哪层找。

## 作业

**任务**：在你自己的项目上完成 13.1–13.5 全部迭代，然后：

1. 给 DataTable 加 `loading?: boolean` prop：true 时 tbody 只渲染一行"加载中…"（空态的同款写法）——第 20 课接入请求后它就是真主角
2. ChangeLogs 传 `#row` 自定义渲染：时间部分（`[HH:MM:SS]`）显示为灰色，变化内容保持默认色——slot 内容编译在父作用域（App），样式直接写在 App 的 scoped 里
3. （选做）统计表格加"序号"列：`#row` 解构里把 `index` 也用上（`{{ index + 1 }}`）
4. （选做）亲手做一次 13.2 的负例实验：把 `row.label` 改成 `row.labelx`，跑 `pnpm build` 看报错，再改回

**验收标准**（做完逐项自查）：

- [ ] 列表视图表格由 DataTable 渲染：三列、行 hover 变色、"需关注"仍是红色
- [ ] 数据变更记录的显示与上节课**完全一致**（App 没传 #row，fallback 生效）
- [ ] 勾"仅看需关注"且无待关注行时，表格显示"暂无数据"
- [ ] 切走列表视图再切回，勾选与过滤结果保留（KeepAlive 未被重构破坏）
- [ ] 若做选做 4：看到了 TS2339 报错并成功改回，构建恢复零错误
- [ ] `pnpm build` 零错误

## 延伸阅读

- [Vue 官方 · 插槽（含作用域插槽）](https://cn.vuejs.org/guide/components/slots.html)——"作用域插槽"一节与本课 12.1 对读
- [Vue 官方 · 泛型组件](https://cn.vuejs.org/api/sfc-script-setup.html#generics-using-generic-type-parameters)——本课只用了最小集，第 14 课展开
