<script setup lang="ts">
// 毕业项目：云上拿铁（虚拟门店）管理后台
// 第 9 课：拆组件——App 只剩"布局 + 状态编排"，视图细节住进 components/
// 数据向下传（props），动作向上抛（emit），通用容器用插槽填充
// 第 10 课：v-model（ShopSwitch 双向开关）、透传（dimmed 落到 StatCards 根元素）、
// provide/inject（主题色注入，BasePanel 消费）
// 第 13 课：composable——今日经营数据（状态/派生/加载中/刷新动作）
// 收进 composables/useMockStats.ts，App 只负责消费与编排副作用
import { defineAsyncComponent, provide, reactive, ref, watch, watchEffect } from 'vue'
import type { Component } from 'vue'
import AppTopbar from './components/AppTopbar.vue'
import SideMenu from './components/SideMenu.vue'
import StatCards from './components/StatCards.vue'
import ChangeLogs from './components/ChangeLogs.vue'
import BasePanel from './components/BasePanel.vue'
import ShopSwitch from './components/ShopSwitch.vue'
import { useMockStats } from './composables/useMockStats'
import { THEME_KEY } from './types'
import type { LogEntry, MenuItem } from './types'

// 列表视图异步加载：defineAsyncComponent + 动态 import()——
// build 时独立分包，首屏不下载，第一次切到"列表"才加载
const StatListView = defineAsyncComponent(() => import('./components/StatListView.vue'))

// ---- 状态全部留在 App（唯一拥有者），子组件只做无状态展示 ----
const shopName = '云上拿铁（虚拟门店）'
const today = new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
})

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: '经营看板' },
  { id: 'products', label: '商品管理' },
  { id: 'settings', label: '系统设置' },
]

// 菜单高亮从 localStorage 恢复上次的选择（写回由下面的 watch 负责）
const activeMenuId = ref(localStorage.getItem('shop-admin:active-menu') ?? 'dashboard')

// 营业状态：ShopSwitch 用 v-model 双向绑定（持久化同菜单一个套路）
const shopOpen = ref(localStorage.getItem('shop-admin:open') !== '0')

// 今日经营数据来自组合式函数：解构安全——返回的每个字段都是独立的 ref/computed 盒子
const { orderCount, pendingCount, loading, statCards, refresh } = useMockStats()

// 主题色：provide 给整个子树，深层次组件（BasePanel）inject 消费
const theme = reactive({ primary: '#1652f0' })
provide(THEME_KEY, theme)

// 统计区视图：卡片 / 列表，动态组件切换；卡片视图是同步的（首屏就要），
// 列表视图异步（用得少，用的时候再下载）
type StatView = 'cards' | 'list'
const statView = ref<StatView>('cards')
const statViews: Record<StatView, Component> = {
  cards: StatCards,
  list: StatListView,
}

// 操作提示（Teleport 到 body 的 toast）
const toast = ref<string | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | undefined

function showToast(msg: string) {
  toast.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = null), 2000)
}

// ---- 副作用（第 8 课）----
let logSeq = 0
const changeLogs = ref<LogEntry[]>([])

watch(activeMenuId, (id) => {
  localStorage.setItem('shop-admin:active-menu', id)
})

watch(shopOpen, (open) => {
  localStorage.setItem('shop-admin:open', open ? '1' : '0')
})

watch([orderCount, pendingCount], ([orders, pending], [prevOrders, prevPending]) => {
  const time = new Date().toLocaleTimeString('zh-CN')
  changeLogs.value.push({
    id: ++logSeq,
    text: `[${time}] 订单 ${prevOrders} → ${orders}，待处理 ${prevPending} → ${pending}`,
  })
  if (changeLogs.value.length > 3) changeLogs.value.shift()
})

watchEffect(() => {
  document.title = `云上拿铁 · 今日 ${orderCount.value} 单${shopOpen.value ? '' : ' · 已打烊'}`
})

// ---- 动作：改状态（状态在谁那里，修改权就在谁那里）----
// 刷新的动作与 loading 状态在 composable 里，这里只编排"成功后弹提示"
async function refreshToday() {
  await refresh()
  showToast(`数据已更新 ${new Date().toLocaleTimeString('zh-CN')}`)
}

