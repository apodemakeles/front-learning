<script setup lang="ts">
// 通用容器组件：白卡片 + 标题。内容不放这里——<slot /> 是占位符，
// 父组件在标签之间写什么，这里就显示什么（插槽，第 9 课）
defineProps<{ title: string }>()
</script>

<template>
  <section class="panel">
    <h2 class="panel-title">{{ title }}</h2>
    <slot />
  </section>
</template>

<style scoped>
.panel {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e5e6eb;
}

.panel-title {
  font-size: 16px;
  margin-bottom: 12px;
}
</style>
