import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

export function createEmotionCache() {
  return createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
    prepend: true,
  });
}