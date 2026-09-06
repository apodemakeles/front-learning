---
id: 016
title: 课程书站：VitePress + GitHub Pages（手机友好）
labels: [wayfinder:task]
status: open
assignee: agent（2026-09-06 学员在线确认后本会话实施）
blocked-by: []
---

## Question

把课程升级为在线书站（学员 2026-09-06 提出）：能否做成"GitHub book"、手机阅读体验是否够好（地铁预习场景）。

学员已拍板：① 仓库转 public（免费启用 Pages）；② 配一条 GitHub Actions 自动发布（仓库基础设施，不进课程教学内容——003 拒绝的是部署课教学，不受影响）。

实施方案：VitePress 1.6（版本基准内），lessons/ 原地渲染、侧边栏由配置自动扫描已发布课程生成（写课流程零变化）、本地搜索、暗色模式；push main 自动构建发布。

完成标准：书站线上可访问（https://apodemakeles.github.io/front-learning/）、后续推课自动更新、README 挂书站入口。
