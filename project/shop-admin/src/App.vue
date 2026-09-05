<script setup lang="ts">
// 毕业项目：云上拿铁（虚拟门店）管理后台
// 第 5 课：首页静态版——只用"插值 + 一个属性绑定 + 一个事件"，响应式第 7 课再讲

const shopName = '云上拿铁（虚拟门店）'
const today = new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
})

// 点击事件调用的普通函数：本课还没有响应式数据，所以只往控制台打日志
function greet() {
  console.log(`欢迎回来！今天是 ${today}，祝生意兴隆`)
}
</script>

<template>
  <div class="layout">
    <!-- 顶栏：店名 + 当前登录人 -->
    <header class="topbar">
      <span class="brand">{{ shopName }} · 管理后台</span>
      <span class="user" :title="`今天是 ${today}`">店长：老曹</span>
    </header>

    <div class="body">
      <!-- 侧边菜单：第 5 课先写死三项，第 6 课改造成 v-for -->
      <aside class="menu">
        <nav>
          <a class="active">经营看板</a>
          <a>商品管理</a>
          <a>系统设置</a>
        </nav>
      </aside>

      <!-- 主区域 -->
      <main class="content">
        <section class="welcome">
          <h1>欢迎回来</h1>
          <p>{{ today }}</p>
          <button @click="greet">打个招呼</button>
        </section>

        <!-- 三张统计卡片：先复制三份，第 6 课用 v-for 消除重复 -->
        <section class="cards">
          <div class="card">
            <p class="label">今日订单</p>
            <p class="value">128 单</p>
          </div>
          <div class="card">
            <p class="label">今日营业额</p>
            <p class="value">¥3,680</p>
          </div>
          <div class="card">
            <p class="label">待处理事项</p>
            <p class="value">3 件</p>
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
  font-size: 13px;
  color: #cfd3dc;
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
  color: #86909c;
  font-size: 13px;
  margin-bottom: 8px;
}

.card .value {
  font-size: 24px;
  font-weight: 600;
}
</style>
