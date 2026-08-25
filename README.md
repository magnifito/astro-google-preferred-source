# @puralex/astro-google-preferred-source

Astro integration and components for the [Google Search preferred sources button](https://developers.google.com/search/docs/appearance/preferred-sources#standard-javascript).

## Installation

```bash
npm install @puralex/astro-google-preferred-source
```

Supports Astro `^4.0.0 || ^5.0.0 || ^6.0.0 || ^7.0.0`.

## Demo

See the live showcase at [magnifito.github.io/astro-google-preferred-source](https://magnifito.github.io/astro-google-preferred-source/).

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

## Component Props

| Prop   | Type                  | Description                                                              |
| ------ | --------------------- | ------------------------------------------------------------------------ |
| `theme` | `'light' \| 'dark'` | Button theme. Defaults to light.                                         |
| `lang`  | `string`              | Override the button language. Defaults to the user's browser language.   |

All standard `<div>` HTML attributes are also accepted.

## Advanced JavaScript implementation

Use your own UI and trigger the flow programmatically:

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

### Client API

| Function            | Description                                                                |
| ------------------- | -------------------------------------------------------------------------- |
| `init(options)`     | Initialize the SDK with `theme` and/or `lang`.                             |
| `addPreferredSource(options?)` | Trigger the preferred-source flow. Calls `init` with defaults if not already initialized; passing options re-initializes first. |

## Deeplink implementation

For environments without JavaScript, or for links in newsletters and social posts, use the deeplink component:

```astro
---
import GooglePreferredSourceDeeplink from '@puralex/astro-google-preferred-source/components/GooglePreferredSourceDeeplink.astro';
---

<GooglePreferredSourceDeeplink url="example.com">
  Add us as a preferred source
</GooglePreferredSourceDeeplink>
```

The component renders a link to `https://www.google.com/preferences/source?q=<url>` with `target="_blank"` and `rel="noopener noreferrer"`.

### Deeplink Props

| Prop  | Type     | Description                                                              |
| ----- | -------- | ------------------------------------------------------------------------ |
| `url` | `string` | Publication URL or domain name. Required.                                |

All standard `<a>` HTML attributes are also accepted.

## Integration Options

| Option         | Type                           | Description                                                                                                      |
| -------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `mode`         | `'standard' \| 'advanced'`    | `'standard'` injects the auto-render button script (default). `'advanced'` injects the manual-control script.   |
| `injectScript` | `boolean`                      | Inject the Google Preferred Sources library script into every page's `<head>`. Defaults to `true`. Set to `false` if you add the script manually. |
