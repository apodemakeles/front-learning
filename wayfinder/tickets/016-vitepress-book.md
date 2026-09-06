---
id: 016
title: 课程书站：VitePress + GitHub Pages（手机友好）
labels: [wayfinder:task]
status: closed
assignee: agent（2026-09-06 学员在线确认后当日实施完成）
blocked-by: []
---

## Question

把课程升级为在线书站（学员 2026-09-06 提出）：能否做成"GitHub book"、手机阅读体验是否够好（地铁预习场景）。

学员已拍板：① 仓库转 public（免费启用 Pages）；② 配一条 GitHub Actions 自动发布（仓库基础设施，不进课程教学内容——003 拒绝的是部署课教学，不受影响）。

实施方案：VitePress 1.6（版本基准内），lessons/ 原地渲染、侧边栏由配置自动扫描已发布课程生成（写课流程零变化）、本地搜索、暗色模式；push main 自动构建发布。

完成标准：书站线上可访问（https://apodemakeles.github.io/front-learning/）、后续推课自动更新、README 挂书站入口。

## Resolution

2026-09-06 完成并上线验证。学员决策：仓库转 public + Actions 自动发布（与 003 的边界：那是部署课教学内容，此为仓库基础设施）。

**实施**：VitePress 1.6.4（版本基准内）；书站收录 lessons/ 与 notes/{tech-baseline,company-stack}，工作区（wayfinder/templates/demos/project）排除；侧边栏由 `.vitepress/config.mts` 扫描 lessons/ **自动生成**（按模块分组，新发布的课自动出现）——写课流程零变化；本地搜索、暗色模式、代码复制按钮。本地 `docs:build` 1.44s；线上验证：首页与第 1 课 HTTP 200。

**实施中踩到的两个坑（留作课程素材）**：

1. **pnpm 11 安全默认**：esbuild 安装脚本被拒（ERR_PNPM_IGNORED_BUILDS）——正是版本基准第三节预警的现象。解法：pnpm 11.21 会自动生成 `pnpm-workspace.yaml` 桩文件，把 `allowBuilds: { esbuild: true }` 填上即可（本地与 CI 一并生效）。可作为第 2 课的补充示例。
2. **gh OAuth token 缺 workflow scope**：HTTPS 推送含 workflow 文件的提交被远端拒绝——已把 remote 切到 SSH（密钥认证不受 OAuth scope 限制）。

后续推课 → Actions 自动重建发布，无需任何手动操作（已写入 writing-style.md 发布流程第 7 条）。
