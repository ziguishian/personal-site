import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const contentRoot = path.join(root, 'public', 'content');
const collections = ['works', 'thinking', 'live', 'lab'];
const languages = ['zh', 'en'];
const requiredFields = ['title', 'slug', 'lang', 'description', 'date', 'file'];
const errors = [];

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function localPath(publicPath) {
  return path.join(root, 'public', publicPath.replace(/^\//, ''));
}

function report(message) {
  errors.push(`- ${message}`);
}

for (const collection of collections) {
  for (const lang of languages) {
    const indexPath = path.join(contentRoot, collection, `index.${lang}.json`);
    if (!(await exists(indexPath))) {
      report(`${collection}/index.${lang}.json 不存在`);
      continue;
    }

    let items = [];
    try {
      items = JSON.parse(await readFile(indexPath, 'utf8'));
    } catch (error) {
      report(`${collection}/index.${lang}.json 不是合法 JSON：${error.message}`);
      continue;
    }

    if (!Array.isArray(items)) {
      report(`${collection}/index.${lang}.json 必须是数组`);
      continue;
    }

    const slugs = new Set();
    for (const [index, item] of items.entries()) {
      const label = `${collection}/index.${lang}.json 第 ${index + 1} 项`;
      for (const field of requiredFields) {
        if (!item[field]) report(`${label} 缺少 ${field}`);
      }
      if (item.lang && item.lang !== lang) report(`${label} 的 lang 应为 ${lang}`);
      if (item.slug) {
        if (slugs.has(item.slug)) report(`${label} slug 重复：${item.slug}`);
        slugs.add(item.slug);
      }
      if (item.file && !(await exists(localPath(item.file)))) report(`${label} 指向的 Markdown 不存在：${item.file}`);
      if (item.cover && !/^https?:\/\//.test(item.cover) && !(await exists(localPath(item.cover)))) {
        report(`${label} 指向的封面不存在：${item.cover}`);
      }
      if (item.progress !== undefined && (typeof item.progress !== 'number' || item.progress < 0 || item.progress > 100)) {
        report(`${label} 的 progress 必须是 0-100 的数字`);
      }
    }
  }
}

if (errors.length) {
  console.error(`内容检查失败，共 ${errors.length} 个问题：\n${errors.join('\n')}`);
  process.exit(1);
}

console.log('内容检查通过：public/content 索引、正文和图片引用正常。');
