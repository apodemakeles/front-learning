---
id: 003
title: 部署与上线演练环境
labels: [wayfinder:grilling]
status: open
assignee:
blocked-by: []
---

## Question

部署课用什么环境真机演练？毕业项目最终部署到哪？候选（可组合）：

- **GitHub Pages / Vercel / Netlify**——免费托管 + CI/CD 一条龙，体验现代部署方式
- **学员自有服务器 + nginx（可选 Docker）**——最贴近公司生产形态（公司用 nginx + Docker 多阶段构建）
- **两者都走一遍（推荐）**：先 Vercel / GH Pages 快速上线建立成就感，再手工 nginx / Docker 完整走一遍生产形态

需要确认：学员是否有可用的云服务器与域名；是否愿意为课程开通 Vercel 等第三方服务。

## Notes

- HITL 工单：需要学员在线一问一答推进。
- 结论决定部署模块课时安排（1–3 课）与毕业项目"可访问线上地址"落在哪里。
