<script setup lang="ts">
// 统计卡片：纯展示组件——数据进（props），无事件出。
// v-for 与 :key 跟着模板一起搬进来：列表怎么渲染是这个组件的私事。
// loading 与列表视图对齐接口（多视图组件的惯例）：卡片视图暂不用，避免透传杂属性
import type { StatCard } from '../types'

defineProps<{ cards: StatCard[]; loading?: boolean }>()
</script>

<template>
  <section class="cards">
    <div v-for="card in cards" :key="card.id" class="card">
      <p class="label">
        {{ card.label }}
        <span v-if="card.alert" class="badge">待关注</span>
      </p>
      <p class="value">{{ card.value }}</p>
    </div>
  </section>
</template>

<style scoped>
.cards {
  display: flex;
  gap: 16px;
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
