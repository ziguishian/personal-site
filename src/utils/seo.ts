import { getAssetUrl } from './assets';

export function absoluteUrl(path = '/', base = import.meta.env.PUBLIC_SITE_URL || 'https://alexi.tech') {
  return new URL(path, base).toString();
}

export function getOgImage(path?: string) {
  const image = path && !path.endsWith('.svg') ? path : '/images/og/wechat-share.jpg';
  return absoluteUrl(getAssetUrl(image));
}
