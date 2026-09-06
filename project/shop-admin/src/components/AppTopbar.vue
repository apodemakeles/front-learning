<script setup lang="ts">
// 顶栏：数据从 props 进（父组件拥有），点击"帮助"不自己处理——emit 抛给父组件
defineProps<{ shopName: string; today: string }>()

const emit = defineEmits<{ help: [] }>()
</script>

<template>
  <header class="topbar">
    <span class="brand">{{ shopName }} · 管理后台</span>
    <span class="user" :title="`今天是 ${today}`">
      店长：老曹
      <a href="https://example.com/help" @click.prevent="emit('help')">帮助</a>
    </span>
  </header>
</template>

<style scoped>
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
</style>
