// 差异点 1：结构化类型——"长得像，就兼容"（node 01-structural.ts）

interface Product {
  name: string
  price: number
}

// 另一个"毫不相干"的接口，形状完全一样
interface Goods {
  name: string
  price: number
}

const p: Product = { name: '拿铁', price: 32 }
const g: Goods = p // ✓ 合法！Java 里这绝不可能通过编译

console.log(g.name)

// 甚至不需要任何接口声明：对象字面量形状满足即可
function printGoods(goods: Goods) {
  console.log(`${goods.name} ¥${goods.price}`)
}
printGoods({ name: '美式', price: 25 }) // ✓ 字面量直接满足"形状"

// 多余字段：字面量直接传入不行（防止拼写错误），先赋给变量再传可以
const withExtra = { name: '摩卡', price: 38, stock: 5 }
printGoods(withExtra) // ✓ 变量多字段没关系——只检查"有没有要求的样子"
