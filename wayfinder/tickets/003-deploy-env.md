---
id: 003
title: 部署与上线演练环境
labels: [wayfinder:grilling]
status: closed
assignee: agent（2026-09-05 与学员 grilling 定稿）
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

## Resolution

2026-09-05 与学员 grilling 定稿：

1. **部署主线 = 本机 nginx + 构建产物**。学员明确拒绝：Docker/容器化、云服务器与域名、GitHub Pages / Vercel 等第三方托管、CI/CD 流水线——全部不入课程。
2. **教学重心 = 学员的真实知识缺口**：前端构建的最终产物是什么（dist 目录结构、index.html、hash 文件名、source map、分包与产物分析），以及 nginx 如何与产物配合——静态托管 root、SPA history 回退（try_files）、gzip 与预压缩（gzip_static）、缓存策略（hashed 资源长缓存 + index.html 禁缓存）、base/publicPath、多环境 .env 的产物差异。nginx 本身的安装启动用本机 brew/nginx.conf 教学版一段带过（学员是 20 年运维老手）。
3. **毕业项目"上线"的定义**：完成生产构建 → 本机 nginx 以生产形态托管、浏览器可访问。地图 Destination 已相应修订。
4. **公司形态对照仅文字带过**：存量专题中一段话识认公司的 Docker 多阶段构建 + 多环境构建矩阵的发布形态（知道公司怎么发、与课程手工流程的对应关系即可），不实操。

**对 005（大纲定稿）的输入**：部署模块收窄为 1–2 课（构建产物解剖 + nginx 与产物配合），不再含 CI/CD 与托管服务内容。
