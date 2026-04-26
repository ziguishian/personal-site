export const themeInitScript = `
(() => {
  const storageKey = 'zgs-theme';
  const root = document.documentElement;
  const lightColor = '#f7f6f2';
  const darkColor = '#08090c';
  const setBrowserChromeColor = (theme) => {
    const color = theme === 'dark' ? darkColor : lightColor;
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
      meta.setAttribute('content', color);
    });
    document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', theme === 'dark' ? 'dark light' : 'light dark');
    document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')?.setAttribute(
      'content',
      theme === 'dark' ? 'black-translucent' : 'default'
    );
    root.style.colorScheme = theme;
  };
  const stored = localStorage.getItem(storageKey) || 'system';
  const systemQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const systemDark = systemQuery.matches;
  const resolved = stored === 'system' ? (systemDark ? 'dark' : 'light') : stored;
  root.dataset.theme = resolved;
  root.dataset.themePreference = stored;
  setBrowserChromeColor(resolved);
  systemQuery.addEventListener?.('change', (event) => {
    if ((localStorage.getItem(storageKey) || 'system') !== 'system') return;
    const next = event.matches ? 'dark' : 'light';
    root.dataset.theme = next;
    root.dataset.themePreference = 'system';
    setBrowserChromeColor(next);
  });
})();
`;
