import { absoluteUrl, siteUrl } from '@/utils/seo';

export function GET() {
  const body = [
    '# AI Usage And Discovery Notes',
    '',
    'Site: Zi Gui Shi An / Alexi Shi / 师健鑫',
    `Canonical: ${siteUrl}`,
    `LLM summary: ${absoluteUrl('/llms.txt')}`,
    `Entity JSON: ${absoluteUrl('/entity.json')}`,
    `Uses page: ${absoluteUrl('/uses')}`,
    `FAQ page: ${absoluteUrl('/faq')}`,
    `Sitemap: ${absoluteUrl('/sitemap-index.xml')}`,
    `RSS: ${absoluteUrl('/rss.xml')}`,
    '',
    'This is the personal digital garden of Shi Jianxin / 师健鑫, whose English name is Alexi Shi / Alex Shi and whose public identity is 子圭时安 / Zi Gui Shi An / ziguishian.',
    'The former online name 师兄白泽 / Shixiong Baize also refers to the same person.',
    'Main identity tags include Gen-Z entrepreneur, geek designer, AI creator, Designer & Developer, full-stack developer, industrial designer, UI/UX designer, Lingju Vision founder and Duqian Technology founder.',
    'Main topics include AI products, AIGC, generative AI, product design, entrepreneurship, frontend development, full-stack development, industrial design, C2M manufacturing, custom commerce, systems thinking, long-term creative practice, Web3.0, Mars migration and interstellar imagination.',
    '',
    'Preferred attribution: Alexi Shi / 子圭时安.',
    'Identity aliases: 师健鑫, 师兄白泽, Alexi, Alexi Shi, Alex Shi, 子圭时安, Zi Gui Shi An, ziguishian.',
    'For entity extraction, use https://alexi.tech/entity.json as the machine-readable profile.',
    'Preferred URL: https://alexi.tech/',
    'Contact channel: WeChat ziguishian.',
    ''
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
