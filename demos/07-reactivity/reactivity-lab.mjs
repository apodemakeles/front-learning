// 第 7 课实验：在 Node 里"看"响应式——依赖追踪与 computed 缓存
// 运行方式：复制到你的 shop-admin/ 目录下执行（借项目的 node_modules）：
//   cp <课程仓库>/demos/07-reactivity/reactivity-lab.mjs <你的项目>/shop-admin/
//   cd shop-admin && node reactivity-lab.mjs && rm reactivity-lab.mjs
import { computed, ref, watchEffect } from 'vue'

console.log('== 实验 1：依赖追踪（watchEffect 模拟一次"渲染"）==')
const count = ref(1)
const visible = ref(true)

// flush: 'sync' 让回调同步执行、日志顺序可读（页面真实渲染是异步批处理的，第 15 课讲）
watchEffect(
  () => {
    if (visible.value) console.log(`[渲染] count = ${count.value}`)
    else console.log('[渲染] count 已隐藏，本次不读 count')
  },
  { flush: 'sync' },
)

console.log('-- 改 count = 2：上次渲染读过它，是依赖，重跑 --')
count.value = 2

console.log('-- 改 visible = false：visible 是依赖，重跑；这次分支没读 count --')
visible.value = false

console.log('-- 再改 count = 3：没有任何渲染发生（count 已不是依赖）--')
count.value = 3

console.log('\n== 实验 2：computed 的缓存 ==')
const orders = ref(100)
const revenue = computed(() => {
  console.log('（营业额 getter 执行了一次）')
  return orders.value * 29
})

console.log(`第一次读 revenue：${revenue.value}`)
console.log(`第二次读 revenue：${revenue.value}`)
console.log('-- 改 orders = 101 --')
orders.value = 101
console.log(`依赖变了再读：${revenue.value}`)
