import { defineConfig } from 'astro/config';
import googlePreferredSource from '@puralex/astro-google-preferred-source';

export default defineConfig({
  site: 'https://magnifito.github.io',
  base: '/astro-google-preferred-source',
  integrations: [googlePreferredSource()],
});
