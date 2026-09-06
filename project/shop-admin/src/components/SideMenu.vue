<script setup lang="ts">
// 侧边菜单：菜单数据与激活状态都是 props（父组件拥有）。
// 点击不改数据——"上报"给父组件（emit），改不改、怎么改由父决定（单向数据流）
import type { MenuItem } from '../types'

defineProps<{
  items: MenuItem[]
  activeId: string
}>()

const emit = defineEmits<{ select: [id: string] }>()
</script>

<template>
  <aside class="menu">
    <nav>
      <a
        v-for="item in items"
        :key="item.id"
        :class="{ active: item.id === activeId }"
        @click="emit('select', item.id)"
      >
        {{ item.label }}
      </a>
    </nav>
  </aside>
</template>

<style scoped>
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
</style>
