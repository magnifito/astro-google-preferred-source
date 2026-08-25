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

let loadPromise: Promise<PreferredSourceAPI> | null = null;
let initialized = false;

function getGlobalQueue(): QueueItem[] | { push(cb: QueueItem): void } | undefined {
  return (self as any).PREFERRED_SOURCE;
}

function setGlobalQueue(value: QueueItem[]): void {
  (self as any).PREFERRED_SOURCE = value;
}

function isQueueLike(value: unknown): value is { push: (cb: QueueItem) => void } {
  return typeof (value as any)?.push === 'function';
}

export function loadPreferredSource(): Promise<PreferredSourceAPI> {
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<PreferredSourceAPI>((resolve) => {
    const callback: QueueItem = (api) => resolve(api);

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

    if (!document.querySelector(`script[src="${SCRIPT_URL}"]`)) {
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('preferred-sources-control', 'manual');
      script.src = SCRIPT_URL;
      document.head.appendChild(script);
    }
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
