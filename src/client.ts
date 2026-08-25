export interface PreferredSourceOptions {
  theme?: 'light' | 'dark';
  lang?: string;
}

export interface PreferredSourceAPI {
  init(options: PreferredSourceOptions): void;
  addPreferredSource(): void;
}

type QueueItem = (api: PreferredSourceAPI) => void;

const SCRIPT_URL = 'https://news.google.com/swg/js/v1/publisher.js';
const MANUAL_CONTROL_ATTR = 'preferred-sources-control';
const LOAD_TIMEOUT_MS = 30_000;

let loadPromise: Promise<PreferredSourceAPI> | null = null;
let initialized = false;

function getGlobalQueue(): QueueItem[] | { push(cb: QueueItem): void } | undefined {
  return (globalThis as any).PREFERRED_SOURCE;
}

function setGlobalQueue(value: QueueItem[]): void {
  (globalThis as any).PREFERRED_SOURCE = value;
}

function isQueueLike(value: unknown): value is { push: (cb: QueueItem) => void } {
  return typeof (value as any)?.push === 'function';
}

function assertBrowser(): void {
  if (typeof document === 'undefined') {
    throw new Error('Google Preferred Sources library requires a browser environment');
  }
}

export function loadPreferredSource(): Promise<PreferredSourceAPI> {
  assertBrowser();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<PreferredSourceAPI>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Timed out waiting for Google Preferred Sources library'));
    }, LOAD_TIMEOUT_MS);

    const callback: QueueItem = (api) => {
      clearTimeout(timeout);
      resolve(api);
    };

    const queue = getGlobalQueue();
    if (Array.isArray(queue)) {
      queue.push(callback);
    } else if (isQueueLike(queue)) {
      queue.push(callback);
    } else {
      const newQueue: QueueItem[] = [];
      newQueue.push(callback);
      setGlobalQueue(newQueue);
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_URL}"]`,
    );

    if (existingScript) {
      if (existingScript.getAttribute(MANUAL_CONTROL_ATTR) !== 'manual') {
        clearTimeout(timeout);
        reject(
          new Error(
            'Google Preferred Sources library already loaded in standard mode; use mode: "advanced" or remove the standard script',
          ),
        );
      }
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute(MANUAL_CONTROL_ATTR, 'manual');
    script.src = SCRIPT_URL;
    script.onerror = () => {
      clearTimeout(timeout);
      reject(new Error('Failed to load Google Preferred Sources library'));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
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
