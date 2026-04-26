# 文档索引

这个目录收纳项目的长期维护文档。

## 推荐阅读顺序

1. [项目 README](../README.md)
   项目总览、运行方式、目录结构、部署入口。

2. [动态内容更新手册](./RUNTIME_CONTENT_UPDATE.md)
   详细说明如何新增和更新文章、作品、动态、实验室项目。适合日常维护内容时阅读。

3. [部署与维护手册](./DEPLOYMENT_AND_MAINTENANCE.md)
   详细说明构建、部署、错误页映射、OSS/CDN、缓存策略和上线检查。

4. [图片替换手册](./IMAGE_REPLACEMENT_GUIDE.md)
   说明首页、作品、文章、关于我、OG 分享图、实验室等所有图片在哪里替换。

5. [内容更新手册](../CONTENT_UPDATE_GUIDE.md)
   原有内容系统说明，保留为完整参考。

## 维护原则

- 内容更新优先改 `public/content`，再构建发布。
- 线上紧急更新可以改 `dist/content`，但必须同步回 `public/content`。
- 重要文章和代表作品建议定期回到源码中构建，保证 SEO 和长期稳定。
- 图片统一放在 `public/images`，Markdown 中使用 `/images/...` 绝对路径。
- 上线前必须检查 404、微信分享图、移动端 Safari、light/dark 主题。
