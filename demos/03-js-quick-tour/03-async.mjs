// Promise 与 async/await（node 03-async.mjs）
// 用 setTimeout 模拟两次网络请求；.mjs 支持顶层 await

function fetchProducts() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 1, name: '拿铁', price: 32 },
        { id: 2, name: '美式', price: 25 },
      ])
    }, 300)
  })
}

function fetchShopInfo() {
  return new Promise(resolve => {
    setTimeout(() => resolve({ shop: '虚拟门店', city: '杭州' }), 200)
  })
}

// Promise.all：并发执行，对标 CompletableFuture.allOf
const [products, shop] = await Promise.all([fetchProducts(), fetchShopInfo()])

console.log(`店铺：${shop.shop}（${shop.city}）`)
console.log(`共 ${products.length} 个商品，总价格 ¥${products.reduce((s, p) => s + p.price, 0)}`)
console.log('两个请求都完成，总耗时约 300ms（并发）而不是 500ms（串行）')
