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

## Deeplink & Button components

The integration provides modern, vector-powered button components with crisp SVG Google icons, arbitrary custom text labels, and customizable visual styles (pills, badges, outline, glow, etc.):

### 1. Vector Button with Custom Label

```astro
---
import GooglePreferredSourceDeeplink from '@puralex/astro-google-preferred-source/components/GooglePreferredSourceDeeplink.astro';
---

<!-- Modern pill with arbitrary text and vector Google "G" icon -->
<GooglePreferredSourceDeeplink
  url="example.com"
  variant="pill"
  label="Follow on Google"
  theme="light"
/>
```

### 2. Standalone Google "G" Icon

```astro
---
import GoogleIcon from '@puralex/astro-google-preferred-source/components/GoogleIcon.astro';
---

<!-- Crisp scalable 4-color Google "G" SVG -->
<GoogleIcon size={24} />
```

### 3. Visual Button Variants

```astro
<!-- Solid button with dark theme -->
<GooglePreferredSourceDeeplink
  url="example.com"
  variant="button"
  label="선호하는 출처로 추가"
  theme="dark"
/>

<!-- Ghost outline button -->
<GooglePreferredSourceDeeplink
  url="example.com"
  variant="outline"
  label="Add as Preferred Source"
/>

<!-- Google 4-color gradient glow button -->
<GooglePreferredSourceDeeplink
  url="example.com"
  variant="glow"
  label="Follow on Google Search"
  theme="dark"
/>

<!-- Custom slot content -->
<GooglePreferredSourceDeeplink url="example.com" variant="pill">
  <span>⭐ Add to Google Preferences</span>
</GooglePreferredSourceDeeplink>
```

### 4. Official Static Graphic Badges

If you want the official Google pre-rendered PNG graphics:

```astro
<GooglePreferredSourceDeeplink
  url="example.com"
  variant="image"
  lang="ko"
  theme="light"
/>
```

### `GooglePreferredSourceDeeplink` Props

| Prop        | Type                                                                       | Description                                                                              |
| ----------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `url`       | `string`                                                                   | Publication URL or domain name. Required.                                                |
| `label`     | `string`                                                                   | Custom text label for the button. Supports any arbitrary text.                           |
| `variant`   | `'badge' \| 'button' \| 'pill' \| 'outline' \| 'glow' \| 'minimal' \| 'raw' \| 'image'` | Visual button style. Defaults to `'badge'`.                                 |
| `theme`     | `'light' \| 'dark' \| 'auto'`                                              | Color theme. Defaults to `'light'`.                                                      |
| `size`      | `'sm' \| 'md' \| 'lg'`                                                     | Button size. Defaults to `'md'`.                                                         |
| `icon`      | `boolean`                                                                  | Whether to display the official 4-color Google "G" SVG icon. Defaults to `true`.          |
| `lang`      | `string`                                                                   | Language code for default localized text fallback if `label` is omitted. Defaults to `'en'`. |
| `imageSize` | `'1x' \| '2x'`                                                             | Resolution when `variant="image"`. Defaults to `'1x'`.                                   |

All standard `<a>` HTML attributes are also accepted.

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
