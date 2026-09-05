// ESM：默认导出——这个模块的"主角"，每个文件最多一个

export default function summarize(list) {
  const total = list.reduce((s, p) => s + p.price, 0)
  return `共 ${list.length} 件，合计 ¥${total}`
}
