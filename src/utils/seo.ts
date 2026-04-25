import { getAssetUrl } from './assets';

export function absoluteUrl(path = '/', base = import.meta.env.PUBLIC_SITE_URL || 'https://ziguishian.com') {
  return new URL(path, base).toString();
}

export function getOgImage(path?: string) {
  return absoluteUrl(getAssetUrl(path || '/images/og/default.svg'));
}
