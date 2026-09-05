// ESM：命名导出——模块的"工具箱"（一个文件可导出多个）

export function formatPrice(yuan) {
  return `¥${yuan.toFixed(2)}`
}

export const TAX_RATE = 0.06
