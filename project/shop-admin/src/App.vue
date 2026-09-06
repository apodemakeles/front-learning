<script setup lang="ts">
// 毕业项目：云上拿铁（虚拟门店）管理后台
// 第 6 课：模板语法细节——菜单与统计卡片数据化（v-for + :key）、class 绑定、事件修饰符、v-if
// 数据仍是普通常量（点击菜单还切不动高亮），响应式第 7 课再讲

interface MenuItem {
  id: string
  label: string
}

interface StatCard {
  id: string
  label: string
  value: string
  alert?: boolean // 为 true 时卡片显示"待关注"标签（v-if 的判断条件）
}

const shopName = '云上拿铁（虚拟门店）'
const today = new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
})

// 侧边菜单：数据驱动——增删菜单项只改这个数组，模板不动
const menuItems: MenuItem[] = [
  { id: 'dashboard', label: '经营看板' },
  { id: 'products', label: '商品管理' },
  { id: 'settings', label: '系统设置' },
]

// 当前激活的菜单项 id。普通常量，改它页面不会变——点击切换高亮等第 7 课的响应式
const activeMenuId = 'dashboard'

// 统计卡片：数据驱动
const statCards: StatCard[] = [
  { id: 'orders', label: '今日订单', value: '128 单' },
  { id: 'revenue', label: '今日营业额', value: '¥3,680' },
  { id: 'todos', label: '待处理事项', value: '3 件', alert: true },
]

function greet() {
  console.log(`欢迎回来！今天是 ${today}，祝生意兴隆`)
}

// 帮助链接的事件处理：.prevent 拦下 <a> 的默认跳转后走这里（SPA 内部动作代替整页跳转）
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
      <!-- 侧边菜单：v-for 渲染，:class 对象语法按条件挂 active，:key 用稳定 id -->
      <aside class="menu">
        <nav>
          <a
            v-for="item in menuItems"
            :key="item.id"
            :class="{ active: item.id === activeMenuId }"
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
          <button @click="greet">打个招呼</button>
        </section>

        <!-- 统计卡片：v-for 渲染；alert 为 true 的卡片用 v-if 显示标签 -->
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

.welcome button {
  padding: 6px 16px;
  font-size: 14px;
  border: 1px solid #1652f0;
  color: #1652f0;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
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
