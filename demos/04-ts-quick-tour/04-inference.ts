// 差异点 6：类型推断为主 + 泛型的"形状约束"（node 04-inference.ts）

// 能推断的不用写（比 Java 的 var 覆盖面大得多）
const price = 32 // number
const names = ['拿铁', '美式'] // string[]
const pairs: [string, number][] = [['a', 1], ['b', 2]] // 元组：定长定位（API 返回常见）

// 函数参数没有上下文可推断，必须标注；公共函数返回值建议写全
function sum(nums: number[]): number {
  return nums.reduce((s, n) => s + n, 0)
}

// 泛型：Java 你已经会了，差异只有一条——
// extends 不是"继承自某个类/接口"，而是"形状满足约束"
function first<T extends { id: number }>(arr: T[]): T | undefined {
  return arr[0]
}

// T 被自动推断为 { id: number; name: string }，调用处不用写尖括号
const p = first([{ id: 1, name: '拿铁' }])
console.log(sum([1, 2, 3]), p?.name, names.length, price, pairs[0])

// interface 与 type：描述对象形状时几乎等价，团队选一个惯例即可
// （课程统一用 type 定义数据形状、interface 定义函数/组件 props 形状——见到两种都认识就行）
