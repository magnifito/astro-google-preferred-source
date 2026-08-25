# @puralex/astro-google-preferred-source

[![npm version](https://img.shields.io/npm/v/@puralex/astro-google-preferred-source)](https://www.npmjs.com/package/@puralex/astro-google-preferred-source)
[![License](https://img.shields.io/github/license/magnifito/astro-google-preferred-source)](https://github.com/magnifito/astro-google-preferred-source/blob/main/LICENSE)

Astro integration and components for the [Google Search preferred sources button](https://developers.google.com/search/docs/appearance/preferred-sources#standard-javascript).

## Installation

```bash
npx astro add @puralex/astro-google-preferred-source
```

or manually:

```bash
npm install @puralex/astro-google-preferred-source
```

Supports Astro `^4.0.0 || ^5.0.0 || ^6.0.0 || ^7.0.0`.

## Demo

See the live showcase at [magnifito.github.io/astro-google-preferred-source](https://magnifito.github.io/astro-google-preferred-source/).

## Eligibility

Only domain-level and subdomain-level sites can appear as preferred sources. Subdirectories like `example.com/blog` are not eligible. Check your site in the [source preferences tool](https://www.google.com/preferences/source) before implementing.

## Usage

Add the integration to your Astro config:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import googlePreferredSource from '@puralex/astro-google-preferred-source';

export default defineConfig({
  integrations: [googlePreferredSource()],
});
```

Then use the component anywhere in your pages:

```astro
---
import GooglePreferredSourceButton from '@puralex/astro-google-preferred-source/components/GooglePreferredSourceButton.astro';
---

<GooglePreferredSourceButton theme="dark" lang="en" />
```

### Component Props

| Prop   | Type                  | Description                                                              |
| ------ | --------------------- | ------------------------------------------------------------------------ |
| `theme` | `'light' \| 'dark'` | Button theme. Defaults to light.                                         |
| `lang`  | `string`              | Override the button language. Defaults to the user's browser language.   |

All standard `<div>` HTML attributes are also accepted.

### Placement tips

- Put the button where readers will see it: near the homepage header, at the end of articles, or in the site footer.
- Pair it with a short CTA label so readers understand what clicking does.
- Mention it in newsletters and social posts to lift adoption among loyal readers.

## Advanced JavaScript implementation

Use your own UI and trigger the flow programmatically. Two client modules are available:

### Callback queue (IIFE)

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import googlePreferredSource from '@puralex/astro-google-preferred-source';

export default defineConfig({
  integrations: [
    googlePreferredSource({
      mode: 'advanced',
    }),
  ],
});
```

```astro
---
// MyCustomButton.astro
---

<button id="preferred-source-btn">Add as preferred source</button>

<script>
  import { init, addPreferredSource } from '@puralex/astro-google-preferred-source/client';

  init({ theme: 'dark', lang: 'en' });

  document
    .getElementById('preferred-source-btn')
    ?.addEventListener('click', () => addPreferredSource());
</script>
```

### ES Module import

```astro
---
// MyCustomButton.astro
---

<button id="preferred-source-btn">Add as preferred source</button>

<script>
  import { init, addPreferredSource } from '@puralex/astro-google-preferred-source/client/esm';

  init({ theme: 'dark', lang: 'en' });

  document
    .getElementById('preferred-source-btn')
    ?.addEventListener('click', () => addPreferredSource());
</script>
```

### Client API

Both client modules expose the same API:

| Function            | Description                                                                |
| ------------------- | -------------------------------------------------------------------------- |
| `init(options)`     | Initialize the SDK with `theme` and/or `lang`.                             |
| `addPreferredSource(options?)` | Trigger the preferred-source flow. Calls `init` with defaults if not already initialized; passing options re-initializes first. |

## Deeplink implementation

For environments without JavaScript, newsletters, social posts, or custom UI layouts, use the deeplink and badge components:

### Component-based badge deeplink

```astro
---
import GooglePreferredSourceDeeplink from '@puralex/astro-google-preferred-source/components/GooglePreferredSourceDeeplink.astro';
---

<!-- Automatically outputs the official Google badge, retina srcset, and localized alt text -->
<GooglePreferredSourceDeeplink
  url="example.com"
  lang="ko"
  theme="light"
/>
```

The component renders a link to `https://www.google.com/preferences/source?q=<url>` with `target="_blank"` and `rel="noopener noreferrer"`.

### Standalone badge component

If you need the official badge image inside your own custom button, dialog, or card:

```astro
---
import GooglePreferredSourceBadge from '@puralex/astro-google-preferred-source/components/GooglePreferredSourceBadge.astro';
---

<div class="custom-card">
  <GooglePreferredSourceBadge lang="ja" theme="dark" />
</div>
```

### Custom slot or text link

```astro
<GooglePreferredSourceDeeplink url="example.com">
  Follow our news on Google Search &rarr;
</GooglePreferredSourceDeeplink>
```

### Deeplink Props (`GooglePreferredSourceDeeplink`)

| Prop         | Type                  | Description                                                                          |
| ------------ | --------------------- | ------------------------------------------------------------------------------------ |
| `url`        | `string`              | Publication URL or domain name. Required.                                            |
| `theme`      | `'light' \| 'dark'`  | Badge theme. Defaults to `'light'`.                                                  |
| `lang`       | `string`              | Badge language code (`'en'`, `'ko'`, `'ja'`, etc.). Defaults to `'en'`.              |
| `size`       | `'1x' \| '2x'`        | Base badge resolution. Defaults to `'1x'`.                                           |
| `highDpi`    | `boolean`             | Output 2x `srcset` for high-DPI displays. Defaults to `true`.                         |
| `alt`        | `string`              | Custom alt text override. Defaults to official localized Google wording for `lang`.  |
| `imageSrc`   | `string`              | Custom image URL override if using a custom badge graphic.                           |
| `imageAttrs` | `HTMLAttributes<'img'>` | HTML attributes forwarded directly to the inner `<img>` element.                   |
| `badge`      | `boolean`             | Render badge image when no custom slot is provided. Defaults to `true`.              |

All standard `<a>` HTML attributes are also accepted on `GooglePreferredSourceDeeplink`.

### Badge Props (`GooglePreferredSourceBadge`)

| Prop      | Type                 | Description                                                                          |
| --------- | -------------------- | ------------------------------------------------------------------------------------ |
| `theme`   | `'light' \| 'dark'` | Badge theme. Defaults to `'light'`.                                                  |
| `lang`    | `string`             | Badge language code (`'en'`, `'ko'`, `'ja'`, etc.). Defaults to `'en'`.              |
| `size`    | `'1x' \| '2x'`       | Base badge resolution. Defaults to `'1x'`.                                           |
| `highDpi` | `boolean`            | Output 2x `srcset` for high-DPI displays. Defaults to `true`.                         |
| `alt`     | `string`             | Custom alt text override. Defaults to official localized Google wording for `lang`.  |
| `src`     | `string`             | Custom image source override.                                                        |

All standard `<img>` HTML attributes are also accepted on `GooglePreferredSourceBadge`.

## Integration Options

| Option         | Type                           | Description                                                                                                      |
| -------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `mode`         | `'standard' \| 'advanced'`    | `'standard'` injects the auto-render button script (default). `'advanced'` injects the manual-control script.   |
| `injectScript` | `boolean`                      | Inject the Google Preferred Sources library script into every page's `<head>`. Defaults to `true`. Set to `false` if you add the script manually. |

## Resources

- [Source preferences tool](https://www.google.com/preferences/source) — check if your site is eligible.
- [Google preferred sources documentation](https://developers.google.com/search/docs/appearance/preferred-sources)
- [Supported language codes](https://developers.google.com/static/search/docs/appearance/preferred-sources-languages.csv)
- [Official button assets](https://services.google.com/fh/files/helpcenter/google_preferred_source_badge_all_languages.zip)
- [Google interactive demo](https://reader-revenue-demo.ue.r.appspot.com/preferred-sources/esm)

## Limitations

- **CSP:** The integration injects an inline `<script>` to load Google's library. Sites with a strict Content Security Policy must allow inline scripts (`unsafe-inline`) or load the library manually with `injectScript: false`.
- **Mixed modes:** The standard auto-render script and the advanced manual-control script should not be loaded together. The callback-queue client module rejects if a standard-mode script is already present.
