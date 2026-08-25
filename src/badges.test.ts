import { test } from 'node:test';
import assert from 'node:assert';
import {
  getBadgeAlt,
  getPreferredSourceDeeplinkUrl,
  normalizeLanguageCode,
  supportedBadgeLanguages,
  OFFICIAL_BADGE_ALTS,
  getBadgeAssetKey,
} from './assets/badges.ts';

test('normalizeLanguageCode handles valid codes and aliases', () => {
  assert.equal(normalizeLanguageCode('en'), 'en');
  assert.equal(normalizeLanguageCode('EN'), 'en');
  assert.equal(normalizeLanguageCode('KO'), 'ko');
  assert.equal(normalizeLanguageCode('ko-KR'), 'ko');
  assert.equal(normalizeLanguageCode('pt-BR'), 'pt-br');
  assert.equal(normalizeLanguageCode('pt_BR'), 'pt-br');
  assert.equal(normalizeLanguageCode('he'), 'iw');
  assert.equal(normalizeLanguageCode('iw'), 'iw');
  assert.equal(normalizeLanguageCode('nb'), 'no');
  assert.equal(normalizeLanguageCode(undefined), 'en');
});

test('getBadgeAlt returns localized official alt text', () => {
  assert.equal(getBadgeAlt('ko'), 'Google에서 선호하는 출처로 추가');
  assert.equal(getBadgeAlt('KO'), 'Google에서 선호하는 출처로 추가');
  assert.equal(getBadgeAlt('en'), 'Add as a preferred source on Google');
  assert.equal(getBadgeAlt('ja'), 'Google で優先するソースとして追加');
  assert.equal(getBadgeAlt('de'), 'Als bevorzugte Quelle auf Google hinzufügen');
  assert.equal(getBadgeAlt('fr'), 'Ajouter en tant que source préférée sur Google');
  assert.equal(getBadgeAlt('es'), 'Añadir como fuente preferida en Google');
  assert.equal(getBadgeAlt('unknown-lang'), 'Add as a preferred source on Google');
});

test('getBadgeAssetKey generates correct glob lookup key', () => {
  assert.equal(
    getBadgeAssetKey('ko', 'light', '1x'),
    '../assets/preferred-sources/KO/google_preferred_source_badge_light_KO.png',
  );
  assert.equal(
    getBadgeAssetKey('en', 'dark', '2x'),
    '../assets/preferred-sources/EN/google_preferred_source_badge_dark_en@2x.png',
  );
  assert.equal(
    getBadgeAssetKey('pt-BR', 'light', '1x'),
    '../assets/preferred-sources/PT-BR/google_preferred_source_badge_light_PT-BR.png',
  );
});

test('all supportedBadgeLanguages have official alt text', () => {
  for (const lang of supportedBadgeLanguages) {
    const code = normalizeLanguageCode(lang);
    assert.ok(OFFICIAL_BADGE_ALTS[code], `Missing alt text for ${lang}`);
  }
});

test('getPreferredSourceDeeplinkUrl generates encoded google preferences url', () => {
  assert.equal(
    getPreferredSourceDeeplinkUrl('example.com'),
    'https://www.google.com/preferences/source?q=example.com',
  );
  assert.equal(
    getPreferredSourceDeeplinkUrl('https://my-site.org/news'),
    'https://www.google.com/preferences/source?q=https%3A%2F%2Fmy-site.org%2Fnews',
  );
});
