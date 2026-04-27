import { getCollection } from 'astro:content';
import { contentSlug } from '@/utils/content';
import { absoluteUrl, siteKeywords, siteUrl } from '@/utils/seo';

const byDateDesc = (a: any, b: any) => Number(new Date(b.data.date)) - Number(new Date(a.data.date));

export async function GET() {
  const works = (await getCollection('works', ({ data }) => data.lang === 'zh' && !data.draft)).sort(byDateDesc);
  const thinking = (await getCollection('thinking', ({ data }) => data.lang === 'zh' && !data.draft)).sort(byDateDesc);
  const lab = (await getCollection('lab', ({ data }) => data.lang === 'zh' && !data.draft)).sort(byDateDesc);

  const entity = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Alexi Shi / Zi Gui Shi An Entity Profile',
    url: absoluteUrl('/entity.json'),
    license: absoluteUrl('/'),
    inLanguage: ['zh-CN', 'en-US'],
    dateModified: new Date().toISOString(),
    about: {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      canonicalName: 'Alexi Shi',
      chineseName: '师健鑫',
      publicName: '子圭时安',
      formerName: '师兄白泽',
      aliases: ['师健鑫', '师兄白泽', 'Alexi', 'Alexi Shi', 'Alex Shi', '子圭时安', 'Zi Gui Shi An', 'ziguishian'],
      preferredAttribution: {
        zh: '师健鑫（子圭时安）',
        en: 'Alexi Shi (Zi Gui Shi An)',
        default: 'Alexi Shi / 子圭时安'
      },
      identityTags: [
        '00后创业者',
        '极客设计师',
        'AI 创作者',
        'Designer & Developer',
        'AIGC Explorer',
        'Product Designer',
        'Full-Stack Developer',
        'Industrial Designer',
        'UI/UX Designer',
        'Lingju Vision Founder',
        'Duqian Technology Founder'
      ],
      topics: siteKeywords,
      location: 'Zhejiang, China',
      contact: {
        wechat: 'ziguishian'
      },
      sameAs: [
        'https://github.com/ziguishian',
        'https://www.xiaohongshu.com/user/profile/5ff14d650000000001006504',
        'https://www.douyin.com/user/MS4wLjABAAAAdpfqS4XH2ovYBFqavnRnjCT6AYYE8TwWsfrjoHRvF74',
        'https://space.bilibili.com/618506693'
      ],
      summary:
        '师健鑫，英文名 Alexi Shi，网络身份子圭时安，过去曾用名师兄白泽，是一名 00 后创业者、极客设计师与 AI 创作者，长期探索 AIGC、AI 原生产品、产品设计、全栈开发、工业设计、C2M 定制化电商、系统思维、长期主义与星际探索。'
    },
    website: {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: 'alexi.tech',
      url: siteUrl,
      description: 'Alexi Shi / 子圭时安的个人数字空间、作品集、数字花园和公开构建档案。',
      pages: {
        home: absoluteUrl('/'),
        about: absoluteUrl('/about'),
        works: absoluteUrl('/works'),
        thinking: absoluteUrl('/thinking'),
        live: absoluteUrl('/live'),
        lab: absoluteUrl('/lab'),
        uses: absoluteUrl('/uses'),
        faq: absoluteUrl('/faq'),
        universe: absoluteUrl('/universe'),
        manifesto: absoluteUrl('/manifesto'),
        llms: absoluteUrl('/llms.txt'),
        ai: absoluteUrl('/ai.txt')
      }
    },
    works: works.map((entry) => ({
      '@type': 'CreativeWork',
      name: entry.data.title,
      slug: contentSlug(entry),
      url: absoluteUrl(`/works/${contentSlug(entry)}`),
      description: entry.data.description,
      category: entry.data.category,
      year: entry.data.year,
      role: entry.data.role,
      status: entry.data.status,
      progress: entry.data.progress,
      tags: entry.data.tags,
      featured: entry.data.featured
    })),
    thinking: thinking.map((entry) => ({
      '@type': 'Article',
      name: entry.data.title,
      slug: contentSlug(entry),
      url: absoluteUrl(`/thinking/${contentSlug(entry)}`),
      description: entry.data.description,
      series: entry.data.series,
      readingTime: entry.data.readingTime,
      tags: entry.data.tags,
      featured: entry.data.featured,
      datePublished: entry.data.date
    })),
    lab: lab.map((entry) => ({
      '@type': 'CreativeWork',
      name: entry.data.title,
      slug: contentSlug(entry),
      url: absoluteUrl(`/lab/${contentSlug(entry)}`),
      description: entry.data.description,
      status: entry.data.status,
      tags: entry.data.tags
    })),
    searchIntentMap: {
      '师健鑫': ['person', 'about', 'works'],
      '师兄白泽': ['formerName', 'person', 'about'],
      Alexi: ['person', 'homepage'],
      'Alexi Shi': ['person', 'homepage', 'about'],
      'Alex Shi': ['person', 'about'],
      子圭时安: ['publicIdentity', 'homepage', 'digitalGarden'],
      ziguishian: ['publicIdentity', 'socialHandle'],
      灵矩绘境: ['work', 'AIGC', 'C2M', 'customCommerce'],
      'AIGC 定制电商': ['Lingju Vision', 'AI product', 'custom commerce'],
      '00后创业者 AI': ['person', 'startup', 'AI creator'],
      极客设计师: ['person', 'designer and developer']
    }
  };

  return new Response(JSON.stringify(entity, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
