# 第 6 课：模板语法细节——绑定、条件、列表与 key【毕业项目迭代】

> 所属模块：模块三 · Vue 3 基础（共 5 课）｜ 前置课程：[第 5 课](05-first-vue-component-and-sfc.md) ｜ 预计用时：60–75 分钟
> 参考实现：[project/shop-admin/](../project/shop-admin/)——本课完成"菜单与统计卡片数据化"迭代，先自己写，再对照 diff

## 本课目标

学完本课你能：

1. 用 `v-for` + `:key` 把重复模板消除成"一个数组 + 一段模板"，并说清 `:key` 为什么不该用数组下标
2. 用 `:class` / `:style` 的对象语法写条件样式，用事件修饰符（`.prevent` 等）声明式拦下默认行为
3. 按切换频率在 `v-if` 与 `v-show` 之间做取舍，并能在 DevTools 里亲眼验证两者的 DOM 差异

## 概念讲解

### 6.1 v-bind 全貌：class 与 style 才是主战场

第 5 课你用 `:title` 绑过一个普通属性。`v-bind`（缩写 `:`）能绑一切 HTML 属性——但日常用得最多的是 **class** 和 **style**：界面状态（高亮、报错、禁用）最终几乎都落到"某个 class 挂不挂上"。

**class 对象语法**（最高频）：

```html
<a :class="{ active: item.id === activeMenuId }">经营看板</a>
```

对象里每个键是一个 class 名，值是布尔表达式——真就挂、假就不挂。你用命令式 JS 写过等价物，一比就明白它替代的是什么：

```js
el.className = item.id === activeMenuId ? 'active' : ''
```

三行拼字符串的活儿，声明式一行搞定，还不会漏。**数组语法**写法少见但要能读懂（同时挂多个，某项按条件）：

```html
<div :class="['card', card.alert ? 'alert' : '']">
```

**style 对象语法**（CSS 属性名用 camelCase）：

```html
<p :style="{ color: card.alert ? '#f53f3f' : '#4e5969' }">3 件</p>
```

两条惯例：永远存在的 class 直接写静态 `class="card"`，动态部分才进 `:class`——两者可共存，Vue 自动合并；布尔类属性绑 `null` / `false` 时整个属性会被移除（`:disabled="false"` 渲染出来就没有 disabled 属性），和 JSTL 的条件输出一个道理。

### 6.2 v-on 细节：$event 与修饰符

`@click="greet"` 是无参绑定，处理函数第一个参数就是原生 event 对象。要传自己的参数就得写成调用式，此时原生事件用 `$event` 占位——相当于在方法签名里手工声明 `HttpServletRequest` 参数，要才拿，不要不碰：

```html
<button @click="say('hi', $event)">打招呼</button>
```

**修饰符**是本课主角：`@click.prevent="openHelp"` 的意思是"触发时先 `preventDefault()`，再调 openHelp"。它把"拦掉默认行为"这种横切需求从业务代码里抽出来，声明在模板上——和 Servlet Filter 不动业务方法、在调用链上插一层是同一个思路。

常用清单（不用背，用到回来查）：

| 修饰符 | 等价的 DOM 调用 | 典型场景 |
|---|---|---|
| `.prevent` | `event.preventDefault()` | 拦下 `<a>` 跳转、表单提交改走 JS |
| `.stop` | `event.stopPropagation()` | 事件不再冒泡到父元素 |
| `.once` | 触发一次后自动解绑 | 只允许点一次的按钮 |
| `.self` | 事件目标是元素自身才触发 | 忽略子元素冒泡上来的点击 |
| `.enter` `.esc` `.delete` | 键盘修饰符（`@keyup.enter`） | 回车提交、Esc 关弹窗 |

可以连用，按书写顺序执行：`@click.stop.prevent`。

### 6.3 v-if 家族 vs v-show：两种"藏起来"

条件渲染两条路，语义都是"按条件决定显不显示"，实现完全不同：

