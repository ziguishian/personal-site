# 部署与维护手册

这份文档说明如何构建、部署、配置错误页、配置 OSS/CDN，以及如何在上线后维护内容。

## 一、构建

在项目根目录执行：

```bash
npm install
npm run build
```

构建成功后会生成：

```txt
dist/
```

部署时只上传 `dist/` 里的内容。

## 二、部署到阿里云 OSS

### 1. 构建项目

```bash
npm run build
```

### 2. 上传 dist

把 `dist/` 内所有文件上传到 OSS Bucket 根目录。

注意：上传的是 `dist` 里面的文件，不是把 `dist` 文件夹作为一个子目录上传。

正确：

```txt
Bucket Root/
  index.html
  404.html
  _astro/
  content/
  images/
```

错误：

```txt
Bucket Root/
  dist/
    index.html
```

### 3. 设置默认首页

在 OSS 静态网站托管设置中：

```txt
默认首页：index.html
```

### 4. 设置 404 页面

```txt
默认 404 页：404.html
```

### 5. 绑定域名

将你的域名，例如：

```txt
alexi.tech
```

绑定到 OSS Bucket 或 CDN。

如果使用 CDN，建议开启：

- HTTPS
- Brotli / Gzip
- HTTP/2 或 HTTP/3
- 静态资源缓存

## 三、部署到 GitHub Pages

### 方式一：只提交源码，让 GitHub Actions 构建

推荐长期使用这种方式。

流程：

1. 推送源码到 GitHub。
2. GitHub Actions 执行 `npm install` 和 `npm run build`。
3. 发布 `dist/`。

### 方式二：直接上传 dist

如果你只想上传构建产物，可以把 `dist/` 内容放到 GitHub Pages 指定分支。

注意：

- GitHub Pages 会自动识别根目录的 `404.html`。
- 自定义域名需要在 Pages 设置中绑定。
- 如果使用根域名，请配置 DNS。

## 四、部署到 Nginx

示例配置：

```nginx
server {
  listen 80;
  server_name alexi.tech www.alexi.tech;

  root /var/www/alexi-tech;
  index index.html;

  location / {
    try_files $uri $uri/ /404.html;
  }

  error_page 403 /403/;
  error_page 404 /404.html;
  error_page 500 502 503 504 /500.html;

  location ~* \.(js|css|png|jpg|jpeg|gif|svg|webp|ico|woff2)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
  }
}
```

## 五、错误页映射

项目已生成：

```txt
dist/404.html
dist/403/index.html
dist/500.html
dist/error/index.html
dist/offline/index.html
```

建议映射：

```txt
404 Not Found -> /404.html
403 Forbidden -> /403/
500 Server Error -> /500.html
Unknown Error -> /error/
Offline -> /offline/
```

不同平台名称不同，但目标路径一致。

## 六、环境变量

`.env.example`：

```env
PUBLIC_SITE_URL=https://ziguishian.com
PUBLIC_ASSET_BASE_URL=https://your-oss-cdn.com
```

### PUBLIC_SITE_URL

用于：

- canonical
- sitemap
- RSS
- Open Graph URL

生产建议设置成最终域名：

```env
PUBLIC_SITE_URL=https://alexi.tech
```

### PUBLIC_ASSET_BASE_URL

用于将图片路径切换到 CDN。

本地开发：

```env
PUBLIC_ASSET_BASE_URL=
```

生产 CDN：

```env
PUBLIC_ASSET_BASE_URL=https://cdn.alexi.tech
```

如果 Markdown 中写：

```md
![封面](/images/works/lingju/cover.jpg)
```

生产显示时会变成：

```txt
https://cdn.alexi.tech/images/works/lingju/cover.jpg
```

## 七、缓存建议

### 可以长缓存

```txt
/_astro/*
/images/*
/icons/*
/models/*
/textures/*
```

建议：

```txt
Cache-Control: public, max-age=31536000, immutable
```

### 不建议长缓存

```txt
/content/*
/index.html
/404.html
/rss.xml
/sitemap-index.xml
```

因为 `/content` 是运行时内容，可能在不重新打包的情况下更新。

建议：

```txt
Cache-Control: no-cache
```

## 八、上线前检查

上线前建议检查：

- `npm run build` 是否成功。
- `dist/index.html` 是否存在。
- `dist/404.html` 是否存在。
- `dist/content` 是否包含最新内容。
- 微信分享图是否能公网访问。
- 备案号是否显示在 Footer。
- light / dark / system 是否正常。
- iPhone Safari 顶部状态栏是否和页面融合。
- 文章代码块是否有高亮和复制按钮。
- `/works?slug=xxx`、`/thinking?slug=xxx`、`/lab?slug=xxx` 是否可访问。

## 九、上线后内容维护

如果只改内容，可以直接更新服务器上的：

```txt
dist/content/
```

但要注意：

如果以后重新执行 `npm run build` 并上传新的 `dist/`，服务器上的临时内容会被覆盖。

所以建议：

1. 线上紧急更新可以直接改 `dist/content`。
2. 更新后同步回本地 `public/content`。
3. 再提交到 GitHub。

## 十、推荐发布流程

```txt
修改源码或内容
  -> npm run content:check
  -> npm run build
  -> 本地预览
  -> 上传 dist
  -> 检查线上页面
```

如果只是线上临时内容更新：

```txt
上传 Markdown 到 dist/content
  -> 更新 index.json
  -> 刷新页面
  -> 同步回 public/content
```
