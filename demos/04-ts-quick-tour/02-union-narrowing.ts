// 差异点 2/3：字面量联合类型 与 类型收窄（node 02-union-narrowing.ts）

// 字符串的"值域"直接成为类型——前端建模状态机的神器
type Status = 'idle' | 'loading' | 'success' | 'error'

function render(s: Status): string {
  // if 就是"证据"：在这条分支里，s 的类型自动收窄为 'loading'
  if (s === 'loading') return '加载中…'
  if (s === 'error') return '出错了'
  // 走到这里，s 已收窄为 'idle' | 'success'
  return `状态：${s}`
}

// typeof 收窄：联合 string | number
function describe(input: string | number): string {
  if (typeof input === 'number') {
    return input.toFixed(1) // 这里 input: number
  }
  return input.toUpperCase() // 这里 input: string
}

// 可辨识联合：对标 Java sealed interface + 模式匹配，还带穷尽检查
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number }

function area(s: Shape): number {
  switch (s.kind) {
    case 'circle':
      return Math.PI * s.radius ** 2 // 分支内自动"长出" radius 字段
    case 'square':
      return s.side ** 2
  }
}

console.log(render('loading'))
console.log(render('success'))
console.log(describe(42), describe('hi'))
console.log(area({ kind: 'circle', radius: 2 }).toFixed(2))
console.log(area({ kind: 'square', side: 3 }))

// 彩蛋：收窄细到什么程度？连"赋值"都被追踪——
// let x: string | number = 42 之后立刻 typeof 判断，else 分支里 x 的类型是 never
// （TS 知道此刻它只可能是 number），不信可以写出来看红线。
// 想要完整的 string | number 二分，用上面的函数参数形式（参数不被赋值收窄）。

// 拼错成员名？编译期直接拒绝：
// render('loadign')  // ❌ Argument of type '"loadign"' is not assignable to parameter of type 'Status'
