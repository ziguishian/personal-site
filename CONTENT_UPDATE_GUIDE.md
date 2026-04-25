# 内容更新手册

这个项目已经重构为“静态页面骨架 + 运行时内容读取”。页面设计、导航、主题、Three.js 动效仍由 Astro 打包生成；作品、文章、动态、实验室项目从 `/content` 目录读取，所以打包部署后也可以直接更新内容。

## 一、目录关系

开发环境内容源：

```txt
public/content/
  works/
    index.zh.json
    index.en.json
    lingju.zh.md
    lingju.en.md
  thinking/
    index.zh.json
    index.en.json
    system-thinking.zh.md
    system-thinking.en.md
  live/
    index.zh.json
    index.en.json
    update-001.zh.md
    update-001.en.md
  lab/
    index.zh.json
    index.en.json
    prompt-lab.zh.md
    prompt-lab.en.md
```

打包后会复制到：

```txt
dist/content/
```

线上临时更新可以直接改 `dist/content`。但如果之后还会重新 build，记得把线上内容同步回 `public/content`，否则重新打包会覆盖 `dist/content`。

## 二、更新内容的基本规则

每一条内容由两部分组成：

- `index.zh.json` / `index.en.json`：列表索引，控制标题、摘要、封面、标签、日期、状态、进度、是否精选。
- `xxx.zh.md` / `xxx.en.md`：正文 Markdown，控制详情页正文。

新增内容时必须同时做两件事：

1. 新增一个 Markdown 文件。
2. 在对应语言的 `index.xx.json` 里新增一条记录。

只新增 Markdown，页面不会自动发现它；只改 JSON，但 `file` 指向的 Markdown 不存在，详情页会没有正文。

## 三、运行时详情 URL

为了让打包后新增内容也可以访问，未来新增作品和文章建议使用：

```txt
/works?slug=lingju
/thinking?slug=system-thinking
/en/works?slug=lingju
/en/thinking?slug=system-thinking
```

旧的 `/works/lingju`、`/thinking/system-thinking` 仍然兼容已有内容，但静态站点在打包后不能自动生成新的 `/works/new-slug` 页面，所以新增内容统一用 `?slug=` 更稳。

## 四、新增一篇 Thinking 文章

假设要新增文章：

```txt
标题：AI 创造力工作流
slug：ai-creative-workflow
语言：中文
```

### 1. 新增正文

开发环境：

```txt
public/content/thinking/ai-creative-workflow.zh.md
```

打包后线上更新：

```txt
dist/content/thinking/ai-creative-workflow.zh.md
```

示例：

```md
AI 创造力工作流不是把工具串起来，而是重新设计从想法到产出的路径。

> 好的 AI 工作流，应该减少人的摩擦，而不是增加人的管理负担。

## 第一阶段：捕捉

把灵感、问题、素材和上下文先放进同一个系统。

## 第二阶段：生成

- 让 AI 生成多个方向
- 保留人的判断
- 把结果沉淀成可复用模板

![工作流示意图](/images/thinking/ai-creative-workflow/flow.svg)
```

### 2. 更新索引

打开：

```txt
public/content/thinking/index.zh.json
```

或线上：

```txt
dist/content/thinking/index.zh.json
```

新增一条：

```json
{
  "title": "AI 创造力工作流",
  "slug": "ai-creative-workflow",
  "lang": "zh",
  "description": "从想法到产出，重新设计 AI 原生创作流程。",
  "date": "2026-04-26",
  "cover": "/images/thinking/ai-creative-workflow/cover.svg",
  "category": "Method",
  "tags": ["AI Native", "Creativity", "Workflow"],
  "readingTime": "7 min",
  "series": "AI Native",
  "featured": true,
  "draft": false,
  "file": "/content/thinking/ai-creative-workflow.zh.md"
}
```

### 3. 访问

```txt
/thinking?slug=ai-creative-workflow
```

英文版则新建：

```txt
public/content/thinking/ai-creative-workflow.en.md
```

并更新：

```txt
public/content/thinking/index.en.json
```

## 五、新增一个 Works 作品

### 1. 新增正文

```txt
public/content/works/my-product.zh.md
```

示例：

```md
## Context / 为什么做

这个项目希望解决创作者从灵感到发布之间的断裂。

## Process / 如何做

我把流程拆成输入、理解、生成、编辑、发布五个部分。

## System / 系统结构

- Inspiration Capture
- Asset Memory
- Generation Flow
- Publishing Pipeline

## Result / 结果

完成了核心概念验证，并进入产品化设计。

## Reflection / 反思

AI 产品的重点不是展示模型能力，而是帮助用户更快进入创造状态。
```

### 2. 更新索引

打开：

