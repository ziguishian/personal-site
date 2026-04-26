# Zi Gui Shi An Personal Site

一个可长期维护的个人数字空间，使用 Astro + TypeScript + Tailwind CSS + Three.js 构建。

它不是普通简历页，而是用于展示作品、思考、动态、实验、方法论和个人世界观的静态网站。项目支持中英文、light / dark / system 主题、运行时 Markdown 内容读取、OSS/CDN 图片地址切换、RSS、sitemap 和多种容错页面。

<img width="1590" height="1042" alt="image" src="https://github.com/user-attachments/assets/3b2940de-a51d-456f-8446-0cca33b9264b" />
<img width="1590" height="1042" alt="image" src="https://github.com/user-attachments/assets/2ce9e86b-87cb-4707-a1a5-11e51e7d6f84" />



## 技术栈

- Astro
- TypeScript
- Tailwind CSS
- Three.js
- @astrojs/sitemap
- @astrojs/rss
- lucide-astro
- Astro Content Collections
- 运行时 Markdown / JSON 内容系统

## 快速运行

```bash
npm install
npm run dev
```

开发服务默认运行在：

```txt
http://localhost:4321
```

生产构建：

```bash
npm run build
```

构建产物输出到：

```txt
dist/
```

部署时只需要上传 `dist/` 里的内容。

## 常用命令

```bash
# 启动开发服务
npm run dev

# 类型检查 + 生产构建
npm run build

# 检查运行时内容索引和 Markdown 文件关系
npm run content:check

# 本地预览生产产物
npm run preview
```

## 项目结构

```txt
public/
  content/              # 运行时内容，打包后会复制到 dist/content
  images/               # 图片资源
  icons/                # favicon / 图标
  models/
  textures/

src/
  components/
    layout/             # Header / Footer / Theme / Language
    pages/              # 页面级组件
    three/              # Three.js 视觉组件
    ui/                 # 通用 UI 组件
  content/              # Astro 构建期内容集合
  layouts/              # BaseLayout / ArticleLayout / WorkLayout / LabLayout
  pages/                # Astro 路由
  styles/               # 全局样式和主题变量
  utils/                # i18n / assets / seo / runtime content / theme

docs/                   # 部署、维护、内容更新文档
dist/                   # 构建输出，不提交源码管理
```

## 内容系统

项目同时支持两类内容：

1. **构建期内容**
   来自 `src/content`，会在 `npm run build` 时生成静态页面，SEO 更好。

2. **运行时内容**
   来自 `public/content`，打包后复制到 `dist/content`。部署后可以直接新增或修改 Markdown 与 JSON，不需要重新打包。

运行时内容适合：

- 临时新增文章
- 更新作品进度
- 发布 Build in Public 动态
- 添加实验室项目
- 在服务器上直接维护内容

详细教程见：

- [动态内容更新手册](./docs/RUNTIME_CONTENT_UPDATE.md)
- [内容更新手册](./CONTENT_UPDATE_GUIDE.md)

## 运行时内容目录

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
  lab/
    index.zh.json
    index.en.json
```

打包后对应：

```txt
dist/content/
```

## 新增内容的核心规则

每一条运行时内容由两部分组成：

```txt
Markdown 正文文件 + index 里的 JSON 记录
```

例如新增一篇文章：

```txt
public/content/thinking/my-article.zh.md
```

同时更新：

```txt
public/content/thinking/index.zh.json
```

JSON 里的 `file` 必须指向 Markdown：

```json
{
  "title": "我的文章",
  "slug": "my-article",
  "lang": "zh",
  "description": "文章摘要",
  "date": "2026-04-26",
  "tags": ["AI", "Creation"],
  "readingTime": "6 min",
  "featured": true,
  "draft": false,
  "file": "/content/thinking/my-article.zh.md"
}
```

访问：

```txt
/thinking?slug=my-article
```

## 路由说明

主要页面：

```txt
/                  中文首页
/en                英文首页
/works             作品
/thinking          思考
/about             关于
/live              动态
/lab               实验室
/system            方法论
/manifesto         宣言
/universe          我的宇宙
```

运行时详情页：

```txt
/works?slug=lingju
/thinking?slug=system-thinking
/lab?slug=prompt-lab
/en/works?slug=lingju
/en/thinking?slug=system-thinking
/en/lab?slug=prompt-lab
```

兼容的构建期详情页：

```txt
/works/lingju
/thinking/system-thinking
/lab/prompt-lab
```

注意：部署后如果直接新增 Markdown，不会自动生成新的 `/works/new-slug` 静态目录，所以新增内容推荐使用 `?slug=` 形式。

## 图片与 CDN

图片统一放在：

```txt
public/images/
```

推荐结构：

```txt
public/images/
  works/project-slug/cover.jpg
  thinking/article-slug/cover.jpg
  about/portrait.jpg
  og/wechat-share.jpg
