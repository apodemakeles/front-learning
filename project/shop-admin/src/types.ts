// 跨组件共享的类型：props 和状态都要用，就独立成模块（ESM export，第 3 课）

export interface MenuItem {
  id: string
  label: string
}

export interface StatCard {
  id: string
  label: string
  value: string
  alert?: boolean // 为 true 时卡片显示"待关注"标签
}

export interface LogEntry {
  id: number
  text: string
}
