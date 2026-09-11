// 跨组件共享的类型：props 和状态都要用，就独立成模块（ESM export，第 3 课）
import type { InjectionKey } from 'vue'

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

// 主题：provide/inject 的注入键——Symbol 身份 + 泛型，
// inject 时拿到的类型由这里定义（比字符串键多一层类型安全）
export interface ShopTheme {
  primary: string
}

export const THEME_KEY: InjectionKey<ShopTheme> = Symbol('shop-theme')
