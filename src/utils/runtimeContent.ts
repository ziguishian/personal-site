type Lang = 'zh' | 'en';
type Collection = 'works' | 'thinking' | 'live' | 'lab';

export type RuntimeItem = {
  title: string;
  slug: string;
  lang: Lang;
  description: string;
  date: string;
  updated?: string;
  cover?: string;
  ogImage?: string;
  category?: string;
  tags?: string[];
  status?: string;
  progress?: number;
  featured?: boolean;
  draft?: boolean;
  role?: string;
  year?: string;
  link?: string;
  github?: string;
  readingTime?: string;
  series?: string;
  type?: string;
  related?: string;
  experimental?: boolean;
  file?: string;
};

const runtimeLabels = {
  zh: {
    all: '全部',
    back: '返回',
    backWorks: '返回作品',
    backThinking: '返回思考',
    backLab: '返回实验室',
    empty: '还没有内容。',
    loading: '正在读取内容...',
    read: '阅读全文',
    view: '查看项目',
    next: '下一个',
    nextLab: '下一个实验',
    date: '日期',
    role: '角色',
    status: '状态',
    progress: '进度',
    year: '年份',
    sourceMissing: '没有找到这篇内容。请检查 slug 或 index.json。',
    detailHint: '内容来自 /content，可在打包后直接更新。',
    openExperiment: '打开实验',
    searchPlaceholder: '搜索标题、摘要或标签'
  },
  en: {
    all: 'All',
    back: 'Back',
    backWorks: 'Back to Works',
    backThinking: 'Back to Thinking',
    backLab: 'Back to Lab',
    empty: 'No content yet.',
    loading: 'Loading content...',
    read: 'Read Article',
    view: 'View Project',
    next: 'Next',
    nextLab: 'Next Experiment',
    date: 'Date',
    role: 'Role',
    status: 'Status',
    progress: 'Progress',
    year: 'Year',
    sourceMissing: 'This content was not found. Please check the slug or index.json.',
    detailHint: 'Loaded from /content and editable after build.',
    openExperiment: 'Open Experiment',
    searchPlaceholder: 'Search title, summary or tags'
  }
} satisfies Record<Lang, Record<string, string>>;

function label(lang: Lang, key: keyof typeof runtimeLabels.zh) {
  return runtimeLabels[lang][key] || runtimeLabels.zh[key];
}

function langFromRoot(root: HTMLElement): Lang {
  return root.dataset.lang === 'en' ? 'en' : 'zh';
}

