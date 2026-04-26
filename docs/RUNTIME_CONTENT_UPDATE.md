# 动态文章、作品、动态和实验室更新手册

这份文档专门说明：网站打包上线后，如何不重新构建，直接通过 Markdown 和 JSON 更新页面内容。

## 一、核心机制

网站页面骨架由 Astro 构建生成，内容由浏览器运行时读取：

```txt
/content/works/index.zh.json
/content/thinking/index.zh.json
/content/live/index.zh.json
/content/lab/index.zh.json
```

每个列表页会读取对应 `index`，再根据 `file` 字段读取 Markdown 正文。

所以新增内容必须同时更新：

```txt
1. Markdown 正文文件
2. index.zh.json 或 index.en.json
```

只新增 Markdown 不会出现在列表里。

只新增 JSON 但 `file` 写错，详情页会没有正文。

## 二、线上更新位置

如果已经打包并部署，你需要更新服务器上的：

```txt
dist/content/
```

例如线上目录：

```txt
dist/content/thinking/
dist/content/works/
dist/content/live/
dist/content/lab/
```

如果是在源码里维护，则更新：

```txt
public/content/
```

两者结构完全一致。

## 三、强烈建议的更新流程

### 推荐流程

```txt
先改 public/content
  -> npm run content:check
  -> npm run dev 本地预览
  -> npm run build
  -> 上传 dist
```

### 线上快速更新流程

```txt
直接改 dist/content
  -> 上传 Markdown
  -> 修改 index.json
  -> 刷新页面
  -> 把这次更新同步回 public/content
```

如果不同步回 `public/content`，下次重新打包会覆盖线上新增内容。

## 四、URL 规则

运行时详情页统一使用：

```txt
/works?slug=作品-slug
/thinking?slug=文章-slug
/lab?slug=实验-slug
```

英文：

```txt
/en/works?slug=作品-slug
/en/thinking?slug=文章-slug
/en/lab?slug=实验-slug
```

Live 动态目前主要展示列表，不强调详情页。

## 五、新增 Thinking 文章

假设新增：

```txt
标题：AI 创作系统
slug：ai-creation-system
语言：中文
```

### 1. 新增 Markdown

路径：

```txt
public/content/thinking/ai-creation-system.zh.md
```

线上直接更新则是：

```txt
dist/content/thinking/ai-creation-system.zh.md
```

正文示例：

````md
AI 创作系统不是工具列表，而是一套从输入、理解、生成到沉淀的循环。

> 系统的价值，不是替代人，而是让人的判断力被放大。

## 输入

- 灵感
- 素材
- 约束
- 目标

## 生成

用 AI 生成多个方向，再由人进行选择、组合和修正。

## 示例代码

```ts
type CreationNode = {
  input: string;
  context: string[];
  output: string;
};
```

## 图片示例

![AI 创作系统结构](/images/thinking/ai-creation-system/system.jpg)
````

### 2. 更新中文索引

打开：

```txt
public/content/thinking/index.zh.json
```

或线上：

```txt
dist/content/thinking/index.zh.json
```

在数组里新增一项：

```json
{
  "title": "AI 创作系统",
  "slug": "ai-creation-system",
  "lang": "zh",
  "description": "从输入、生成到沉淀，搭建一套 AI 原生创作循环。",
  "date": "2026-04-26",
  "updated": "2026-04-26",
  "cover": "/images/thinking/ai-creation-system/cover.jpg",
  "ogImage": "/images/thinking/ai-creation-system/og.jpg",
  "category": "Method",
  "tags": ["AI Native", "Creation", "System"],
  "readingTime": "7 min",
  "series": "AI Native",
  "featured": true,
  "draft": false,
  "file": "/content/thinking/ai-creation-system.zh.md"
}
```

### 3. 访问

```txt
/thinking?slug=ai-creation-system
```

## 六、新增英文 Thinking 文章

新增：

```txt
public/content/thinking/ai-creation-system.en.md
```

更新：

```txt
public/content/thinking/index.en.json
```

英文索引示例：

```json
{
  "title": "AI Creation System",
  "slug": "ai-creation-system",
  "lang": "en",
  "description": "A loop from input and generation to durable creative memory.",
  "date": "2026-04-26",
  "updated": "2026-04-26",
  "cover": "/images/thinking/ai-creation-system/cover.jpg",
  "ogImage": "/images/thinking/ai-creation-system/og.jpg",
  "category": "Method",
  "tags": ["AI Native", "Creation", "System"],
  "readingTime": "7 min",
  "series": "AI Native",
  "featured": true,
  "draft": false,
  "file": "/content/thinking/ai-creation-system.en.md"
}
```

访问：

```txt
/en/thinking?slug=ai-creation-system
```

## 七、新增 Works 作品

假设新增：

```txt
标题：新一代 AI 助手
slug：next-ai-assistant
```

### 1. 新增 Markdown

```txt
public/content/works/next-ai-assistant.zh.md
```

示例：

````md
## Context / 为什么做

我希望构建一个真正理解个人上下文的 AI 助手，而不是一个只会回答问题的聊天框。

## Process / 如何做

- 设计知识输入流程
- 搭建长期记忆结构
- 定义任务编排系统
- 验证真实创作场景

## System / 系统结构

```ts
type AssistantSystem = {
  memory: string[];
  tools: string[];
  workflows: string[];
};
```

## Result / 结果

完成核心原型，正在验证知识管理和创作辅助场景。

## Reflection / 反思

AI 助手的关键不是聪明，而是可靠、可控、可积累。

