<script setup lang="ts">
// 统计数据 · 列表视图：表格交给通用 DataTable（渲染器模式），
// 本组件只声明"列"——表头与每个单元格写在插槽里，行遍历/key/空态不用管
import { computed, ref } from 'vue'
import DataTable from './DataTable.vue'
import type { StatCard } from '../types'

const props = defineProps<{ cards: StatCard[]; loading?: boolean }>()

const onlyAlert = ref(false)

// 过滤用 computed（不要在 v-for 里塞 filter）：派生数据留在 script 里
const shownCards = computed(() =>
  onlyAlert.value ? props.cards.filter(c => c.alert) : props.cards,
)
</script>

<template>
  <!-- 单根包裹：多根组件不自动透传（第 10 课），外层的 dimmed class 要能落到根元素 -->
  <div class="stat-list">
    <DataTable :rows="shownCards" :row-key="card => card.id" :loading="loading">
      <template #head>
        <th>指标</th>
        <th>数值</th>
        <th>状态</th>
      </template>
      <template #row="{ row }">
        <td>{{ row.label }}</td>
        <td>{{ row.value }}</td>
        <td :class="{ warn: row.alert }">{{ row.alert ? '需关注' : '—' }}</td>
      </template>
    </DataTable>
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

/* td 是插槽内容、编译在本组件作用域（第 9 课），scoped 样式直接命中 */
td.warn {
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