```

内容里使用以 `/images/...` 开头的绝对路径：

```md
![图片说明](/images/thinking/my-article/diagram.jpg)
```

如果生产环境图片放在 OSS/CDN，配置：

```env
PUBLIC_SITE_URL=https://alexi.tech
PUBLIC_ASSET_BASE_URL=https://your-oss-cdn.com
```

组件和运行时 Markdown 图片会自动拼接 CDN 前缀。

## 环境变量

复制示例文件：

```bash
cp .env.example .env
```

当前支持：

```env
PUBLIC_SITE_URL=https://ziguishian.com
PUBLIC_ASSET_BASE_URL=https://your-oss-cdn.com
```

说明：

- `PUBLIC_SITE_URL`：站点 canonical、sitemap、RSS、OG URL 的基础域名。
- `PUBLIC_ASSET_BASE_URL`：图片 CDN 前缀。本地为空即可，生产可以填 OSS CDN 地址。

## SEO 与分享

项目已支持：

- title / description
- canonical
- Open Graph
- Twitter Card
- 微信分享图兜底
- sitemap
- RSS
- noindex 错误页

默认分享图：

```txt
public/images/og/wechat-share.jpg
```

上线前请确认该图片真实存在、可以公网访问、尺寸建议 800x800 或 1200x630。

## 容错页面

项目已内置：

```txt
/404.html
/403/
/500.html
/error/
/offline/
```

部署时可以在服务器或 OSS 控制台中映射：

- 404 页面：`/404.html`
- 403 页面：`/403/`
- 500 页面：`/500.html`
- 通用异常：`/error/`
- 离线兜底：`/offline/`

详细配置见：

- [部署与维护手册](./docs/DEPLOYMENT_AND_MAINTENANCE.md)

## 部署

构建：

```bash
npm run build
```

上传：

```txt
dist/
```

可以部署到：

- 阿里云 OSS
- GitHub Pages
- Nginx
- Vercel / Netlify
- 任意静态服务

详细步骤见：

- [部署与维护手册](./docs/DEPLOYMENT_AND_MAINTENANCE.md)

## 推荐维护流程

日常内容更新：

1. 修改 `public/content`。
2. 运行 `npm run content:check`。
3. 本地 `npm run dev` 查看。
4. 需要重新发布整个站点时运行 `npm run build`。
5. 上传 `dist/`。

线上临时内容更新：

1. 直接修改服务器上的 `dist/content`。
2. 新增 Markdown。
3. 更新对应 `index.zh.json` / `index.en.json`。
4. 刷新页面查看。
5. 记得把线上内容同步回仓库的 `public/content`。

## 真机检查清单

上线前建议检查：

- iPhone Safari 顶部状态栏颜色是否融入页面。
- 移动端 Header 品牌标识隐藏是否自然。
- 首页 Three.js 是否遮挡文字。
- light / dark / system 切换是否正常。
- 文章代码块是否有高亮和复制按钮。
- 微信分享图是否出现。
- 404 页面是否被服务器正确命中。

## 相关文档

- [动态内容更新手册](./docs/RUNTIME_CONTENT_UPDATE.md)
- [部署与维护手册](./docs/DEPLOYMENT_AND_MAINTENANCE.md)
- [图片替换手册](./docs/IMAGE_REPLACEMENT_GUIDE.md)
- [内容更新手册](./CONTENT_UPDATE_GUIDE.md)