```txt
public/content/works/index.zh.json
```

新增：

```json
{
  "title": "我的新产品",
  "slug": "my-product",
  "lang": "zh",
  "description": "一个 AI 原生创作工具。",
  "date": "2026-04-26",
  "updated": "2026-04-26",
  "cover": "/images/works/my-product/cover.svg",
  "ogImage": "/images/works/my-product/og.svg",
  "category": "AI Product",
  "tags": ["AIGC", "Product Design"],
  "status": "building",
  "progress": 35,
  "featured": true,
  "draft": false,
  "role": "Founder / Product Designer / Developer",
  "year": "2026",
  "link": "https://example.com",
  "github": "https://github.com/example",
  "file": "/content/works/my-product.zh.md"
}
```

访问：

```txt
/works?slug=my-product
```

## 六、新增 Live 动态

正文：

```txt
public/content/live/update-002.zh.md
```

```md
本周主要完成了知识库结构的重新设计，并开始验证多轮创作流程。
```

索引：

```txt
public/content/live/index.zh.json
```

新增：

```json
{
  "title": "知识体系体验继续优化",
  "slug": "update-002",
  "lang": "zh",
  "description": "围绕输入、整理、输出重新设计知识流。",
  "date": "2026-04-26",
  "tags": ["Product"],
  "type": "Product",
  "related": "/works?slug=shian-ai",
  "featured": true,
  "draft": false,
  "file": "/content/live/update-002.zh.md"
}
```

`type` 建议使用：

```txt
Product / Writing / Learning / Company / Personal
```

## 七、新增 Lab 实验

正文：

```txt
public/content/lab/agent-playground.zh.md
```

索引：

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
  "cover": "/images/lab/agent-playground.svg",
  "tags": ["Agent", "Experiment"],
  "status": "experimental",
  "featured": true,
  "draft": false,
  "experimental": true,
  "link": "#",
  "file": "/content/lab/agent-playground.zh.md"
}
```

## 八、正文中插入图片

图片放在：

```txt
public/images/
```

打包后对应：

```txt
dist/images/
```

推荐路径：

```txt
public/images/works/my-product/system.svg
public/images/thinking/ai-creative-workflow/flow.svg
```

Markdown 写法：

```md
![系统结构图](/images/works/my-product/system.svg)
```

如果配置了：

```env
PUBLIC_ASSET_BASE_URL=https://your-oss-cdn.com
```

运行时图片会自动拼接 CDN 地址。

## 九、字段说明

通用字段：

```txt
title        标题
slug         唯一标识，用于 ?slug=
lang         zh 或 en
description  摘要
date         发布日期
updated      更新日期，可选
cover        封面图，可选
tags         标签数组
featured     是否首页精选
draft        是否隐藏
file         Markdown 正文路径
```

作品额外字段：

```txt
category     分类，例如 AI Product / Design / Writing / System / Lab
status       状态，例如 building / ongoing / shipped
progress     进度数字，0-100
role         你的角色
year         年份
link         外部链接，可选
github       GitHub 链接，可选
```

文章额外字段：

```txt
readingTime  阅读时间
series       系列名，可选
category     分类，可选
```

动态额外字段：

```txt
type         Product / Writing / Learning / Company / Personal
related      相关链接
```

实验室额外字段：

```txt
status        experimental / building / archived
experimental  true 或 false
link          demo 链接，可选
```

## 十、哪些情况不需要重新打包

不需要重新打包：

- 新增或修改 Markdown 正文。
- 更新 `index.zh.json` / `index.en.json`。
- 替换 `dist/images` 里的图片。
- 修改标题、摘要、标签、封面、状态、进度。

需要重新打包：

- 修改页面布局。
- 修改样式或字体。
- 修改 Three.js 动效。
- 修改 Header / Footer / 主题切换。
- 修改 RSS、sitemap、SEO 生成逻辑。
- 新增一种全新的内容类型。

## 十一、JSON 常见错误

错误：

```json
{
  "title": "文章 A",
}
```

正确：

```json
{
  "title": "文章 A"
}
```

错误：

```json
{
  "tags": "AI Native"
}
```

正确：

```json
{
  "tags": ["AI Native"]
}
```

## 十二、当前方案的取舍

优点：

- 打包后可以直接更新内容。
- 不需要数据库。
- 不需要后台。
- GitHub Pages / 阿里云 OSS 都能部署。
- 内容维护成本低。

取舍：

- 新增详情页使用 `?slug=`，不是纯 `/works/xxx`。
- 新增内容不会自动进入构建时生成的 RSS 和 sitemap。
- 如果你非常重视单篇文章 SEO，建议定期把 `dist/content` 同步回 `public/content` 后重新 build 一次。
