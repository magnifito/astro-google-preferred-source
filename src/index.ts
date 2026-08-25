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
const VALID_MODES: readonly PreferredSourceMode[] = ['standard', 'advanced'];

let scriptInjected = false;

function validateOptions(options: GooglePreferredSourceOptions): void {
  if (options.mode !== undefined && !VALID_MODES.includes(options.mode)) {
    throw new Error(
      `Invalid mode: ${JSON.stringify(options.mode)}. Expected one of: ${VALID_MODES.join(', ')}.`,
    );
  }
}

export function __resetScriptInjected(): void {
  scriptInjected = false;
}

export default function googlePreferredSource(
  options: GooglePreferredSourceOptions = {},
): AstroIntegration {
  validateOptions(options);

  const { mode = 'standard', injectScript: shouldInjectScript = true } = options;

  return {
    name: '@puralex/astro-google-preferred-source',
    hooks: {
      'astro:config:setup': ({ injectScript, logger }) => {
        if (scriptInjected) {
          logger.warn('Script already injected, skipping duplicate integration setup.');
          return;
        }

        if (!shouldInjectScript) {
          logger.info('Google Preferred Sources script injection disabled.');
          scriptInjected = true;
          return;
        }

        scriptInjected = true;

        if (mode === 'standard') {
          logger.info('Injecting Google Preferred Sources script in standard mode.');
          injectScript(
            'head-inline',
            `(function(){var s=document.createElement('script');s.async=true;s.src='${PUBLISHER_SCRIPT_URL}';document.head.appendChild(s);})();`,
          );
        } else {
          logger.info('Injecting Google Preferred Sources script in advanced mode.');
          injectScript(
            'head-inline',
            `(function(){var s=document.createElement('script');s.async=true;s.setAttribute('preferred-sources-control','manual');s.src='${PUBLISHER_SCRIPT_URL}';document.head.appendChild(s);})();`,
          );
        }
      },
    },
  };
}

export {
  getBadgeAlt,
  getPreferredSourceDeeplinkUrl,
  normalizeLanguageCode,
  supportedBadgeLanguages,
  OFFICIAL_BADGE_ALTS,
  getBadgeAssetKey,
  type BadgeTheme,
  type BadgeSize,
  type ImageAsset,
} from './assets/badges.ts';


