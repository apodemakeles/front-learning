// 差异点 4/5：any vs unknown、可选属性与操作符（node 03-any-unknown.ts）

// any：关闭检查的逃生舱——编译器彻底沉默，尽量别用
const a: any = '42'
console.log(a.length) // "能跑"，但 a.foo() 也能跑——运行时才炸

// unknown：安全的不确定——可以用，但必须先收窄
const u: unknown = '42'
// u.toUpperCase() // ❌ 编译报错：'u' is of type 'unknown'
if (typeof u === 'string') {
  console.log(u.toUpperCase()) // ✓ 收窄后放行
}

// 外部输入（JSON.parse / API 返回）的正确姿势：unknown + 收窄
const raw: unknown = JSON.parse('{"name":"拿铁","price":32}')
if (typeof raw === 'object' && raw !== null && 'price' in raw) {
  console.log(raw)
}

// 可选属性与操作符：API 数据的字段可能缺失，这是前端日常
interface User {
  name: string
  nickname?: string // 可能有，可能没有
  address?: { city?: string }
}
const u1: User = { name: '学员' }

console.log(u1.nickname ?? '（未设置）') // ?? 空值合并：null/undefined 时取右侧
console.log(u1.address?.city ?? '未知城市') // ?. 可选链：中途不存在不会抛错
