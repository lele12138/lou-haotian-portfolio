# 楼昊天 · 个人网站

面向 AI 产品、智能硬件与具身智能方向的个人作品集与博客。

**在线访问：** [lou-haotian-portfolio.l6090611.chatgpt.site](https://lou-haotian-portfolio.l6090611.chatgpt.site/)

## 网站内容

- **关于我**：教育背景、能力标签与个人方向
- **经历与作品集**：Insta360、Momenta 经历，以及 FlightSync、ConfigPilot 两个可交互作品
- **工作方法**：进入场景、定义边界、建立验证、推动闭环
- **个人博客**：记录对 Agent 工程、Memory 与产品实践的思考

当前收录文章：

1. [从 ReAct 到 Harness：一个 Agent 是怎样跑起来的](https://lou-haotian-portfolio.l6090611.chatgpt.site/blog/react-to-harness/)
2. [Agent 为什么需要 Memory：从上下文窗口到长期协作](https://lou-haotian-portfolio.l6090611.chatgpt.site/blog/agent-memory/)

## 设计方向

网站以深蓝色技术视觉为主，使用网格、粒子与轨道动效表达“复杂系统中的连接与流动”。信息架构遵循三条原则：

- 首屏快速说明个人定位
- 经历与作品放在同一条叙事链中
- 博客作为独立模块持续更新

同时提供响应式布局与减少动态效果的无障碍适配。

## 技术栈

- Vite
- 原生 JavaScript / CSS
- Three.js
- Motion
- Marked

## 本地运行

需要 Node.js 与 npm。

```bash
npm ci
npm run dev
```

构建生产版本：

```bash
npm run build
npm run preview
```

生产文件输出到 `dist/`。

## 内容维护

```text
.
├── src/
│   ├── main.js                 # 首页结构与内容
│   ├── style.css               # 首页视觉与响应式样式
│   ├── article.js              # 博客文章渲染
│   ├── article.css             # 博客页面样式
│   └── content/
│       ├── react-to-harness.md
│       └── agent-memory.md
├── blog/                       # 各文章入口页
├── public/favicon.svg
├── deploy/                     # 静态服务器部署示例
└── vite.config.js
```

新增博客时，需要在 `src/content/` 中加入 Markdown 内容，并补充对应的文章入口与首页卡片。

## 部署

当前版本发布在 ChatGPT Sites。项目也可以作为普通静态站部署到 Nginx、OpenResty、OnePanel 或其他支持 `dist/` 目录的平台。

## 关联作品

- [FlightSync · 飞行问题复盘](https://flightsync-review.l6090611.chatgpt.site/)
- [ConfigPilot · 车辆配置 Agent 实验室](https://configpilot-agent-lab-20261006.l6090611.chatgpt.site/)

## 说明

仓库只包含网站公开内容，不包含简历原件、私有资料或真实企业数据。页面中的经历与指标以已公开并核实的信息为准。
