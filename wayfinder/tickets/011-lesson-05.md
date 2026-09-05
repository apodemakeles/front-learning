---
id: 011
title: 写课05：第一个 Vue 组件——模板与 SFC【毕业项目开工】
labels: [wayfinder:task]
status: closed
assignee: agent（2026-09-06 完成）
blocked-by: []
---

## Question

撰写 `lessons/05-*.md`：SFC 三段结构（script setup / template / style scoped）解剖、模板最小集（插值 / v-bind / v-on，细节留给第 6 课）、用 create-vue 初始化毕业项目。

**毕业项目落地**：`project/` 初始化为参考实现（脚手架 --ts，起名 shop-admin），首页静态版（顶栏 + 侧菜单 + 欢迎卡片，全部写在 App.vue、不用 v-for/ref——第 6/7 课再演进），随本课入库。

要求：标准课结构 + writing-style 实测纪律；作业 = 学员初始化自己的毕业项目并完成首页静态版（含验收清单）。

完成标准：正文与 project/ 参考实现发布、README 勾选 05、提交推送。

## Resolution

2026-09-06 完成。产出：[lessons/05-first-vue-component-and-sfc.md](../../lessons/05-first-vue-component-and-sfc.md) + [project/shop-admin/](../../project/shop-admin/)（毕业项目参考实现首次入库）。

- **项目实测**：`pnpm create vue@latest shop-admin --ts`（注意：目标目录用 `.` 会触发交互式包名提问，立名目录则全程免交互——已写进课文用立名方式）；清理演示文件后重写 App.vue（首页静态版：顶栏/侧菜单/欢迎卡/三统计卡，仅用插值 + :title + @click，无 v-for/无响应式，注释埋下 06/07 课钩子）、main.css、index.html、README（含迭代表）。
- **验证**：install 723ms；build（含 vue-tsc 类型检查）327ms，dist 三件套 61.57 kB js；dev 149ms 就绪 HTTP 200；产物 grep 到"云上拿铁（虚拟门店）/今日营业额"。
- **刻意的教学取舍**：script 只有普通常量与函数（明确告知"改了不会变，第 6/7 课揭密"）；菜单写死、卡片复制三份——留作第 6 课 v-for 的重构作业钩子。
- 仓库根 README 已更新导览（project/shop-admin 链接迭代表）。进度 5/38。
