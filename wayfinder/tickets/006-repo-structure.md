---
id: 006
title: 课程仓库结构落地
labels: [wayfinder:task]
status: closed
assignee: agent（2026-09-06 完成）
blocked-by: [005-course-outline.md]
---

## Question

按定稿大纲落地仓库目录结构：`lessons/` 命名规范、`demos/` 与毕业项目 `project/` 的组织方式、README 目录页与课程状态徽标、每课作业与验收标准的模板文件。产出可长期沿用的仓库骨架与模板，后续写课工单直接套用。

## Resolution

2026-09-06 完成（task，AFK）。落地内容：

1. **lessons 命名规范**：`lessons/NN-english-slug.md`（两位课号 + 英文 slug），与 demos 目录一一对应
2. **templates/lesson-template.md**：标准课骨架模板（六段结构 + 作业验收 checklist 格式 + 用法说明）——作业验收方式就此定为**自查清单**（原地图雾项"验收方式：清单 vs 脚本"由本单收口）
3. **demos/README.md**：每课一目录（`demos/NN-slug/`）、自包含可运行、不提交构建产物
4. **project/README.md**：毕业项目占位说明（第 5 课 create-vue 初始化，指向工单 001 与版本基准，迭代点标注在 README 目录）
5. **课程状态呈现**：以 README 的"当前状态 + 进度行 + 目录逐课勾选"实现，不引入外部 badge 服务
6. AGENTS.md 仓库结构、README 仓库导览同步更新

后续写课工单（007 起）直接套用模板；每发布一课同步勾选 README 目录并更新进度行。
