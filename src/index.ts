import type { AstroIntegration } from 'astro';

export type PreferredSourceMode = 'standard' | 'advanced';

export interface GooglePreferredSourceOptions {
  /**
   * Implementation mode.
   * - 'standard': auto-rendered Google button (default)
   * - 'advanced': manual control for custom UI triggers
   * @default 'standard'
   */
  mode?: PreferredSourceMode;
  /**
   * Inject the Preferred Sources library script into every page's `<head>`.
   * @default true
   */
  injectScript?: boolean;
}

const PUBLISHER_SCRIPT_URL = 'https://news.google.com/swg/js/v1/publisher.js';

export default function googlePreferredSource(
  options: GooglePreferredSourceOptions = {},
): AstroIntegration {
  const { mode = 'standard', injectScript: shouldInjectScript = true } = options;

  return {
    name: '@puralex/astro-google-preferred-source',
    hooks: {
      'astro:config:setup': ({ injectScript }) => {
        if (!shouldInjectScript) return;

        if (mode === 'standard') {
          injectScript(
            'head-inline',
            `(function(){var s=document.createElement('script');s.async=true;s.src='${PUBLISHER_SCRIPT_URL}';document.head.appendChild(s);})();`,
          );
        } else {
          injectScript(
            'head-inline',
            `(function(){var s=document.createElement('script');s.async=true;s.setAttribute('preferred-sources-control','manual');s.src='${PUBLISHER_SCRIPT_URL}';document.head.appendChild(s);})();`,
          );
        }
      },
    },
  };
}
