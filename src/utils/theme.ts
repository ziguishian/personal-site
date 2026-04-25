export const themeInitScript = `
(() => {
  const storageKey = 'zgs-theme';
  const root = document.documentElement;
  const stored = localStorage.getItem(storageKey) || 'system';
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const resolved = stored === 'system' ? (systemDark ? 'dark' : 'light') : stored;
  root.dataset.theme = resolved;
  root.dataset.themePreference = stored;
})();
`;
