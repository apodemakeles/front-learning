<script setup lang="ts">
// 数据变更记录：纯展示组件，但内部用 BasePanel 当容器——组件组合组件
import BasePanel from './BasePanel.vue'
import type { LogEntry } from '../types'

defineProps<{ logs: LogEntry[] }>()
</script>

<template>
  <BasePanel title="数据变更记录">
    <ul>
      <li v-for="log in logs" :key="log.id">{{ log.text }}</li>
    </ul>
  </BasePanel>
</template>

<style scoped>
ul {
  list-style: none;
}

li {
  color: #4e5969;
  font-size: 13px;
  line-height: 1.8;
  font-family: monospace;
}
</style>
