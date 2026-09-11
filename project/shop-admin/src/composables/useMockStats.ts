// 组合式函数（composable）：把"今日经营数据"的 状态 + 派生 + 动作
// 打包成一个可复用单元——App 只负责消费与编排，数据逻辑住在这里。
// 第 20 课接入 axios 后 refresh 换成真实请求，状态机不变
import { computed, ref } from 'vue'
import type { StatCard } from '../types'

const AVG_PRICE = 28.8 // 虚拟客单价：营业额 = 订单数 × 客单价

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

export function useMockStats() {
  // ---- 状态 ----
  const orderCount = ref(128)
  const pendingCount = ref(3)
  const loading = ref(false)

  // ---- 派生 ----
  const statCards = computed<StatCard[]>(() => [
    { id: 'orders', label: '今日订单', value: `${orderCount.value} 单` },
    {
      id: 'revenue',
      label: '今日营业额',
      value: `¥${Math.round(orderCount.value * AVG_PRICE).toLocaleString('zh-CN')}`,
    },
    {
      id: 'todos',
      label: '待处理事项',
      value: `${pendingCount.value} 件`,
      alert: pendingCount.value > 0,
    },
  ])

  // ---- 动作 ----
  // 防竞态版本号：连续 refresh 只认最后一次的结果
  // （类比乐观锁的 version 字段，第 21 课在真实请求场景展开）
  let seq = 0

  async function refresh() {
    const requestId = ++seq
    loading.value = true
    await sleep(600) // 模拟网络延时（第 20 课换成真实接口）
    if (requestId !== seq) return // 已有更新的请求发出，本次结果作废
    orderCount.value = rand(80, 200)
    pendingCount.value = rand(0, 9)
    loading.value = false
  }

  // 返回 refs（不是 reactive）：每个字段是独立的盒子，使用方解构不丢响应式
  return { orderCount, pendingCount, loading, statCards, refresh }
}
