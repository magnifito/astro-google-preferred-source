export type BadgeTheme = 'light' | 'dark';
export type BadgeSize = '1x' | '2x';

export interface ImageAsset {
  src: string;
  width?: number;
  height?: number;
  format?: string;
}

export const supportedBadgeLanguages = [
  'da',
  'de',
  'en',
  'es',
  'et',
  'fi',
  'fr',
  'hi',
  'iw',
  'ja',
  'ko',
  'no',
  'pt-BR',
  'ru',
  'sv',
  'tr',
  'uk',
] as const;

export const OFFICIAL_BADGE_ALTS: Record<string, string> = {
  da: 'Tilføj som foretrukken kilde på Google',
  de: 'Als bevorzugte Quelle auf Google hinzufügen',
  en: 'Add as a preferred source on Google',
  es: 'Añadir como fuente preferida en Google',
  et: "Lisage Google'is eelistatud allikana",
  fi: 'Lisää ensisijaiseksi lähteeksi Googlessa',
  fr: 'Ajouter en tant que source préférée sur Google',
  hi: 'Google पर पसंदीदा सोर्स के तौर पर जोड़ें',
  iw: 'הוספה כמקור מועדף ב-Google',
  he: 'הוספה כמקור מועדף ב-Google',
  ja: 'Google で優先するソースとして追加',
  ko: 'Google에서 선호하는 출처로 추가',
  no: 'Legg til som foretrukket kilde på Google',
  nb: 'Legg til som foretrukket kilde på Google',
  'pt-br': 'Adicione como fonte preferencial no Google',
  pt: 'Adicione como fonte preferencial no Google',
  ru: 'Добавить в список основных источников в Google',
  sv: 'Lägg till som önskad källa på Google',
  tr: "Google'da tercih edilen kaynak olarak ekleyin",
  uk: 'Додати як бажане джерело в Google',
};

const SUPPORTED_SET = new Set<string>(supportedBadgeLanguages.map((l) => l.toLowerCase()));

/**
 * Normalizes a language code (e.g. 'EN' -> 'en', 'pt_BR' -> 'pt-br').
 */
export function normalizeLanguageCode(lang?: string): string {
  if (!lang) return 'en';
  const normalized = lang.toLowerCase().replace('_', '-');
  if (normalized === 'he') return 'iw';
  if (normalized === 'nb') return 'no';
  if (normalized === 'pt') return 'pt-br';
  if (SUPPORTED_SET.has(normalized)) return normalized;

  // Try primary language subtag (e.g. 'en-US' -> 'en', 'es-ES' -> 'es')
  const primary = normalized.split('-')[0];
  if (primary === 'he') return 'iw';
  if (primary === 'nb') return 'no';
  if (primary === 'pt') return 'pt-br';
  if (SUPPORTED_SET.has(primary)) return primary;

  return 'en';
}

/**
 * Retrieves the localized official badge alt text for a given language.
 */
export function getBadgeAlt(lang: string = 'en'): string {
  const code = normalizeLanguageCode(lang);
  return OFFICIAL_BADGE_ALTS[code] ?? OFFICIAL_BADGE_ALTS['en'];
}

/**
 * Constructs the Google Preferred Source deeplink URL.
 */
export function getPreferredSourceDeeplinkUrl(url: string): string {
  return `https://www.google.com/preferences/source?q=${encodeURIComponent(url)}`;
}

/**
 * Constructs the relative asset path key for import.meta.glob lookup.
 */
export function getBadgeAssetKey(
  lang: string = 'en',
  theme: BadgeTheme = 'light',
  size: BadgeSize = '1x'
): string {
  const code = normalizeLanguageCode(lang);
  const dir = code === 'pt-br' ? 'PT-BR' : code.toUpperCase();
  const fileCode = code === 'en' ? 'en' : dir;
  const suffix = size === '2x' ? '@2x' : '';
  return `../assets/preferred-sources/${dir}/google_preferred_source_badge_${theme}_${fileCode}${suffix}.png`;
}
