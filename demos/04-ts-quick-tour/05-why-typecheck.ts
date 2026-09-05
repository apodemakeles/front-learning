// 类型检查的"威力演示"：运行时没人查类型，检查全靠编译期
// 运行：node 05-why-typecheck.ts（能跑！但不安全）
// 检查：pnpm dlx typescript tsc --noEmit 05-why-typecheck.ts（当场报错）

const product: { name: string; price: number } = { name: '拿铁', price: 32 }

// 第 3 课埋过的雷：属性名拼错
console.log(product.nmae) // 运行时输出 undefined（静默错误！）

// 用 tsc --noEmit 检查，会得到：
// 05-why-typecheck.ts:9:19 - error TS2551: Property 'nmae' does not exist on type
// '{ name: string; price: number;}'. Did you mean 'name'?
