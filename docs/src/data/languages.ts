export interface Language {
  code: string;
  name: string;
  hasAssets: boolean;
}

export const languages: Language[] = [
  { code: 'ar', name: 'Arabic', hasAssets: false },
  { code: 'bg', name: 'Bulgarian', hasAssets: false },
  { code: 'bn', name: 'Bengali', hasAssets: false },
  { code: 'cs', name: 'Czech', hasAssets: false },
  { code: 'da', name: 'Danish', hasAssets: true },
  { code: 'de', name: 'German', hasAssets: true },
  { code: 'el', name: 'Greek', hasAssets: false },
  { code: 'en', name: 'English', hasAssets: true },
  { code: 'en-GB', name: 'English (UK)', hasAssets: false },
  { code: 'es', name: 'Spanish', hasAssets: true },
  { code: 'es-419', name: 'Spanish (Latin America)', hasAssets: false },
  { code: 'et', name: 'Estonian', hasAssets: true },
  { code: 'fil', name: 'Filipino', hasAssets: false },
  { code: 'fr', name: 'French', hasAssets: true },
  { code: 'fr-CA', name: 'French (Canadian)', hasAssets: false },
  { code: 'gu', name: 'Gujarati', hasAssets: false },
  { code: 'hi', name: 'Hindi', hasAssets: true },
  { code: 'hr', name: 'Croatian', hasAssets: false },
  { code: 'hu', name: 'Hungarian', hasAssets: false },
  { code: 'id', name: 'Indonesian', hasAssets: false },
  { code: 'it', name: 'Italian', hasAssets: false },
  { code: 'iw', name: 'Hebrew', hasAssets: true },
  { code: 'ja', name: 'Japanese', hasAssets: true },
  { code: 'kn', name: 'Kannada', hasAssets: false },
  { code: 'ko', name: 'Korean', hasAssets: true },
  { code: 'lt', name: 'Lithuanian', hasAssets: false },
  { code: 'lv', name: 'Latvian', hasAssets: false },
  { code: 'ml', name: 'Malayalam', hasAssets: false },
  { code: 'mr', name: 'Marathi', hasAssets: false },
  { code: 'ms', name: 'Malay', hasAssets: false },
  { code: 'nl', name: 'Dutch', hasAssets: false },
  { code: 'no', name: 'Norwegian (Bokmal)', hasAssets: true },
  { code: 'pa', name: 'Punjabi', hasAssets: false },
  { code: 'pl', name: 'Polish', hasAssets: false },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', hasAssets: true },
  { code: 'pt-PT', name: 'Portuguese (Portugal)', hasAssets: false },
  { code: 'ro', name: 'Romanian', hasAssets: false },
  { code: 'ru', name: 'Russian', hasAssets: true },
  { code: 'sk', name: 'Slovak', hasAssets: false },
  { code: 'sl', name: 'Slovenian', hasAssets: false },
  { code: 'sv', name: 'Swedish', hasAssets: true },
  { code: 'ta', name: 'Tamil', hasAssets: false },
  { code: 'te', name: 'Telugu', hasAssets: false },
  { code: 'th', name: 'Thai', hasAssets: false },
  { code: 'tr', name: 'Turkish', hasAssets: true },
  { code: 'uk', name: 'Ukrainian', hasAssets: true },
  { code: 'ur', name: 'Urdu', hasAssets: false },
  { code: 'vi', name: 'Vietnamese', hasAssets: false },
  { code: 'zh-CN', name: 'Chinese (Simplified)', hasAssets: false },
  { code: 'zh-HK', name: 'Chinese (Hong Kong)', hasAssets: false },
  { code: 'zh-TW', name: 'Chinese (Traditional)', hasAssets: false },
];

export function getAssetPath(lang: Language, theme: 'light' | 'dark', size: '1x' | '2x' = '1x'): string {
  const dir = lang.code.toUpperCase();
  const fileCode = lang.code === 'en' ? 'en' : dir;
  const suffix = size === '2x' ? '@2x' : '';
  return `/astro-google-preferred-source/assets/preferred-sources/${dir}/google_preferred_source_badge_${theme}_${fileCode}${suffix}.png`;
}
