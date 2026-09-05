// ESM：两种导入方式（node 04-main.mjs）

import { formatPrice, TAX_RATE } from './04-utils.mjs' // 命名导入：花括号，名字必须对
import summarize from './04-format.mjs'                 // 默认导入：不用花括号，名字随便起

const products = [
  { name: '拿铁', price: 32 },
  { name: '美式', price: 25 },
]

console.log(formatPrice(products[0].price))                    // ¥32.00
console.log(`含税：${formatPrice(products[0].price * (1 + TAX_RATE))}`) // ¥33.92
console.log(summarize(products))                               // 共 2 件，合计 ¥57
