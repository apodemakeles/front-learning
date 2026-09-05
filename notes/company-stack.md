# 公司存量前端技术栈调研（供课程设计参考）

> 调研时间：2026-09-05；方式：只读查看公司 GitLab 三个前端仓库的生产分支。
> 本文件已脱敏：不含内网地址、内部仓库名与内部包名。仓库可能公开，严禁回填内部信息。

## 总览：两代技术栈并存

| 维度 | 存量主力（两个管理端项目） | 新一代（一个移动端项目） |
|---|---|---|
| 框架 | Vue 2.6 | Vue 3.2 |
| 路由 / 状态 | Vue Router 3 + Vuex 3（+ vuex-persistedstate 持久化） | Vue Router 4 + Pinia 2 |
| 语言 | TS 3.9 / 4.9，class 风格组件（vue-class-component / vue-property-decorator / vuex-class） | TS 4.8 + vue-tsc，Composition API |
| 构建 | @vue/cli 4（webpack 4）+ babel | Vite 3 + unplugin-vue-components 自动导入 |
| UI 库 | element-ui 2.13 与 ant-design-vue 1.7 混用，另有 vxe-table、tinymce | vant 3（移动端） |
| 网络 / 工具 | axios 0.19、moment、echarts | axios 1.x、dayjs、@vueuse、echarts |
| 微前端 | wujie（wujie-vue2） | wujie-vue3 |
| 样式 | sass 与 less 混用 | less + postcss-px-to-viewport（视口适配） |
| 代码质量 | ESLint 6 + Prettier 1 | ESLint 8 + Prettier 2 |

## 构建与部署形态（部署课的真实素材）

- **多环境**：根目录十余个 `.env.<env>` 文件 + `npm run build-<env>` 脚本矩阵（dev / qa / pre / grey / prod / 分产品线 等）
- **Docker 多阶段构建**：stage 1 在 `node:<旧版本>-alpine` 中 `npm install && npm run build-<ENV>`；stage 2 把 dist 拷进 `nginx:alpine`，并按环境选择 nginx conf
- **nginx 要点**：gzip / gzip_static 预压缩、SPA history 回退、反向代理与超时、client_max_body_size
- **产物优化**：compression-webpack-plugin / vite-plugin-compression（构建期预压缩）、rollup-plugin-visualizer（产物分析）、生产环境 CDN externals（把 vue 等大件外置到 CDN）
- **浏览器兼容**：新项目仍使用 @vitejs/plugin-legacy

## 依赖生态（依赖管理课的真实素材）

- 使用 npmmirror（淘宝）镜像；node-sass 时代还需配置二进制下载镜像（经典的 native 依赖坑，正好做教学案例）
- 存在 `file:xxx-1.5.4.tgz` 形式的本地包依赖（内部私有包以 tgz 文件入库）
- package-lock.json 与 yarn.lock 在不同项目并存（锁文件不通用的问题）
- package.json 未声明 engines 约束 Node 版本，但 Docker 里钉死了旧版 node——环境一致性问题，可做教学案例

## 对课程设计的启示

1. **存量维护专题必须覆盖**：class 风格 TS 组件、Vuex、vue-cli / webpack 配置阅读、element-ui——学员上班就要读这些代码
2. **新技术主线与公司新项目形态对齐**：Vue 3 + Vite + Pinia + TS + Composition API
3. **部署课按公司真实形态教**：多环境 env → 构建产物 → nginx → Docker 多阶段 → 再加现代 CI/CD 对照
4. **依赖课覆盖**：镜像源、semver、锁文件、本地 tgz / 私有包、native 依赖的坑