function assetUrl(path = '') {
  const base = document.documentElement.dataset.assetBase || '';
  if (!path || /^https?:\/\//.test(path)) return path;
  return `${base}${path}`;
}

function detailHref(base: string, slug: string) {
  const url = new URL(base, window.location.origin);
  url.searchParams.set('slug', slug);
  return `${url.pathname}${url.search}`;
}

function cleanItems(items: RuntimeItem[]) {
  return items
    .filter((item) => !item.draft)
    .sort((a, b) => +new Date(b.date || 0) - +new Date(a.date || 0));
}

async function fetchJson<T>(url: string): Promise<T | null> {
  const response = await fetch(url, { cache: 'no-cache' });
  if (!response.ok) return null;
  return response.json() as Promise<T>;
}

async function loadIndex(collection: Collection, lang: Lang) {
  const localized = await fetchJson<RuntimeItem[]>(`/content/${collection}/index.${lang}.json`);
  if (localized) return cleanItems(localized);
  const fallback = await fetchJson<RuntimeItem[]>(`/content/${collection}/index.zh.json`);
  return fallback ? cleanItems(fallback) : [];
}

async function loadMarkdown(item: RuntimeItem, lang: Lang) {
  if (!item.file) return '';
  const response = await fetch(item.file, { cache: 'no-cache' });
  if (response.ok) return response.text();

  const fallback = item.file.replace(`.${lang}.md`, '.zh.md');
  const fallbackResponse = await fetch(fallback, { cache: 'no-cache' });
  return fallbackResponse.ok ? fallbackResponse.text() : '';
}

function escapeHtml(value = '') {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function codeTokenClass(kind: string, value: string) {
  return `<span class="code-token code-token-${kind}">${escapeHtml(value)}</span>`;
}

function highlightCode(source: string, lang = '') {
  const language = lang.toLowerCase();
  const keywords = [
    'astro',
    'await',
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'default',
    'do',
    'else',
    'export',
    'extends',
    'false',
    'finally',
    'for',
    'from',
    'function',
    'if',
    'import',
    'in',
    'interface',
    'let',
    'new',
    'null',
    'of',
    'return',
    'satisfies',
    'switch',
    'throw',
    'true',
    'try',
    'type',
    'undefined',
    'while'
  ].join('|');

  if (['html', 'astro', 'xml'].includes(language)) {
    const htmlPattern = /(<!--[\s\S]*?-->)|(<\/?[A-Za-z][^>]*>)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g;
    let output = '';
    let lastIndex = 0;
    for (const match of source.matchAll(htmlPattern)) {
      output += escapeHtml(source.slice(lastIndex, match.index));
      const [token, comment, tag, string] = match;
      if (comment) output += codeTokenClass('comment', comment);
      else if (string) output += codeTokenClass('string', string);
      else if (tag) {
        output += escapeHtml(tag)
          .replace(/(&lt;\/?)([A-Za-z][\w:-]*)/g, `$1<span class="code-token code-token-tag">$2</span>`)
          .replace(/\s([A-Za-z_:][\w:.-]*)(=)/g, ` <span class="code-token code-token-attr">$1</span>$2`);
      } else {
        output += escapeHtml(token);
      }
      lastIndex = (match.index || 0) + token.length;
    }
    output += escapeHtml(source.slice(lastIndex));
    return output;
  }

  const commentPattern = language === 'bash' || language === 'sh' ? /#.*$/ : /\/\/.*$|\/\*[\s\S]*?\*\//;
  const tokenPattern = new RegExp(
    `(${commentPattern.source})|("(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*'|\`(?:\\\\.|[^\`\\\\])*\`)|(\\b(?:${keywords})\\b)|(\\b\\d+(?:\\.\\d+)?\\b)|([A-Za-z_$][\\w$]*(?=\\s*\\())`,
    'gm'
  );

  let output = '';
  let lastIndex = 0;
  for (const match of source.matchAll(tokenPattern)) {
    output += escapeHtml(source.slice(lastIndex, match.index));
    const [token, comment, string, keyword, number, fn] = match;
    if (comment) output += codeTokenClass('comment', comment);
    else if (string) output += codeTokenClass('string', string);
    else if (keyword) output += codeTokenClass('keyword', keyword);
    else if (number) output += codeTokenClass('number', number);
    else if (fn) output += codeTokenClass('function', fn);
    else output += escapeHtml(token);
    lastIndex = (match.index || 0) + token.length;
  }
  output += escapeHtml(source.slice(lastIndex));
  return output;
}

function inlineMarkdown(value = '') {
  let text = escapeHtml(value);
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
    const safeAlt = escapeHtml(alt);
    const safeSrc = escapeHtml(assetUrl(src));
    return `<figure><img src="${safeSrc}" alt="${safeAlt}" loading="lazy" decoding="async" /><figcaption>${safeAlt}</figcaption></figure>`;
  });
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return text;
}

