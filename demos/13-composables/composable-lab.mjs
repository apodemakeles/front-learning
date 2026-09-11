// 第 13 课实验：composable 是普通函数——在 Node 里直接调用（组件外，单元测试就这么干）
// 运行方式：复制到你的 shop-admin/ 目录下执行（借项目的 node_modules）：
//   cp <课程仓库>/demos/13-composables/composable-lab.mjs .
//   node composable-lab.mjs && rm composable-lab.mjs
import { computed, isReactive, isRef, reactive, ref } from 'vue'

// 正确姿势：返回 refs——每个字段是独立的盒子，使用方解构不丢响应式
function useCounter(initial = 0) {
  const count = ref(initial)
  const double = computed(() => count.value * 2)
  function inc() {
    count.value++
  }
  return { count, double, inc }
}

const { count, double, inc } = useCounter(10)
console.log(`解构后：isRef(count) = ${isRef(count)}，count = ${count.value}，double = ${double.value}`)
inc()
console.log(`inc() 后：count = ${count.value}，double = ${double.value}   ← 解构没有丢响应式`)

console.log('')

// 错误姿势：返回 reactive 整体，使用方一解构就丢响应式（第 7 课限制的再现）
function useBadCounter() {
  return reactive({ count: 0, step: 1 })
}

const state = useBadCounter()
const { count: lost } = state
state.count = 99
console.log(`reactive 解构：lost = ${lost}，state.count = ${state.count}   ← lost 是解构时的快照，永远停在 0`)
console.log(`isReactive(state) = ${isReactive(state)}，isRef(lost) = ${isRef(lost)}`)
