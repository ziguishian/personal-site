export type Lang = 'zh' | 'en';

export const languages: Lang[] = ['zh', 'en'];
export const defaultLang: Lang = 'zh';

export const navItems = [
  { key: 'works', href: '/works' },
  { key: 'thinking', href: '/thinking' },
  { key: 'about', href: '/about' },
  { key: 'live', href: '/live' }
] as const;

export const dictionary = {
  zh: {
    siteName: 'Zi Gui Shi An',
    logoName: 'ZI GUI SHI AN',
    works: '作品',
    thinking: '思考',
    about: '关于',
    live: '动态',
    lab: '实验室',
    system: '方法论',
    manifesto: '宣言',
    heroRole: 'AI Builder / Product Designer',
    heroName: 'Zi Gui Shi An',
    heroCnName: '子圭时安',
    heroBelief: '我相信，AGI 不是终点，而是人类创造力的放大器。',
    heroBeliefEn: 'I believe AGI is not the end, but the amplifier of human creativity.',
    explore: '探索我的宇宙',
    nowTitle: '焦点',
    nowIntro: '把此刻正在推进的方向，放进长期系统。',
    worksTitle: '精选项目',
    worksIntro: '不是项目列表，而是我对创造力的实践记录。',
    thinkingTitle: '思考与方法',
    thinkingIntro: '记录思考，形成系统，分享认知的进化。',
    aboutTitle: '关于我',
    liveTitle: '正在发生',
    viewAllWorks: '查看全部项目',
    viewAllArticles: '查看全部文章',
    viewLive: '查看动态',
    moreAbout: '了解更多',
    backThinking: '回到思考',
    nextProject: '下一个项目',
    findMe: '找到我',
    contact: '联系',
    footerLine: '知行合一，日拱一卒。让我们一起加速 AGI 的实现。',
    footerContactLine: '欢迎添加微信 ziguishian，交流 AI、产品、设计、创业与星际探索。',
    backToTop: '回到顶部',
    progress: '进度',
    worksEyebrow: '作品 / 精选',
    thinkingEyebrow: '思考 / 方法',
    aboutEyebrow: '关于 / 人物',
    labTitle: '实验室 / 试验场',
    systemTitle: '方法论系统',
    universeTitle: '探索我的宇宙',
    aboutNarrative: '00后创业者 / 极客设计师 / AIGC 探索者。痴迷 AIGC 与星际探索，爱 Coding、阅读与清茶。知行合一，日拱一卒。',
    contactCta: '微信 ziguishian',
    building: '构建中',
    writing: '写作中',
    exploring: '探索中',
    community: '社区',
    liveBuildingValue: '灵矩绘境 / 子圭时安',
    all: '全部',
    search: '搜索',
    universeSubtitle: '每一个想法，都是一个正在生长的世界。'
  },
  en: {
    siteName: 'Zi Gui Shi An',
    logoName: 'ZI GUI SHI AN',
    works: 'Works',
    thinking: 'Thinking',
    about: 'About',
    live: 'Live',
    lab: 'Lab',
    system: 'System',
    manifesto: 'Manifesto',
    heroRole: 'AI Builder / Product Designer',
    heroName: 'Zi Gui Shi An',
    heroCnName: '',
    heroBelief: 'I believe AGI is not the end, but the amplifier of human creativity.',
    heroBeliefEn: '',
    explore: 'Explore My Universe',
    nowTitle: 'Focus',
    nowIntro: 'What is moving now, placed inside the long-term system.',
    worksTitle: 'Selected Works',
    worksIntro: 'Not a project list, but a record of practicing creativity.',
    thinkingTitle: 'Thinking & Approach',
    thinkingIntro: 'Writing to form systems and share evolving cognition.',
    aboutTitle: 'About',
    liveTitle: 'Live Updates',
    viewAllWorks: 'View All Works',
    viewAllArticles: 'View All Articles',
    viewLive: 'View Live Updates',
    moreAbout: 'More About Me',
    backThinking: 'Back to Thinking',
    nextProject: 'Next Project',
    findMe: 'Find me on',
    contact: 'Contact',
    footerLine: 'Act with knowledge, improve every day, and accelerate AGI together.',
    footerContactLine: 'Connect on WeChat: ziguishian. I am open to conversations around AI, product, design, startups and space exploration.',
    backToTop: 'Back to top',
    progress: 'Progress',
    worksEyebrow: 'Works / Selected',
    thinkingEyebrow: 'Thinking / Approach',
    aboutEyebrow: 'About / Person',
    labTitle: 'Lab / Playground',
    systemTitle: 'System',
    universeTitle: 'Explore My Universe',
    aboutNarrative: 'Gen-Z entrepreneur / geek designer / AIGC explorer. Obsessed with AI and interstellar exploration, shaped by coding, reading and quiet tea.',
    contactCta: 'WeChat ziguishian',
    building: 'Building',
    writing: 'Writing',
    exploring: 'Exploring',
    community: 'Community',
    liveBuildingValue: 'Lingju Vision / Zi Gui Shi An',
    all: 'All',
    search: 'Search',
    universeSubtitle: 'Every idea is a world in progress.'
  }
} satisfies Record<Lang, Record<string, string>>;

export function getLangFromUrl(url: URL): Lang {
  const first = url.pathname.split('/').filter(Boolean)[0];
  return first === 'en' ? 'en' : 'zh';
}

export function withLang(path: string, lang: Lang) {
  const clean = path === '/' ? '' : path.replace(/^\/(zh|en)/, '').replace(/^\//, '');
  return lang === defaultLang ? `/${clean}`.replace(/\/$/, '') || '/' : `/en/${clean}`.replace(/\/$/, '') || '/en';
}

export function switchLangPath(pathname: string, lang: Lang) {
  const clean = pathname.replace(/^\/(zh|en)(?=\/|$)/, '') || '/';
  return withLang(clean, lang);
}

export function t(lang: Lang, key: keyof typeof dictionary.zh) {
  return dictionary[lang][key] || dictionary.zh[key];
}
