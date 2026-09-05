# wayfinder 本地工单规约（local-markdown tracker）

本仓库的 issue tracker 为**本地 markdown 文件**（未使用 GitHub Issues）。所有规划与进度以本目录为唯一事实源。

## 文件布局

- **地图**：`wayfinder/map.md`，frontmatter `labels: [wayfinder:map]`。会话开工先读它。
- **工单**：`wayfinder/tickets/<三位编号>-<英文slug>.md`，编号递增，不复用。

## 工单 frontmatter 约定

```markdown
---
id: 003
title: 部署与上线演练环境
labels: [wayfinder:grilling]     # research / prototype / grilling / task 之一
status: open                      # open / closed
assignee:                         # 认领人；空 = 未认领
blocked-by: []                    # 阻塞本单的工单文件名列表
---
```

## 核心操作

- **认领（claim）**：动工前先把 `assignee` 写为当前会话操作者并保存；open 且无 assignee 的工单即未认领。
- **frontier（可动工工单）**：`status: open` 且 `blocked-by` 中所有工单都已 `closed` 且未被认领。
- **解决（resolve）**：在工单文件末尾追加 `## Resolution` 小节写明答案与依据，将 `status` 改为 `closed`，并在 `map.md` 的「Decisions so far」追加一行：`- [工单标题](tickets/xxx.md) — 一句话结论`。
- **新增工单**：先建文件拿到文件名，再回头补其他工单的 `blocked-by`（先建后连线）。
- **拒绝越界**：发现某工单超出地图 Destination，将其 close 并在 map 的「Out of scope」记一行（含链接），不进 Decisions。

## 会话纪律（继承自 wayfinder skill）

- 每次会话至多解决一个工单（research 类除外）
- `wayfinder:grilling` 工单是 HITL：必须与学员在线一问一答推进，agent 不得代答
- `wayfinder:research` 工单可由 agent 独立完成（AFK）
- 答案只写在工单的 Resolution 里，map 只留一行索引——决策只有一个栖身之所