```html
<p v-if="order.pending > 0">你有待处理订单</p>
<p v-else-if="order.failed">有失败订单</p>
<p v-else>一切正常</p>

<p v-show="debugMode">调试信息</p>
```

- `v-if` 是**真渲染 / 真销毁**：条件假时元素根本不进 DOM；假变真才创建，真变假就地销毁（元素内部状态、组件一并回收）。初始为假时零成本，切换成本高。像懒加载：用到才实例化。
- `v-show` 是**先渲染再遮住**：无论真假元素都进 DOM，假时挂 `display: none`。初始就付一次创建成本，之后切换只是改 CSS，近乎免费。像提前实例化好、先藏起来的单例。

取舍口诀：**频繁切换用 v-show；条件很少翻转、或初始大概率是假的（比如错误提示）用 v-if；拿不准就用 v-if**。7.4 你会在 DevTools 里亲眼看到两者的差别。

### 6.4 v-for 与 :key：diff 的身份证

```html
<a v-for="item in menuItems" :key="item.id" :class="{ active: item.id === activeMenuId }">
  {{ item.label }}
</a>
```

`v-for` 遍历数组渲染一段模板（要下标写 `(item, index) in items`；也能遍历对象 `(value, key) in obj`，遇到再说），是模板里消除重复的主武器——第 5 课三条菜单、三张卡片的手工复制，本课全部靠它清掉。

`:key` 是 v-for 的**身份牌**：给每项一个稳定唯一的标识。为什么需要它（原理深入第 1 条展开）：

> 数据变了，Vue 不重建整个列表，而是 diff：新旧两份列表**按 key 配对**，配上的复用原有 DOM 只改差异，配不上的才创建/删除。key 就是"这一项还是原来那一项"的证据——数据库按主键认领记录，不按行号。

所以规则只有一条：**key 用数据里的稳定 id，不要用数组下标 index**。往头部插一项，所有下标整体错位，diff 会当成"每一行都换人了"：DOM 文本能改对，但元素**内部状态**（输入框里已打的字、视频进度）会跟着错行。存量项目里 `:key="index"` 很常见——现在你知道为什么新代码不该跟着抄。

另一个高频坏味道：`v-if` 和 `v-for` 写在同一个元素上（v-for 优先级更高，语义拧巴，官方风格指南明确不推荐）。"只渲染满足条件的项"应该用 computed 先把数组算好——第 7 课讲完响应式你就有了。

### 6.5 v-model 一瞥

`<input v-model="keyword">` 是 `:value="keyword"` + `@input="keyword = $event.target.value"` 的语法糖。它要转起来，`keyword` 必须是**响应式变量**——那正是下一课的主角。所以本课只认脸不实操，表单场景第 27 课专题实战。

## 动手实操：消除第 5 课的重复

以下改动全部在 `src/App.vue` 内完成，与[参考实现](../project/shop-admin/src/App.vue)一致，全部实测过（Node 24 / pnpm 11 / Vite 8.2）。

### 7.1 菜单数据化：v-for + :class

script 里加菜单数据，顺手把类型标上——第 4 课的接口类型派上用场：

```ts
interface MenuItem {
  id: string
  label: string
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: '经营看板' },
  { id: 'products', label: '商品管理' },
  { id: 'settings', label: '系统设置' },
]

// 当前激活的菜单项 id。普通常量，改它页面不会变——点击切换高亮等第 7 课的响应式
const activeMenuId = 'dashboard'
```

template 里三个写死的 `<a>` 换成一个：

```html
<nav>
  <a
    v-for="item in menuItems"
    :key="item.id"
    :class="{ active: item.id === activeMenuId }"
  >
    {{ item.label }}
  </a>
</nav>
```

dev 还开着的话，保存即热更新。页面外观与第 5 课**一模一样**——渲染出来的 DOM 也一样（实测拷贝，略去了 scoped 的 `data-v-*` 属性）：

```html
<a class="active">经营看板</a><a class="">商品管理</a><a class="">系统设置</a>
```

注意"经营看板"挂上了 `active`，其余两项是空 `class=""`——对象语法按布尔逐项决定挂不挂。此后加第四个菜单，**只改 menuItems 数组，模板一行不动**。

