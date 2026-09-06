<script setup lang="ts">
// 毕业项目：云上拿铁（虚拟门店）管理后台
// 第 7 课：响应式——ref 驱动菜单高亮与统计数字，computed 派生营业额
// 点击菜单、点"模拟刷新"，页面实时变——这就是响应式；watch 家族下一课
import { computed, ref } from 'vue'

interface MenuItem {
  id: string
  label: string
}

interface StatCard {
  id: string
  label: string
  value: string
  alert?: boolean // 为 true 时卡片显示"待关注"标签
}

// 不变的数据仍用普通常量：菜单内容、店名、日期都不需要"变"
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

// 会变的状态用 ref（脚本里读写都走 .value，模板里自动解包不用写）
const activeMenuId = ref('dashboard')
const orderCount = ref(128)
const pendingCount = ref(3)

// 虚拟客单价：营业额 = 订单数 × 客单价（派生数据，不需要自己的 ref）
const AVG_PRICE = 28.8

// 卡片也是派生数据 → computed：依赖（orderCount/pendingCount）不变就直接用缓存
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

// 模拟刷新今日数据（第 22 课接入 mock 后，这里换成真正的接口请求）
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

// 帮助链接的事件处理：.prevent 拦下 <a> 的默认跳转后走这里
function openHelp() {
  console.log('打开帮助中心（本课先打个日志，页面跳转等路由课）')
}
</script>

<template>
  <div class="layout">
    <!-- 顶栏：店名 + 当前登录人 -->
    <header class="topbar">
      <span class="brand">{{ shopName }} · 管理后台</span>
      <span class="user" :title="`今天是 ${today}`">
        店长：老曹
        <a href="https://example.com/help" @click.prevent="openHelp">帮助</a>
      </span>
    </header>

    <div class="body">
      <!-- 侧边菜单：v-for 渲染；点击直接改 activeMenuId，高亮实时切换 -->
      <aside class="menu">
        <nav>
          <a
            v-for="item in menuItems"
            :key="item.id"
            :class="{ active: item.id === activeMenuId }"
            @click="activeMenuId = item.id"
          >
            {{ item.label }}
          </a>
        </nav>
      </aside>

      <!-- 主区域 -->
      <main class="content">
        <section class="welcome">
          <h1>欢迎回来</h1>
          <p>{{ today }}</p>
          <div class="actions">
            <button class="primary" @click="refreshToday">模拟刷新今日数据</button>
            <button @click="greet">打个招呼</button>
          </div>
        </section>

        <!-- 统计卡片：computed 数组——订单数一变，营业额与"待关注"标签自动跟着变 -->
        <section class="cards">
          <div v-for="card in statCards" :key="card.id" class="card">
            <p class="label">
              {{ card.label }}
              <span v-if="card.alert" class="badge">待关注</span>
            </p>
            <p class="value">{{ card.value }}</p>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 56px;
  background: #1f2329;
  color: #fff;
}

.brand {
  font-size: 16px;
  font-weight: 600;
}

.user {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #cfd3dc;
}

.user a {
  color: #cfd3dc;
  text-decoration: none;
}

.user a:hover {
  color: #fff;
  text-decoration: underline;
}

.body {
  display: flex;
  flex: 1;
}

.menu {
  width: 180px;
  padding: 16px 0;
  background: #fff;
  border-right: 1px solid #e5e6eb;
}

.menu nav {
  display: flex;
  flex-direction: column;
}

.menu a {
  padding: 10px 24px;
  color: #4e5969;
  font-size: 14px;
  cursor: pointer;
}

.menu a.active {
  color: #1652f0;
  background: #f2f3f5;
  font-weight: 600;
}

.content {
  flex: 1;
  padding: 24px;
}

.welcome {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e5e6eb;
}

.welcome h1 {
  font-size: 20px;
  margin-bottom: 8px;
}

.welcome p {
  color: #86909c;
  font-size: 14px;
  margin-bottom: 16px;
}

.actions {
  display: flex;
  gap: 12px;
}

.welcome button {
  padding: 6px 16px;
  font-size: 14px;
  border: 1px solid #1652f0;
  color: #1652f0;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.welcome button.primary {
  background: #1652f0;
  color: #fff;
}

.cards {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}

.card {
  flex: 1;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e5e6eb;
}

.card .label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #86909c;
  font-size: 13px;
  margin-bottom: 8px;
}

.card .value {
  font-size: 24px;
  font-weight: 600;
}

.badge {
  padding: 1px 8px;
  font-size: 12px;
  color: #f53f3f;
  border: 1px solid #f53f3f;
  border-radius: 10px;
}
</style>
