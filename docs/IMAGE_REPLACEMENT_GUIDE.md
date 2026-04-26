# 图片替换手册

这份文档说明网站中每一类图片在哪里替换、怎么替换，以及推荐尺寸。

## 一、总原则

所有图片统一放在：

```txt
public/images/
```

打包后会复制到：

```txt
dist/images/
```

Markdown、JSON、组件里都使用以 `/images/...` 开头的路径，例如：

```txt
/images/works/lingju/cover.jpg
```

不要使用：

```txt
./cover.jpg
../images/cover.jpg
```

## 二、当前图片总览

当前项目已有图片：

```txt
public/images/about/portrait.svg
public/images/lab/prompt-lab.svg
public/images/og/default.svg
public/images/og/wechat-share.jpg
public/images/thinking/system.svg
public/images/works/compound-practice/cover.svg
public/images/works/lingju/cover.svg
public/images/works/shian-ai/cover.svg
```

## 三、首页 Hero 右侧宇宙图

首页首屏右侧不是图片，而是 Three.js 动效。

相关文件：

```txt
src/components/three/UniverseHero.astro
src/components/three/OrbitalSystem.ts
src/components/pages/HomePage.astro
```

如果只是替换普通图片，不需要动这里。

如果要把 Three.js 换成静态图，需要改：

```txt
src/components/pages/HomePage.astro
```

找到：

```astro
<UniverseHero />
```

替换为普通图片组件即可。但目前不建议替换，因为首页视觉系统依赖这个轨道动效。

## 四、首页精选项目三张卡片

首页精选项目列表和下方滚动堆叠大图都使用作品封面。

当前堆叠大图写在：

```txt
src/components/pages/HomePage.astro
```

当前路径：

```txt
/images/works/lingju/cover.svg
/images/works/shian-ai/cover.svg
/images/works/compound-practice/cover.svg
```

对应文件：

```txt
public/images/works/lingju/cover.svg
public/images/works/shian-ai/cover.svg
public/images/works/compound-practice/cover.svg
```

### 替换方法一：保持文件名不变

最简单：

1. 准备新图片。
2. 用新图片覆盖原文件。
3. 文件名保持 `cover.svg` 或改成同名格式。

例如替换灵矩绘境封面：

```txt
public/images/works/lingju/cover.svg
```

如果你改成 JPG：

```txt
public/images/works/lingju/cover.jpg
```

还需要同步修改所有引用它的地方。

### 替换方法二：改路径

如果你想改成：

```txt
public/images/works/lingju/hero.jpg
```

需要改这些位置：

```txt
src/components/pages/HomePage.astro
public/content/works/index.zh.json
public/content/works/index.en.json
public/content/works/lingju.zh.md
public/content/works/lingju.en.md
src/content/works/lingju.zh.md
src/content/works/lingju.en.md
```

把：

```txt
/images/works/lingju/cover.svg
```

替换为：

```txt
/images/works/lingju/hero.jpg
```

### 推荐尺寸

首页堆叠大图推荐：

```txt
2400 x 1400
或
1920 x 1080
```

建议：

- 横图
- 高对比
- 主体不要太靠边
- 图片底部可以承载白色文字
- JPG / WebP 都可以

## 五、作品列表卡片封面

作品列表来自运行时内容索引：

```txt
public/content/works/index.zh.json
public/content/works/index.en.json
```

字段：

```json
"cover": "/images/works/lingju/cover.svg"
```

替换某个作品卡片封面：

1. 把图片放到：

```txt
public/images/works/作品-slug/cover.jpg
```

2. 修改 `index.zh.json` 和 `index.en.json`：

```json
"cover": "/images/works/作品-slug/cover.jpg"
```

3. 如果有构建期内容，也同步修改：

```txt
src/content/works/作品-slug.zh.md
src/content/works/作品-slug.en.md
```

推荐尺寸：

```txt
1600 x 1000
```

## 六、作品详情页 Hero 图片

作品详情页顶部大图也来自同一个 `cover` 字段。

运行时详情页：

```txt
/works?slug=lingju
```

读取：

```txt
public/content/works/index.zh.json
```

字段：

```json
"cover": "/images/works/lingju/cover.svg"
```

构建期详情页：

```txt
/works/lingju
```

读取：

```txt
src/content/works/lingju.zh.md
```

frontmatter：

```yaml
cover: "/images/works/lingju/cover.svg"
```

如果你希望运行时和构建期显示一致，两个地方都要改。

## 七、Thinking 文章封面与正文图片

Thinking 列表封面来自：

```txt
public/content/thinking/index.zh.json
public/content/thinking/index.en.json
```

字段：

```json
"cover": "/images/thinking/system.svg"
```

当前多篇文章共用：

```txt
public/images/thinking/system.svg
```

### 替换某篇文章封面

建议新建独立目录：

```txt
public/images/thinking/system-thinking/cover.jpg
```

然后修改：

```json
"cover": "/images/thinking/system-thinking/cover.jpg"
```

### 替换正文图片

正文图片在 Markdown 里：

```md
![系统思维图示](/images/thinking/system.svg)
```

替换为：

```md
![系统思维图示](/images/thinking/system-thinking/diagram.jpg)
```

推荐尺寸：

```txt
正文图：1600 x 900
文章封面：1600 x 1000
OG 图：1200 x 630 或 800 x 800
```

## 八、关于我的图片

首页 About 和 About 页面使用同一张图。

当前文件：

```txt
public/images/about/portrait.svg
```

