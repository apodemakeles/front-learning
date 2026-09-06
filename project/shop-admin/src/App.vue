<script setup lang="ts">
// 毕业项目：云上拿铁（虚拟门店）管理后台
// 第 9 课：拆组件——App 只剩"布局 + 状态编排"，视图细节住进 components/
// 数据向下传（props），动作向上抛（emit），通用容器用插槽填充
import { computed, ref, watch, watchEffect } from 'vue'
import AppTopbar from './components/AppTopbar.vue'
import SideMenu from './components/SideMenu.vue'
import StatCards from './components/StatCards.vue'
import ChangeLogs from './components/ChangeLogs.vue'
import BasePanel from './components/BasePanel.vue'
import type { LogEntry, MenuItem, StatCard } from './types'

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
const orderCount = ref(128)
const pendingCount = ref(3)

// 虚拟客单价：营业额 = 订单数 × 客单价（派生数据，不需要自己的 ref）
const AVG_PRICE = 28.8

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

// ---- 副作用（第 8 课）----
let logSeq = 0
const changeLogs = ref<LogEntry[]>([])

watch(activeMenuId, (id) => {
  localStorage.setItem('shop-admin:active-menu', id)
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
  document.title = `云上拿铁 · 今日 ${orderCount.value} 单`
})

// ---- 动作：改状态（状态在谁那里，修改权就在谁那里）----
function refreshToday() {
  orderCount.value = rand(80, 200)
  pendingCount.value = rand(0, 9)
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
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
  background: #1652f0;
  color: #fff;
}
</style>
