<script setup lang="ts">
// 数据变更记录：行渲染开放给使用方——#row 作用域插槽回传 log；
// 标签之间的 {{ log.text }} 是 fallback（默认渲染），使用方不传 #row 就用它，
// 行为与从前完全一致
import BasePanel from './BasePanel.vue'
import type { LogEntry } from '../types'

defineProps<{ logs: LogEntry[] }>()
</script>

<template>
  <BasePanel title="数据变更记录">
    <ul>
      <li v-for="log in logs" :key="log.id">
        <slot name="row" :log="log">{{ log.text }}</slot>
      </li>
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
