// 模板字符串、解构、展开运算符（Node 直接运行：node 01-basics.mjs）

const product = { id: 1, name: '拿铁', price: 32, tags: ['热饮', '咖啡'] }

// 模板字符串：反引号内直接嵌变量
console.log(`商品：${product.name}，价格：¥${product.price}`)

// 对象解构：一行取出多个属性（写 Vue 时天天见）
const { name, price } = product
console.log(name, price)

// 数组解构
const [firstTag] = product.tags
console.log(firstTag)

// 展开：浅拷贝并覆盖字段——"不可变更新"的标准写法
const discounted = { ...product, price: Math.round(price * 0.8) }
console.log(discounted.price, product.price) // 26 32：原对象不受影响
