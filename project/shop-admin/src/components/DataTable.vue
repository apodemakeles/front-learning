<script setup lang="ts" generic="T">
// 通用表格组件（渲染器模式）：所有使用方都一样的部分归这里——
// 行遍历、:key、空态、表格样式；每个使用方不同的部分（表头/单元格内容）
// 留给插槽：#head 写表头，#row 作用域插槽写单元格（row/index 由本组件回传）。
// generic="T"：泛型组件，rows 的元素类型由使用方传入时确定，
// rowKey 的参数与 #row 回传的 row 就自动是同一个类型（泛型组件第 14 课细讲）
defineProps<{
  rows: T[]
  rowKey: (row: T) => string | number
  loading?: boolean
  emptyText?: string
}>()
</script>

<template>
  <table class="data-table">
    <thead>
      <tr>
        <slot name="head" />
      </tr>
    </thead>
    <tbody>
      <template v-if="loading">
        <tr class="empty-row">
          <td>加载中…</td>
        </tr>
      </template>
      <template v-else-if="rows.length === 0">
        <tr class="empty-row">
          <td>{{ emptyText ?? '暂无数据' }}</td>
        </tr>
      </template>
      <template v-else>
        <tr v-for="(row, index) in rows" :key="rowKey(row)">
          <!-- 作用域插槽：把行数据与下标"回传"给使用方写的单元格模板 -->
          <slot name="row" :row="row" :index="index" />
        </tr>
      </template>
    </tbody>
  </table>
</template>

<style scoped>
.data-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border: 1px solid #e5e6eb;
}

.data-table th,
.data-table td {
  padding: 10px 16px;
  font-size: 14px;
  text-align: left;
  border-bottom: 1px solid #f2f3f5;
}

.data-table th {
  color: #86909c;
  font-weight: 500;
  font-size: 13px;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.data-table tbody tr:hover td {
  background: #f7f8fa;
}

.empty-row td {
  color: #86909c;
  text-align: center;
  padding: 24px 0;
}
</style>
