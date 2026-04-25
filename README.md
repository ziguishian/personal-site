# Zi Gui Shi An Personal Site

一个可长期维护的静态个人官网，使用 Astro + TypeScript + Tailwind CSS + Three.js。页面静态构建，作品、文章、动态、实验室内容支持运行时从 `/content` 读取，支持中英文、light / dark / system 主题和 OSS CDN 图片地址切换。

## 运行

```bash
npm install
npm run dev
```

开发服务默认在 `http://localhost:4321`。构建静态产物：

```bash
npm run build
```

构建结果会输出到 `dist/`，可以部署到阿里云 OSS、GitHub Pages 或任意静态服务。

## 内容更新

运行时内容放在 `public/content`，打包后会复制到 `dist/content`。部署后可以直接在 `dist/content` 新增 Markdown 并更新对应 `index.zh.json` / `index.en.json`，无需为了内容更新重新打包。

详细说明见：[CONTENT_UPDATE_GUIDE.md](./CONTENT_UPDATE_GUIDE.md)。

## 新增文章

推荐在 `public/content/thinking/` 新增 Markdown，并更新 `public/content/thinking/index.zh.json`：

```md
---
title: "文章标题"
slug: "article-slug"
lang: "zh"
description: "文章摘要"
date: "2026-04-24"
tags: ["AI Native", "Creation"]
readingTime: "6 min"
featured: false
draft: false
---

正文内容。
```

英文版使用同一个 `slug`，文件名建议 `article-slug.en.md`，并更新 `index.en.json`。打包后也可以直接修改 `dist/content/thinking`。

## 新增作品

推荐在 `public/content/works/` 新增 Markdown，并更新 `public/content/works/index.zh.json`：

```md
---
title: "作品标题"
slug: "work-slug"
lang: "zh"
description: "作品描述"
date: "2026-04-24"
cover: "/images/works/work-slug/cover.jpg"
category: "AI Product"
tags: ["AIGC", "Product Design"]
status: "building"
progress: 65
featured: true
draft: false
role: "Founder / Product Designer / Developer"
year: "2026"
---

## Context / 为什么做

项目背景。
```

图片放在 `public/images/works/work-slug/`，索引和 Markdown 里写以 `/images/...` 开头的路径。

## 配置 OSS CDN

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

本地开发可以把 `PUBLIC_ASSET_BASE_URL` 留空。生产环境如果图片已上传到 OSS CDN：

```env
PUBLIC_SITE_URL=https://ziguishian.com
PUBLIC_ASSET_BASE_URL=https://your-oss-cdn.com
```

所有通过组件渲染的图片会经过 `src/utils/assets.ts` 的 `getAssetUrl()` 转换。

## 内容结构

- `public/content/works`：运行时作品
- `public/content/thinking`：运行时文章与方法论
- `public/content/live`：运行时 Build in Public 动态
- `public/content/lab`：运行时实验室项目
- `src/content`：保留给构建时兼容页面和 RSS/sitemap 的内容源

## 路由

- `/`：中文首页
- `/en`：英文首页
- `/zh`：中文首页别名
- `/works`、`/thinking`：中文列表
- `/en/works`、`/en/thinking`：英文列表
- `/works?slug=xxx`、`/thinking?slug=xxx`：运行时中文详情，适合打包后新增内容
- `/en/works?slug=xxx`、`/en/thinking?slug=xxx`：运行时英文详情，适合打包后新增内容
- `/works/[slug]`、`/thinking/[slug]`：构建时兼容详情

## 主题与动效

主题默认跟随系统，用户选择会存入 `localStorage`。首页与 Universe 页面使用 Three.js 渲染宇宙星辰动效，并会根据 light / dark 主题切换材质颜色。
