<script setup lang="ts">
// 统计数据 · 列表视图：表格展示。"仅看需关注"是本视图的私有状态——
// 切到卡片视图再切回来仍保留，因为外层用 KeepAlive 缓存了本组件实例
import { computed, ref } from 'vue'
import type { StatCard } from '../types'

const props = defineProps<{ cards: StatCard[] }>()

const onlyAlert = ref(false)

// 过滤用 computed（不要在 v-for 里塞 filter）：派生数据留在 script 里
const shownCards = computed(() =>
  onlyAlert.value ? props.cards.filter(c => c.alert) : props.cards,
)
</script>

<template>
  <!-- 单根包裹：多根组件不自动透传（第 10 课），外层的 dimmed class 要能落到根元素 -->
  <div class="stat-list">
    <table class="stat-table">
      <thead>
        <tr><th>指标</th><th>数值</th><th>状态</th></tr>
      </thead>
      <tbody>
        <tr v-for="card in shownCards" :key="card.id">
          <td>{{ card.label }}</td>
          <td>{{ card.value }}</td>
          <td :class="{ warn: card.alert }">{{ card.alert ? '需关注' : '—' }}</td>
        </tr>
      </tbody>
    </table>
    <label class="only-alert">
      <input v-model="onlyAlert" type="checkbox" /> 仅看需关注
    </label>
  </div>
</template>

<style scoped>
.stat-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border: 1px solid #e5e6eb;
}

.stat-table th,
.stat-table td {
  padding: 10px 16px;
  font-size: 14px;
  text-align: left;
  border-bottom: 1px solid #f2f3f5;
}

.stat-table th {
  color: #86909c;
  font-weight: 500;
  font-size: 13px;
}

.stat-table tr:last-child td {
  border-bottom: none;
}

.stat-table td.warn {
  color: #f53f3f;
}

.only-alert {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #86909c;
  font-size: 13px;
  cursor: pointer;
}
</style>
