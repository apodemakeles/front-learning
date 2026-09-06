---
id: 022
title: 写课15：生命周期与 nextTick——渲染时机
labels: [wayfinder:task]
status: open
assignee:
blocked-by: [021-lesson-14.md]
---

## Question

撰写 `lessons/15-*.md`：常用生命周期钩子（onMounted/onUnmounted/onUpdated 的真实用途）、副作用清理（onCleanup/onScopeDispose）、nextTick 与 DOM 更新时机（响应式批处理：同 tick 多次修改只渲染一次）；第 8 课预告的 flush: 'post' 在此兑现。毕业项目迭代候选：onMounted 恢复持久化数据 + onUnmounted 清理标题副作用（虽然 App 不卸载，demo 子组件可演示）。

完成标准：正文发布、project/ 迭代入库、README 勾选 15、提交推送（模块四至此收官）。
