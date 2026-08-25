import { defineConfig } from 'astro/config';
import googlePreferredSource from '@puralex/astro-google-preferred-source';

const site = process.env.PUBLIC_SITE_URL || 'https://magnifito.github.io';
const base = process.env.PUBLIC_BASE_PATH || '/astro-google-preferred-source';

export default defineConfig({
  site,
  base,
  integrations: [googlePreferredSource()],
});
