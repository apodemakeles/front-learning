// 数组方法：对标 Java Stream API（node 02-array-methods.mjs）

const products = [
  { id: 1, name: '拿铁', price: 32, stock: 10 },
  { id: 2, name: '美式', price: 25, stock: 0 },
  { id: 3, name: '摩卡', price: 38, stock: 5 },
]

// map：一对一映射（Stream.map + collect）
console.log(products.map(p => p.name))
// ['拿铁', '美式', '摩卡']

// filter + map 链：先过滤再取字段（Stream.filter().map()）
console.log(products.filter(p => p.stock > 0).map(p => p.name))
// ['拿铁', '摩卡']

// find：找第一个匹配的（Stream.filter().findFirst()）
console.log(products.find(p => p.id === 2))
// { id: 2, name: '美式', price: 25, stock: 0 }

// some / every：anyMatch / allMatch
console.log(products.every(p => p.stock >= 0), products.some(p => p.stock === 0))
// true true

// reduce：汇总（Stream.reduce）
console.log(products.reduce((sum, p) => sum + p.price * p.stock, 0))
// 32*10 + 25*0 + 38*5 = 510

// sort 的坑：默认按字符串比较！
console.log([10, 9, 1].sort())            // [1, 10, 9] —— 字典序
console.log([10, 9, 1].sort((a, b) => a - b)) // [1, 9, 10] —— 数字序要给比较函数
