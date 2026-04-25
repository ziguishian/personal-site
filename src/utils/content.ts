import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import type { Lang } from './i18n';

type AnyEntry = CollectionEntry<'works'> | CollectionEntry<'thinking'> | CollectionEntry<'live'> | CollectionEntry<'lab'>;

export function contentSlug(entry: { id: string; data: { slug?: string } }) {
  return entry.data.slug ?? entry.id.replace(/\.(zh|en)$/, '');
}

export async function getLocalizedCollection<T extends 'works' | 'thinking' | 'live' | 'lab'>(
  collection: T,
  lang: Lang
) {
  const entries = await getCollection(collection, ({ data }) => !data.draft);
  return entries
    .filter((entry) => entry.data.lang === lang)
    .sort((a, b) => Number(new Date(b.data.date)) - Number(new Date(a.data.date)));
}

export async function getLocalizedBySlug<T extends 'works' | 'thinking' | 'live' | 'lab'>(
  collection: T,
  slug: string,
  lang: Lang
) {
  const entries = await getCollection(collection, ({ data }) => !data.draft);
  const matched = entries.filter((entry) => contentSlug(entry) === slug);
  return matched.find((entry) => entry.data.lang === lang) ?? matched.find((entry) => entry.data.lang === 'zh');
}

export function groupUnique(entries: AnyEntry[], field: 'category' | 'type' | 'tags') {
  const values = entries.flatMap((entry) => {
    const value = entry.data[field as keyof typeof entry.data];
    return Array.isArray(value) ? value : value ? [value] : [];
  });
  return [...new Set(values)].filter((value): value is string => typeof value === 'string');
}

export function formatDate(date: Date | string, lang: Lang) {
  return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }).format(new Date(date));
}
