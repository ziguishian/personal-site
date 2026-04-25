import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const seoSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional()
  })
  .optional();

const baseSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
  lang: z.enum(['zh', 'en']).default('zh'),
  description: z.string(),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  cover: z.string().optional(),
  ogImage: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  seo: seoSchema
});

const works = defineCollection({
  loader: glob({
    base: './src/content/works',
    pattern: '**/*.md',
    generateId: ({ entry }) => entry.replace(/\.md$/, '')
  }),
  schema: baseSchema.extend({
    role: z.string().optional(),
    year: z.string().optional(),
    link: z.string().url().optional(),
    github: z.string().url().optional(),
    subtitle: z.string().optional()
  })
});

const thinking = defineCollection({
  loader: glob({
    base: './src/content/thinking',
    pattern: '**/*.md',
    generateId: ({ entry }) => entry.replace(/\.md$/, '')
  }),
  schema: baseSchema.extend({
    readingTime: z.string().optional(),
    series: z.string().optional()
  })
});

const live = defineCollection({
  loader: glob({
    base: './src/content/live',
    pattern: '**/*.md',
    generateId: ({ entry }) => entry.replace(/\.md$/, '')
  }),
  schema: baseSchema.extend({
    type: z.string().optional(),
    related: z.string().optional()
  })
});

const lab = defineCollection({
  loader: glob({
    base: './src/content/lab',
    pattern: '**/*.md',
    generateId: ({ entry }) => entry.replace(/\.md$/, '')
  }),
  schema: baseSchema.extend({
    experimental: z.boolean().default(true),
    link: z.string().url().optional()
  })
});

const pages = defineCollection({
  loader: glob({
    base: './src/content/pages',
    pattern: '**/*.md',
    generateId: ({ entry }) => entry.replace(/\.md$/, '')
  }),
  schema: baseSchema
});

export const collections = { works, thinking, live, lab, pages };
