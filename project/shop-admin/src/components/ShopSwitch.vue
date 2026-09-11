<script setup lang="ts">
// 营业状态开关：defineModel 声明一个"双向绑定"的值——
// 父组件用 v-model 接住，本组件只管读写 open，不写一行 props/emit
const open = defineModel<boolean>()
</script>

<template>
  <button class="switch" :class="{ on: open }" @click="open = !open">
    {{ open ? '营业中' : '已打烊' }}
  </button>
</template>

<style scoped>
.switch {
  padding: 6px 16px;
  font-size: 14px;
  border: 1px solid #c9cdd4;
  color: #86909c;
  background: #f7f8fa;
  border-radius: 999px;
  cursor: pointer;
}

.switch.on {
  border-color: #00b42a;
  color: #fff;
  background: #00b42a;
}
</style>