function renderMarkdown(markdown: string) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const html: string[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let quote: string[] = [];
  let code: string[] = [];
  let inCode = false;
  let codeLang = '';

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (!list.length) return;
    html.push(`<ul>${list.map((item) => `<li>${inlineMarkdown(item)}</li>`).join('')}</ul>`);
    list = [];
  };
  const flushQuote = () => {
    if (!quote.length) return;
    html.push(`<blockquote>${quote.map((item) => `<p>${inlineMarkdown(item)}</p>`).join('')}</blockquote>`);
    quote = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.startsWith('```')) {
      if (inCode) {
        html.push(`<pre><code class="language-${escapeHtml(codeLang)}">${highlightCode(code.join('\n'), codeLang)}</code></pre>`);
        code = [];
        codeLang = '';
        inCode = false;
      } else {
        flushParagraph();
        flushList();
        flushQuote();
        codeLang = line.replace(/^```/, '').trim();
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      code.push(rawLine);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      flushQuote();
      continue;
    }

    const heading = /^(#{1,4})\s+(.+)$/.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      flushQuote();
      const level = Math.min(heading[1].length + 1, 4);
      html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }

    if (/^>\s?/.test(line)) {
      flushParagraph();
      flushList();
      quote.push(line.replace(/^>\s?/, ''));
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      flushQuote();
      list.push(line.replace(/^[-*]\s+/, ''));
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();
  flushQuote();

  return html.join('\n');
}

function formatDate(value: string, lang: Lang) {
  if (!value) return '';
  return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(value));
}

function tagsHtml(tags: string[] = []) {
  return tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');
}

function status(root: HTMLElement, message: string) {
  const slot = root.querySelector<HTMLElement>('[data-runtime-status]');
  if (slot) slot.textContent = message;
}

function clearStatus(root: HTMLElement) {
  const slot = root.querySelector<HTMLElement>('[data-runtime-status]');
  if (slot) slot.textContent = '';
}

function renderProgress(item: RuntimeItem, lang: Lang) {
  if (typeof item.progress !== 'number') return '';
  return `<div class="runtime-progress"><span>${label(lang, 'progress')} ${item.progress}%</span><i style="width:${item.progress}%"></i></div>`;
}

function renderWorkCard(item: RuntimeItem, index: number, base: string) {
  return `
    <a class="runtime-work-card group" href="${detailHref(base, item.slug)}">
      ${item.cover ? `<img src="${assetUrl(item.cover)}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async" />` : ''}
      <div class="runtime-work-card-body">
        <div class="runtime-card-topline"><span>${String(index + 1).padStart(2, '0')}</span><span>${escapeHtml(item.category || '')}</span></div>
        <h2>${escapeHtml(item.title)}</h2>
        <p>${escapeHtml(item.description)}</p>
        ${renderProgress(item, item.lang)}
        <span class="runtime-arrow">→</span>
      </div>
    </a>
  `;
}

function renderArticleRow(item: RuntimeItem, base: string, lang: Lang, index?: number) {
  return `
    <a class="runtime-article-row" href="${detailHref(base, item.slug)}">
      <div class="runtime-article-meta">
        <span>${index === undefined ? formatDate(item.date, lang) : String(index + 1).padStart(2, '0')}</span>
        <span>${escapeHtml(item.readingTime || '')}</span>
      </div>
      <div>
        <h2>${escapeHtml(item.title)}</h2>
        <p>${escapeHtml(item.description)}</p>
        <div class="runtime-tags">${tagsHtml(item.tags)}</div>
      </div>
      <span class="runtime-row-arrow">→</span>
    </a>
  `;
}

function renderFilter(collection: RuntimeItem[], lang: Lang, onFilter: (value: string) => void, mode: 'category' | 'tag' | 'type') {
  const values = Array.from(
    new Set(
      collection.flatMap((item) => {
        if (mode === 'tag') return item.tags || [];
        if (mode === 'type') return item.type ? [item.type] : [];
        return item.category ? [item.category] : [];
      })
    )
  );
  const wrapper = document.createElement('div');
  wrapper.className = 'runtime-filter';
  wrapper.innerHTML = `<button data-filter="*" class="is-active">${label(lang, 'all')}</button>${values
    .map((value) => `<button data-filter="${escapeHtml(value)}">${escapeHtml(value)}</button>`)
    .join('')}`;
  wrapper.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-filter]');
    if (!button) return;
    wrapper.querySelectorAll('button').forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    onFilter(button.dataset.filter || '*');
  });
  return wrapper;
}

export async function mountRuntimeWorks(root: HTMLElement) {
  const lang = langFromRoot(root);
  const base = root.dataset.base || '/works';
  const slot = root.querySelector<HTMLElement>('[data-runtime-content]');
  if (!slot) return;

  status(root, label(lang, 'loading'));
  const items = await loadIndex('works', lang);
  const slug = new URL(window.location.href).searchParams.get('slug');

  if (slug) {
    root.querySelector<HTMLElement>('header')?.setAttribute('hidden', '');
    const item = items.find((entry) => entry.slug === slug);
    if (!item) {
      status(root, label(lang, 'sourceMissing'));
      return;
    }
    const markdown = await loadMarkdown(item, lang);
    clearStatus(root);
    const next = items[(items.findIndex((entry) => entry.slug === slug) + 1) % items.length];
    slot.innerHTML = `
      <article class="runtime-detail runtime-work-detail">
        <a class="runtime-back" href="${base}">← ${label(lang, 'backWorks')}</a>
        <div class="runtime-detail-hero">
          <div>
            <p class="runtime-kicker">${escapeHtml(item.category || 'Work')}</p>
            <h1>${escapeHtml(item.title)}</h1>
            <p>${escapeHtml(item.description)}</p>
          </div>
          ${item.cover ? `<img src="${assetUrl(item.cover)}" alt="${escapeHtml(item.title)}" loading="eager" decoding="async" />` : ''}
        </div>
        <dl class="runtime-meta-grid">
          <div><dt>${label(lang, 'year')}</dt><dd>${escapeHtml(item.year || '')}</dd></div>
          <div><dt>${label(lang, 'role')}</dt><dd>${escapeHtml(item.role || '')}</dd></div>
          <div><dt>${label(lang, 'status')}</dt><dd>${escapeHtml(item.status || '')}</dd></div>
          <div><dt>${label(lang, 'date')}</dt><dd>${formatDate(item.date, lang)}</dd></div>
        </dl>
        <div class="runtime-tags">${tagsHtml(item.tags)}</div>
        <div class="runtime-prose">${renderMarkdown(markdown)}</div>
        ${next ? `<a class="runtime-next" href="${detailHref(base, next.slug)}"><span>${label(lang, 'next')}</span><strong>${escapeHtml(next.title)}</strong><i>→</i></a>` : ''}
      </article>
    `;
    return;
  }

  clearStatus(root);
  const controls = root.querySelector<HTMLElement>('[data-runtime-controls]');
  const render = (filter = '*') => {
    const filtered = filter === '*' ? items : items.filter((item) => item.category === filter);
    slot.innerHTML = filtered.length
      ? `<div class="runtime-work-grid">${filtered.map((item, index) => renderWorkCard(item, index, base)).join('')}</div>`
      : `<p class="runtime-empty">${label(lang, 'empty')}</p>`;
  };
  if (controls) {
    controls.replaceChildren(renderFilter(items, lang, render, 'category'));
  }
  render();
}

export async function mountRuntimeThinking(root: HTMLElement) {
  const lang = langFromRoot(root);
  const base = root.dataset.base || '/thinking';
  const slot = root.querySelector<HTMLElement>('[data-runtime-content]');
  if (!slot) return;

  status(root, label(lang, 'loading'));
  const items = await loadIndex('thinking', lang);
  const slug = new URL(window.location.href).searchParams.get('slug');

  if (slug) {
    root.querySelector<HTMLElement>('header')?.setAttribute('hidden', '');
    const item = items.find((entry) => entry.slug === slug);
    if (!item) {
      status(root, label(lang, 'sourceMissing'));
      return;
    }
    const markdown = await loadMarkdown(item, lang);
    clearStatus(root);
    slot.innerHTML = `
      <article class="runtime-detail runtime-article-detail">
        <a class="runtime-back" href="${base}">← ${label(lang, 'backThinking')}</a>
        <header>
          <p class="runtime-kicker">${formatDate(item.date, lang)} · ${escapeHtml(item.readingTime || '')}</p>
          <h1>${escapeHtml(item.title)}</h1>
          <p>${escapeHtml(item.description)}</p>
          <div class="runtime-tags">${tagsHtml(item.tags)}</div>
        </header>
        <div class="runtime-prose">${renderMarkdown(markdown)}</div>
      </article>
    `;
    return;
  }

  clearStatus(root);
  const controls = root.querySelector<HTMLElement>('[data-runtime-controls]');
  const render = (filter = '*', query = '') => {
    const normalized = query.trim().toLowerCase();
    const filtered = items.filter((item) => {
      const hitFilter = filter === '*' || (item.tags || []).includes(filter);
      const haystack = `${item.title} ${item.description} ${(item.tags || []).join(' ')}`.toLowerCase();
      return hitFilter && (!normalized || haystack.includes(normalized));
    });
    slot.innerHTML = filtered.length
      ? filtered.map((item) => renderArticleRow(item, base, lang)).join('')
      : `<p class="runtime-empty">${label(lang, 'empty')}</p>`;
  };
  let activeFilter = '*';
  let query = '';
  if (controls) {
    const filter = renderFilter(items, lang, (value) => {
      activeFilter = value;
      render(activeFilter, query);
    }, 'tag');
    const search = document.createElement('input');
    search.type = 'search';
    search.placeholder = label(lang, 'searchPlaceholder');
    search.className = 'runtime-search';
    search.addEventListener('input', () => {
      query = search.value;
      render(activeFilter, query);
    });
    controls.replaceChildren(filter, search);
  }
  render();
}

export async function mountRuntimeHome(root: HTMLElement) {
  const lang = langFromRoot(root);
  const worksBase = root.dataset.worksBase || '/works';
  const thinkingBase = root.dataset.thinkingBase || '/thinking';
  const worksSlot = root.querySelector<HTMLElement>('[data-home-works]') || document.querySelector<HTMLElement>('[data-home-works]');
  const thinkingSlot = root.querySelector<HTMLElement>('[data-home-thinking]') || document.querySelector<HTMLElement>('[data-home-thinking]');
  const [works, thinking] = await Promise.all([loadIndex('works', lang), loadIndex('thinking', lang)]);

  if (worksSlot) {
    worksSlot.innerHTML = works
      .filter((item) => item.featured)
      .slice(0, 3)
      .map((item, index) => renderWorkCard(item, index, worksBase))
      .join('');
  }
  if (thinkingSlot) {
    thinkingSlot.innerHTML = thinking
      .filter((item) => item.featured)
      .slice(0, 4)
      .map((item, index) => `<div class="border-l px-8 hairline">${renderArticleRow(item, thinkingBase, lang, index)}</div>`)
      .join('');
  }
}

export async function mountRuntimeLive(root: HTMLElement) {
  const lang = langFromRoot(root);
  const slot = root.querySelector<HTMLElement>('[data-runtime-content]');
  if (!slot) return;
  const items = await loadIndex('live', lang);
  slot.innerHTML = items.length
    ? items
        .map((item) => `
          <a class="runtime-live-row" href="${item.related || '#'}">
            <span>${escapeHtml(item.type || '')}</span>
            <h2>${escapeHtml(item.title)}</h2>
            <p>${escapeHtml(item.description)}</p>
            <time>${formatDate(item.date, lang)}</time>
          </a>
        `)
        .join('')
    : `<p class="runtime-empty">${label(lang, 'empty')}</p>`;
}

export async function mountRuntimeLab(root: HTMLElement) {
  const lang = langFromRoot(root);
  const base = root.dataset.base || '/lab';
  const slot = root.querySelector<HTMLElement>('[data-runtime-content]');
  if (!slot) return;
  const items = await loadIndex('lab', lang);
  const slug = new URL(window.location.href).searchParams.get('slug');

  if (slug) {
    const item = items.find((entry) => entry.slug === slug);
    if (!item) {
      slot.innerHTML = `<p class="runtime-empty">${label(lang, 'sourceMissing')}</p>`;
      return;
    }
    root.querySelector<HTMLElement>('h1')?.setAttribute('hidden', '');
    const markdown = await loadMarkdown(item, lang);
    const next = items[(items.findIndex((entry) => entry.slug === slug) + 1) % items.length];
    slot.innerHTML = `
      <article class="runtime-detail runtime-lab-detail">
        <a class="runtime-back" href="${base}">← ${label(lang, 'backLab')}</a>
        <div class="runtime-detail-hero">
          <div>
            <p class="runtime-kicker">${escapeHtml(item.experimental ? 'Experimental' : item.status || 'Lab')}</p>
            <h1>${escapeHtml(item.title)}</h1>
            <p>${escapeHtml(item.description)}</p>
          </div>
          ${item.cover ? `<img src="${assetUrl(item.cover)}" alt="${escapeHtml(item.title)}" loading="eager" decoding="async" />` : ''}
        </div>
        <dl class="runtime-meta-grid">
          <div><dt>${label(lang, 'date')}</dt><dd>${formatDate(item.date, lang)}</dd></div>
          <div><dt>${label(lang, 'status')}</dt><dd>${escapeHtml(item.status || '')}</dd></div>
          <div><dt>Type</dt><dd>${escapeHtml(item.experimental ? 'Experiment' : 'Lab')}</dd></div>
          <div><dt>Source</dt><dd>${escapeHtml(item.file || '')}</dd></div>
        </dl>
        <div class="runtime-tags">${tagsHtml(item.tags)}</div>
        ${item.link && item.link !== '#' ? `<a class="runtime-back mt-8" href="${escapeHtml(item.link)}" target="_blank" rel="noreferrer">${label(lang, 'openExperiment')}</a>` : ''}
        <div class="runtime-prose">${renderMarkdown(markdown)}</div>
        ${next && next.slug !== item.slug ? `<a class="runtime-next" href="${detailHref(base, next.slug)}"><span>${label(lang, 'nextLab')}</span><strong>${escapeHtml(next.title)}</strong><i>→</i></a>` : ''}
      </article>
    `;
    return;
  }

  slot.innerHTML = items.length
    ? `<div class="runtime-work-grid">${items.map((item, index) => renderWorkCard(item, index, base)).join('')}</div>`
    : `<p class="runtime-empty">${label(lang, 'empty')}</p>`;
}