function greet() {
  console.log(`欢迎回来！今天是 ${today}，祝生意兴隆`)
}

function openHelp() {
  console.log('打开帮助中心（本课先打个日志，页面跳转等路由课）')
}
</script>

<template>
  <div class="layout">
    <AppTopbar :shop-name="shopName" :today="today" @help="openHelp" />

    <div class="body">
      <!-- 子组件上报 select 事件，$event 是 emit 的第一个参数 -->
      <SideMenu
        :items="menuItems"
        :active-id="activeMenuId"
        @select="activeMenuId = $event"
      />

      <main class="content">
        <BasePanel title="欢迎回来">
          <p class="date">{{ today }}</p>
          <div class="actions">
            <ShopSwitch v-model="shopOpen" />
            <button
              class="primary"
              :disabled="!shopOpen || loading"
              :style="{ background: theme.primary, borderColor: theme.primary }"
              @click="refreshToday"
            >
              {{ loading ? '刷新中…' : '模拟刷新今日数据' }}
            </button>
            <button :style="{ color: theme.primary, borderColor: theme.primary }" @click="greet">
              打个招呼
            </button>
          </div>
          <div class="theme-picker">
            主题：
            <button
              v-for="c in ['#1652f0', '#722ed1', '#fa8c16']"
              :key="c"
              class="dot"
              :style="{ background: c }"
              :aria-label="`主题色 ${c}`"
              @click="theme.primary = c"
            />
          </div>
        </BasePanel>

        <!-- 统计区：卡片/列表两个视图动态切换。切走的视图被 KeepAlive 缓存而非销毁；
             dimmed 经透传落到"当前视图"的根元素上 -->
        <div class="stats-zone">
          <div class="view-tabs">
            <button :class="{ on: statView === 'cards' }" @click="statView = 'cards'">
              卡片
            </button>
            <button :class="{ on: statView === 'list' }" @click="statView = 'list'">
              列表
            </button>
          </div>
          <KeepAlive>
            <component
              :is="statViews[statView]"
              :cards="statCards"
              :loading="loading"
              :class="{ dimmed: !shopOpen }"
            />
          </KeepAlive>
        </div>
        <ChangeLogs v-if="changeLogs.length" :logs="changeLogs" />
      </main>
    </div>

    <!-- 操作提示：DOM 传送到 body 下（Teleport），但数据/样式仍归 App 管 -->
    <Teleport to="body">
      <div v-if="toast" class="toast">{{ toast }}</div>
    </Teleport>
  </div>
</template>

<style scoped>
/* App 只保留布局；.date/.actions 是写进 BasePanel 插槽里的内容，
   插槽内容编译在父组件作用域——所以它们的样式归 App 管 */
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.body {
  display: flex;
  flex: 1;
}

.content {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.date {
  color: #86909c;
  font-size: 14px;
  margin-bottom: 16px;
}

.actions {
  display: flex;
  gap: 12px;
}

.actions button {
  padding: 6px 16px;
  font-size: 14px;
  border: 1px solid #1652f0;
  color: #1652f0;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.actions button.primary {
  border-color: #1652f0;
  background: #1652f0;
  color: #fff;
}

.actions button.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* dimmed 经透传落在 StatCards 根元素上；子组件的根节点同时受
   父组件 scoped 样式影响（第 9 课原理 3 的补充），所以这里能选中它 */
.dimmed {
  opacity: 0.45;
  filter: grayscale(1);
}

.theme-picker {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  color: #86909c;
  font-size: 13px;
}

.theme-picker .dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px #c9cdd4;
  cursor: pointer;
}

.stats-zone {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.view-tabs {
  display: flex;
  gap: 8px;
}

.view-tabs button {
  padding: 4px 14px;
  font-size: 13px;
  border: 1px solid #e5e6eb;
  background: #fff;
  color: #4e5969;
  border-radius: 4px;
  cursor: pointer;
}

.view-tabs button.on {
  border-color: #1652f0;
  color: #1652f0;
  font-weight: 600;
}

.toast {
  position: fixed;
  right: 24px;
  bottom: 24px;
  padding: 10px 20px;
  background: #1f2329;
  color: #fff;
  font-size: 14px;
  border-radius: 6px;
  z-index: 1000;
}
</style>
