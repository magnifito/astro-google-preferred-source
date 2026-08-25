export interface PreferredSourceOptions {
  theme?: 'light' | 'dark';
  lang?: string;
}

export interface PreferredSourceAPI {
  init(options: PreferredSourceOptions): void;
  addPreferredSource(): void;
}

const MODULE_URL = 'https://news.google.com/swg/js/v1/publisher.mjs';

let apiPromise: Promise<PreferredSourceAPI> | null = null;
let initialized = false;

function assertBrowser(): void {
  if (typeof window === 'undefined') {
    throw new Error('Google Preferred Sources library requires a browser environment');
  }
}

export function loadPreferredSource(): Promise<PreferredSourceAPI> {
  assertBrowser();
  if (apiPromise) return apiPromise;

  apiPromise = import(/* @vite-ignore */ MODULE_URL)
    .then((module: any) => module.preferredSource as PreferredSourceAPI);

  return apiPromise;
}

export async function init(options: PreferredSourceOptions = {}): Promise<void> {
  const api = await loadPreferredSource();
  initialized = true;
  api.init(options);
}

export async function addPreferredSource(options?: PreferredSourceOptions): Promise<void> {
  const api = await loadPreferredSource();
  if (!initialized) {
    await init(options ?? {});
  } else if (options) {
    api.init(options);
  }
  api.addPreferredSource();
}