### 7.2 统计卡片数据化：v-for + v-if

script 里再加：

```ts
interface StatCard {
  id: string
  label: string
  value: string
  alert?: boolean // 为 true 时卡片显示"待关注"标签（v-if 的判断条件）
}

const statCards: StatCard[] = [
  { id: 'orders', label: '今日订单', value: '128 单' },
  { id: 'revenue', label: '今日营业额', value: '¥3,680' },
  { id: 'todos', label: '待处理事项', value: '3 件', alert: true },
]
```

三张卡片的 div 换成：

```html
<section class="cards">
  <div v-for="card in statCards" :key="card.id" class="card">
    <p class="label">
      {{ card.label }}
      <span v-if="card.alert" class="badge">待关注</span>
    </p>
    <p class="value">{{ card.value }}</p>
  </div>
</section>
```

样式里补一个红色小标签 `.badge`（完整样式见参考实现）。实测渲染出的卡片标签：

```html
<p class="label">今日订单 <!--v-if--></p>   ← alert 没传（undefined，为假）：标签不存在
<p class="label">待处理事项 <span class="badge">待关注</span></p>
```

`v-if` 为假的元素在 DOM 里只留一个 `<!--v-if-->` 占位注释——记住这个细节，7.4 马上拿它对比 v-show。

### 7.3 事件修饰符：拦下一个链接

顶栏"店长"旁边加一个帮助链接：`href` 指向外部地址，但 `@click.prevent` 拦下默认跳转：

```html
<a href="https://example.com/help" @click.prevent="openHelp">帮助</a>
```

```ts
// 帮助链接的事件处理：.prevent 拦下 <a> 的默认跳转后走这里（SPA 内部动作代替整页跳转）
function openHelp() {
  console.log('打开帮助中心（本课先打个日志，页面跳转等路由课）')
}
```

实测（点击"帮助"后）：地址栏仍停在 `http://localhost:5173/`，Console 面板输出：

```text
[LOG] 打开帮助中心（本课先打个日志，页面跳转等路由课）
```

SPA 里"看起来是链接"的元素，十有八九这么写——真跳页是路由的事，第 13 课。

### 7.4 三分钟实验：v-if 与 v-show 的 DOM 对比

欢迎卡里**临时**加两行（观察完就删）：

```html
<p v-if="false">实验A：v-if=false，我应该在 DOM 里不存在</p>
<p v-show="false">实验B：v-show=false，我应该在 DOM 里但 display:none</p>
```

F12 → Elements，定位到欢迎卡区域。实测的 DOM：

```html
<!--v-if-->                                          ← 实验A：只剩占位注释，元素不存在
<p style="display: none;">实验B：v-show=false，我应该在 DOM 里但 display:none</p>
```

对照 6.3 的结论：v-if 为假时元素压根不渲染；v-show 渲染了、被 CSS 藏起来。看完把两行删掉。

### 7.5 构建验证 + git

```bash
pnpm build
```

实测输出（对比第 5 课：JS 61.57 → 63.00 kB，v-for 渲染逻辑进来了；CSS 1.60 → 1.93 kB，badge 样式）：

```text
✓ 14 modules transformed.
dist/index.html                  0.47 kB │ gzip:  0.37 kB
dist/assets/index-0RayWvM0.css   1.93 kB │ gzip:  0.65 kB
dist/assets/index-BhsHzt_b.js   63.00 kB │ gzip: 25.25 kB
✓ built in 66ms
```

```bash
git add -A && git commit -m "lesson 06: 菜单与卡片数据化（v-for/:key/class 绑定/事件修饰符/v-if）"
```

## 原理深入

