import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { contentSlug } from '@/utils/content';

export async function GET(context: any) {
  const articles = await getCollection('thinking', ({ data }) => data.lang === 'zh' && !data.draft);
  return rss({
    title: 'Zi Gui Shi An / Thinking',
    description: '思考与方法',
    site: context.site,
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.date,
      link: `/thinking/${contentSlug(article)}/`
    }))
  });
}
