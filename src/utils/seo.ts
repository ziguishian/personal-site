import { getAssetUrl } from './assets';
import { defaultLang, switchLangPath, type Lang } from './i18n';

export const siteUrl = (import.meta.env.PUBLIC_SITE_URL || 'https://alexi.tech').replace(/\/$/, '');
export const siteAuthor = 'Alexi Shi / 师健鑫 / 子圭时安';
export const siteHandle = 'ziguishian';
export const siteKeywords = [
  '师健鑫',
  '师兄白泽',
  'Alexi',
  'Alexi Shi',
  'Alex Shi',
  'alexi.tech',
  'ziguishian',
  '子圭时安',
  'Zi Gui Shi An',
  '00后创业者',
  '极客设计师',
  'AI 创作者',
  'AI Builder',
  'Product Designer',
  'Designer and Developer',
  'Full-Stack Developer',
  'Industrial Designer',
  'UI UX Designer',
  '创业者',
  '连续创业者',
  'AIGC',
  '人工智能',
  'AI 产品',
  'AI Native Product',
  '生成式人工智能',
  'C2M',
  '定制化电商',
  '产品设计',
  '前端开发',
  '全栈开发',
  '工业设计',
  '系统思维',
  '长期主义',
  '火星移民',
  '星际探索',
  'Digital Garden',
  '数字花园',
  '灵矩绘境',
  '渡阡科技'
];

export function absoluteUrl(path = '/', base = siteUrl) {
  return new URL(path, base).toString();
}

export function getOgImage(path?: string) {
  const image = path && !path.endsWith('.svg') ? path : '/images/og/wechat-share.jpg';
  return absoluteUrl(getAssetUrl(image));
}

export function canonicalPath(pathname = '/', lang: Lang = defaultLang) {
  const clean = pathname.replace(/\/index\.html$/, '') || '/';
  if (lang === defaultLang) {
    return clean.replace(/^\/zh(?=\/|$)/, '') || '/';
  }
  return clean.startsWith('/en') ? clean : `/en${clean === '/' ? '' : clean}`;
}

export function alternateLinks(pathname: string, lang: Lang) {
  const path = canonicalPath(pathname, lang);
  return [
    { lang: 'zh-CN', href: absoluteUrl(switchLangPath(path, 'zh')) },
    { lang: 'en-US', href: absoluteUrl(switchLangPath(path, 'en')) },
    { lang: 'x-default', href: absoluteUrl(switchLangPath(path, 'zh')) }
  ];
}

export function stripHtml(value = '') {
  return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

export function personSchema() {
  return {
    '@type': 'Person',
    '@id': `${siteUrl}/#person`,
    name: 'Alexi Shi',
    alternateName: ['师健鑫', 'Alexi', 'Alex Shi', '子圭时安', 'Zi Gui Shi An', '师兄白泽', 'ziguishian'],
    url: siteUrl,
    image: absoluteUrl(getAssetUrl('/images/about/portrait.png')),
    jobTitle: [
      'AI Builder',
      'Product Designer',
      'Developer',
      'Entrepreneur',
      'Full-Stack Developer',
      'Industrial Designer',
      'UI/UX Designer',
      'AIGC Creator'
    ],
    description:
      '师健鑫，英文名 Alexi Shi，网络身份子圭时安，过去曾用名师兄白泽。00后创业者、极客设计师、AI 创作者，长期探索 AIGC、AI 原生产品、产品设计、全栈开发、工业设计与星际探索。',
    gender: 'Male',
    nationality: 'China',
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Zhejiang',
      addressCountry: 'CN'
    },
    knowsAbout: [
      'Artificial Intelligence',
      'AIGC',
      'Generative AI',
      'AI-native Products',
      'Product Design',
      'UI/UX Design',
      'Frontend Development',
      'Full-Stack Development',
      'Industrial Design',
      'Systems Thinking',
      'Entrepreneurship',
      'C2M Manufacturing',
      'Custom Commerce',
      'Digital Garden',
      'Personal IP',
      'Long-termism',
      'Mars Migration',
      'Space Exploration'
    ],
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Industrial Design'
    },
    founder: [
      {
        '@type': 'Organization',
        name: '渡阡科技'
      },
      {
        '@type': 'Organization',
        name: '灵矩绘境'
      }
    ],
    sameAs: [
      'https://github.com/ziguishian',
      'https://www.xiaohongshu.com/user/profile/5ff14d650000000001006504',
      'https://www.douyin.com/user/MS4wLjABAAAAdpfqS4XH2ovYBFqavnRnjCT6AYYE8TwWsfrjoHRvF74',
      'https://space.bilibili.com/618506693'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'personal contact',
      availableLanguage: ['Chinese', 'English'],
      url: siteUrl
    }
  };
}

export function websiteSchema(lang: Lang) {
  return {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: 'Zi Gui Shi An',
    alternateName: ['Alexi Tech', 'alexi.tech', '子圭时安', '师健鑫', '师兄白泽', 'Alexi Shi'],
    inLanguage: lang === 'zh' ? 'zh-CN' : 'en-US',
    publisher: { '@id': `${siteUrl}/#person` },
    description:
      lang === 'zh'
        ? '师健鑫（Alexi Shi / 子圭时安，过去曾用名师兄白泽）的个人数字空间，记录 AI 产品、AIGC、产品设计、全栈开发、工业设计、创业实践、系统思考与长期主义。'
        : 'The personal digital garden of Alexi Shi, also known as Zi Gui Shi An and formerly Shixiong Baize, covering AI products, AIGC, product design, full-stack development, industrial design, startups, systems thinking and long-term building.'
  };
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url)
    }))
  };
}

export function graphSchema(items: object[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': items
  };
}