**1. key = diff 的身份证。** 列表数据变化时，Vue 对新旧两组"虚拟节点"做 diff——类比增量计算：只算变化的部分，不全量重算。带 key 的列表 diff 是**按身份配对**：新列表里 key 为 `todos` 的项，和旧列表里同 key 的项对上号，就复用那项的 DOM、只打文字等差异的补丁；对不上号的才创建或删除。这就是"数据库按主键认领、不按行号"的含义。index 作 key 为什么错——往头部插一项，后面所有项下标全体加一，diff 认为"每一行都换人了"，全部错位复用：DOM 文本会被改对，但元素**内部状态**（输入框已打的字、视频播放进度）跟着错行。可以验证 key 没有被丢弃：模板编译产物里，`:key` 原样进了渲染函数——

```js
_renderList(_ctx.menuItems, (item) => {
  return (_openBlock(), _createElementBlock("a", {
    key: item.id,
    class: _normalizeClass({ active: item.id === _ctx.activeMenuId })
  }, ...))
}, 128 /* KEYED_FRAGMENT */)
```

**2. v-if 与 v-show 是两本账。** v-if 为假时跳过渲染，真变假时销毁——元素内的组件状态、事件监听一并回收（类比 bean 销毁，清理回调全跑一遍）；v-show 初始就把元素建好，切换只是 `style.display` 开关，但**初始就付全部创建成本**，哪怕条件永远为假。账要这么算：切换频繁 → 每次销毁重建太贵 → v-show；条件很少翻转或初始大概率假 → 不为看不见的东西付创建成本 → v-if。

**3. 修饰符是编译期语法糖，不是运行时魔法。** `@click.prevent="openHelp"` 编译成"把你的处理器包了一层"的函数（实测编译产物）：

```js
onClick: _withModifiers((...args) => (_ctx.openHelp && _ctx.openHelp(...args)), ["prevent"])
```

`_withModifiers(fn, ["prevent"])` 干的事：先执行 `$event.preventDefault()`，再调你的 `fn`。`.stop`、`.once` 同理，都在编译期展开成对应的包装——模板里一个后缀，等价于函数体开头一行 DOM 调用，但不污染业务逻辑。

（想自己看编译产物：上面两段来自用 `vue/compiler-sfc` 的 `compileTemplate` 编译本项目 App.vue——它随 `vue` 包自带，`import { parse, compileTemplate } from 'vue/compiler-sfc'` 就能玩。）

## 作业

**任务**：在你自己的毕业项目上完成 7.1–7.5 全部迭代，然后：

1. 菜单数组加第 4 项 `{ id: 'members', label: '会员管理' }`——体验"只改数据、不动模板"
2. 给 `StatCard` 加 `trend: 'up' | 'down' | 'flat'` 字段，用 `:class` 或 `:style` 让涨的数值显绿、跌的显红（颜色自己定，flat 保持默认色）
3. （选做）把"打个招呼"按钮改成 `@click.once`，验证点过一次后再点毫无反应

**验收标准**（做完逐项自查）：

- [ ] 菜单显示 4 项且第一项高亮；template 里只有一个 `<a>`（v-for），没有任何写死的菜单文字
- [ ] "待处理事项"卡片带红色"待关注"标签，另外两张没有
- [ ] 修改某张卡片的 trend 值保存后，数值颜色立即变化（热更新生效）
- [ ] 点击"帮助"：地址栏不变，Console 打出你的日志；做了选做的话，问候日志只出现一次
- [ ] Elements 面板确认过：`v-if="false"` 的元素只剩 `<!--v-if-->`，`v-show="false"` 的元素带 `display: none`
- [ ] `pnpm build` 零错误，dist 的 JS 体积比第 5 课大 1–2 kB（v-for 渲染逻辑所致）

## 延伸阅读

- [Vue 官方 · 列表渲染](https://cn.vuejs.org/guide/essentials/list.html)——重点看"维护状态与 key"一节，官方用一个 input 反例演示 index 作 key 的坑
- [Vue 官方 · 条件渲染](https://cn.vuejs.org/guide/essentials/conditional.html)
- [Vue 官方 · class 与 style 绑定](https://cn.vuejs.org/guide/essentials/class-and-style.html)
- [Vue 官方 · 事件处理](https://cn.vuejs.org/guide/essentials/event-handling.html)——修饰符全表在这