引用位置：

```txt
src/components/pages/HomePage.astro
src/components/pages/SimplePage.astro
```

当前代码：

```astro
src="/images/about/portrait.svg"
```

### 替换方法

最简单：

```txt
public/images/about/portrait.svg
```

用新图片覆盖它。

如果换成 JPG：

```txt
public/images/about/portrait.jpg
```

需要把两个文件里的路径改成：

```astro
src="/images/about/portrait.jpg"
```

推荐尺寸：

```txt
1600 x 1200
或
1200 x 900
```

风格建议：

- 黑白或低饱和
- 背景干净
- 人物不要过度居中
- 留一些负空间

## 九、Lab 实验室封面

运行时 Lab 封面来自：

```txt
public/content/lab/index.zh.json
public/content/lab/index.en.json
```

当前字段：

```json
"cover": "/images/lab/prompt-lab.svg"
```

当前文件：

```txt
public/images/lab/prompt-lab.svg
```

推荐替换为：

```txt
public/images/lab/prompt-lab/cover.jpg
```

然后修改 JSON：

```json
"cover": "/images/lab/prompt-lab/cover.jpg"
```

如果构建期 Lab 内容也要一致，修改：

```txt
src/content/lab/prompt-lab.zh.md
src/content/lab/prompt-lab.en.md
```

## 十、OG / 微信分享图

微信、社交媒体分享图默认使用：

```txt
public/images/og/wechat-share.jpg
```

相关代码：

```txt
src/layouts/BaseLayout.astro
src/utils/seo.ts
```

BaseLayout 中逻辑：

```ts
const shareImagePath = Astro.props.image && !Astro.props.image.endsWith('.svg')
  ? Astro.props.image
  : '/images/og/wechat-share.jpg';
```

意思是：

- 如果页面传入的是 JPG/PNG/WebP，会用页面自己的图。
- 如果页面传入 SVG，自动 fallback 到 `/images/og/wechat-share.jpg`。

### 替换方法

直接替换：

```txt
public/images/og/wechat-share.jpg
```

推荐尺寸：

```txt
800 x 800
或
1200 x 630
```

微信更推荐：

```txt
800 x 800
```

注意：

- 必须是公网可访问的图片。
- 不建议用 SVG 做微信分享图。
- 图片大小建议小于 500KB。

## 十一、Footer 图片

当前 Footer 的宇宙装饰不是图片，而是 Three.js / CSS 视觉装饰。

如果你看到底部有轨道或星球感元素，它不是从 `public/images` 读取的。

主要相关文件：

```txt
src/components/layout/Footer.astro
src/styles/global.css
```

如果未来想替换成图片，建议放：

```txt
public/images/footer/orbit.jpg
```

然后在 Footer 组件中引用。

## 十二、404 / 403 / 500 / error / offline 页面图片

当前容错页没有使用真实图片，而是 CSS 轨道线装饰。

相关文件：

```txt
src/components/pages/ErrorPage.astro
src/styles/global.css
```

对应样式类：

```txt
.not-found-page
.not-found-orbit
```

如果要改成图片背景，建议放：

```txt
public/images/og/error-bg.jpg
```

再改 `ErrorPage.astro` 或 CSS。

## 十三、图标和 favicon

favicon：

```txt
public/icons/favicon.svg
```

引用位置：

```txt
src/layouts/BaseLayout.astro
```

代码：

```astro
<link rel="icon" href="/icons/favicon.svg" />
```

如果替换 favicon，直接覆盖：

```txt
public/icons/favicon.svg
```

或改成：

```txt
public/icons/favicon.png
```

并同步修改 BaseLayout。

## 十四、使用 OSS / CDN 时怎么替换图片

如果你配置了：

```env
PUBLIC_ASSET_BASE_URL=https://cdn.alexi.tech
```

那么页面中：

```txt
/images/works/lingju/cover.jpg
```

会显示为：

```txt
https://cdn.alexi.tech/images/works/lingju/cover.jpg
```

这意味着你需要同时保证 CDN 上存在：

```txt
images/works/lingju/cover.jpg
```

否则本地有图片，线上仍然可能不显示。

## 十五、替换图片后的检查清单

每次替换后检查：

- 首页精选项目卡片是否显示。
- 首页大图堆叠是否显示。
- `/works` 列表是否显示封面。
- `/works?slug=xxx` 详情页是否显示封面。
- `/thinking` 列表是否显示封面。
- 文章正文图片是否显示。
- About 图片是否显示。
- 微信分享图是否显示。
- light / dark 模式下图片上的文字是否清晰。
- 手机端图片是否裁切合理。

## 十六、推荐图片规格汇总

```txt
首页作品堆叠大图：2400 x 1400 / 1920 x 1080
作品卡片封面：1600 x 1000
作品详情 Hero：1920 x 1200
文章封面：1600 x 1000
文章正文图：1600 x 900
About 人物图：1600 x 1200
Lab 封面：1600 x 1000
微信分享图：800 x 800
通用 OG 图：1200 x 630
favicon：SVG 或 512 x 512 PNG
```

## 十七、最安全的替换方式

如果你不想改代码，最安全的方式是：

1. 保持路径不变。
2. 用新图片覆盖旧文件。
3. 文件名和后缀都不要改。

例如：

```txt
public/images/about/portrait.svg
```

直接覆盖成新的 `portrait.svg`。

如果你要从 SVG 换成 JPG/PNG/WebP，就必须同步修改所有引用路径。