![产品界面](/images/works/next-ai-assistant/interface.jpg)
````

### 2. 更新 Works 索引

```txt
public/content/works/index.zh.json
```

新增：

```json
{
  "title": "新一代 AI 助手",
  "slug": "next-ai-assistant",
  "lang": "zh",
  "description": "一个理解个人上下文、帮助持续创作的 AI 助手。",
  "date": "2026-04-26",
  "updated": "2026-04-26",
  "cover": "/images/works/next-ai-assistant/cover.jpg",
  "ogImage": "/images/works/next-ai-assistant/og.jpg",
  "category": "AI Product",
  "tags": ["AI Assistant", "Knowledge", "Product Design"],
  "status": "building",
  "progress": 45,
  "featured": true,
  "draft": false,
  "role": "Founder / Product Designer / Developer",
  "year": "2026",
  "link": "https://example.com",
  "github": "https://github.com/example",
  "file": "/content/works/next-ai-assistant.zh.md"
}
```

### 3. 访问

```txt
/works?slug=next-ai-assistant
```

## 八、新增 Live 动态

Live 动态适合记录：

- 产品进度
- 写作进度
- 学习记录
- 公司进展
- 个人状态

### 1. 新增 Markdown

```txt
public/content/live/update-2026-04-26.zh.md
```

示例：

```md
今天完成了个人网站内容系统的重构，后续可以直接在打包产物中更新 Markdown。
```

### 2. 更新 Live 索引

```txt
public/content/live/index.zh.json
```

新增：

```json
{
  "title": "个人网站内容系统完成重构",
  "slug": "update-2026-04-26",
  "lang": "zh",
  "description": "现在文章、作品、动态和实验可以通过运行时 Markdown 更新。",
  "date": "2026-04-26",
  "tags": ["Product", "Website"],
  "type": "Product",
  "related": "/works?slug=shian-ai",
  "featured": true,
  "draft": false,
  "file": "/content/live/update-2026-04-26.zh.md"
}
```

### 3. type 建议

```txt
Product
Writing
Learning
Company
Personal
```

## 九、新增 Lab 实验

### 1. 新增 Markdown

```txt
public/content/lab/agent-playground.zh.md
```

示例：

````md
## 实验目标

验证一个轻量 Agent 工作流是否能帮助我快速拆解产品想法。

## 当前状态

- 完成 Prompt 流程设计
- 正在验证多轮任务拆解
- 尚未产品化

## 示例

```ts
const experiment = {
  name: 'Agent Playground',
  status: 'experimental'
};
```
````

### 2. 更新 Lab 索引

```txt
public/content/lab/index.zh.json
```

新增：

```json
{
  "title": "Agent Playground",
  "slug": "agent-playground",
  "lang": "zh",
  "description": "用于验证 AI Agent 工作流的小实验。",
  "date": "2026-04-26",
  "cover": "/images/lab/agent-playground/cover.jpg",
  "tags": ["Agent", "Experiment"],
  "status": "experimental",
  "featured": true,
  "draft": false,
  "experimental": true,
  "link": "#",
  "file": "/content/lab/agent-playground.zh.md"
}
```

访问：

```txt
/lab?slug=agent-playground
```

## 十、图片怎么放

图片放到：

```txt
public/images/
```

推荐结构：

```txt
public/images/
  thinking/ai-creation-system/cover.jpg
  thinking/ai-creation-system/system.jpg
  works/next-ai-assistant/cover.jpg
  works/next-ai-assistant/interface.jpg
  lab/agent-playground/cover.jpg
```

Markdown 中使用：

```md
![图片说明](/images/thinking/ai-creation-system/system.jpg)
```

不要写相对路径：

```md
![错误示例](./system.jpg)
```

## 十一、字段说明

通用字段：

```txt
title        标题
slug         URL 标识，同一语言内不能重复
lang         zh 或 en
description  摘要
date         发布日期
updated      更新日期
cover        封面图
ogImage      分享图
category     分类
tags         标签
featured     是否精选
draft        是否草稿，true 时不显示
file         Markdown 正文路径
```

Works 额外字段：

```txt
role         你在项目中的角色
year         年份
status       状态
progress     进度，0-100
link         外部链接
github       GitHub 链接
```

Thinking 额外字段：

```txt
readingTime  阅读时间
series       系列
```

Live 额外字段：

```txt
type         动态类型
related      关联链接
```

Lab 额外字段：

```txt
experimental 是否实验性
link         实验链接
```

## 十二、常见错误

### 页面列表不显示新内容

检查：

- 是否更新了对应 `index.zh.json` 或 `index.en.json`
- `draft` 是否为 `false`
- JSON 格式是否正确
- `date` 是否有效

### 详情页没有正文

检查：

- `file` 路径是否正确
- Markdown 文件是否存在
- 文件是否上传到了服务器

### 图片不显示

检查：

- 图片是否放在 `public/images` 或 `dist/images`
- Markdown 是否使用 `/images/...`
- 如果使用 CDN，OSS/CDN 是否已有该图片
- `PUBLIC_ASSET_BASE_URL` 是否正确

### 英文页没有内容

如果没有英文 Markdown 和英文 index，系统会尽量 fallback 到中文。但推荐重要内容都维护中英文两份。

## 十三、更新后的检查清单

每次更新后检查：

- 列表页是否出现新内容。
- 点击详情是否正常。
- 图片是否显示。
- 代码块是否有高亮和复制按钮。
- light / dark 模式下是否可读。
- 手机端排版是否正常。
- 中英文页面是否都可访问。
