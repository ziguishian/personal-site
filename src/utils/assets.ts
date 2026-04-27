export const defaultAssetBase = 'https://cdn.alexi.tech/public';

const assetBase = (import.meta.env.PUBLIC_ASSET_BASE_URL || defaultAssetBase).replace(/\/$/, '');

export function getAssetUrl(path = '') {
  if (!path) return '';
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return assetBase ? `${assetBase}${normalized}` : normalized;
}
