import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import {
  loadPreferredSource,
  init,
  addPreferredSource,
  __reset,
} from './client.ts';

beforeEach(() => {
  __reset();
  delete (globalThis as any).PREFERRED_SOURCE;
});

afterEach(() => {
  delete (globalThis as any).document;
});

function createMockScript() {
  return {
    async: false,
    src: '',
    onerror: null as (() => void) | null,
    attributes: new Map<string, string>(),
    setAttribute(name: string, value: string) {
      this.attributes.set(name, value);
    },
    getAttribute(name: string) {
      return this.attributes.get(name);
    },
  };
}

function mockDocument({
  existingScript,
  autoResolveQueue = true,
}: {
  existingScript?: ReturnType<typeof createMockScript> | null;
  autoResolveQueue?: boolean;
} = {}) {
  const script = createMockScript();

  (globalThis as any).document = {
    querySelector: () => existingScript ?? null,
    createElement: () => script,
    head: {
      appendChild: (s: any) => {
        if (autoResolveQueue) {
          setTimeout(() => {
            const queue = (globalThis as any).PREFERRED_SOURCE;
            if (Array.isArray(queue) && queue.length > 0) {
              queue[0]({
                init: () => {},
                addPreferredSource: () => {},
              });
            }
          }, 0);
        }
      },
    },
  };

  return script;
}

test('rejects in non-browser environment', async () => {
  await assert.rejects(async () => loadPreferredSource(), /browser environment/);
});

test('loads script and resolves with API', async () => {
  mockDocument();
  const api = await loadPreferredSource();
  assert.equal(typeof api.init, 'function');
  assert.equal(typeof api.addPreferredSource, 'function');
});

test('reuses existing manual script', async () => {
  const existing = createMockScript();
  existing.setAttribute('preferred-sources-control', 'manual');
  mockDocument({ existingScript: existing });

  const promise = loadPreferredSource();

  // Simulate already-loaded library processing the queue
  setTimeout(() => {
    const queue = (globalThis as any).PREFERRED_SOURCE;
    if (Array.isArray(queue) && queue.length > 0) {
      queue[0]({
        init: () => {},
        addPreferredSource: () => {},
      });
    }
  }, 0);

  const api = await promise;
  assert.equal(typeof api.init, 'function');
});

test('rejects when standard-mode script is present', async () => {
  const existing = createMockScript();
  mockDocument({ existingScript: existing });
  await assert.rejects(() => loadPreferredSource(), /standard mode/);
});

test('rejects on script load error', async () => {
  const script = mockDocument({ autoResolveQueue: false });
  (globalThis as any).document.head.appendChild = () => {
    setTimeout(() => script.onerror?.(), 0);
  };
  await assert.rejects(() => loadPreferredSource(), /Failed to load/);
});

test('rejects on timeout', async () => {
  mockDocument({ autoResolveQueue: false });
  const originalSetTimeout = globalThis.setTimeout;
  (globalThis as any).setTimeout = (fn: () => void) => {
    fn();
    return 0 as any;
  };
  await assert.rejects(() => loadPreferredSource(), /Timed out/);
  globalThis.setTimeout = originalSetTimeout;
});

test('init calls api.init with options', async () => {
  mockDocument();
  let received: any = null;
  (globalThis as any).document.head.appendChild = () => {
    setTimeout(() => {
      const queue = (globalThis as any).PREFERRED_SOURCE;
      if (Array.isArray(queue) && queue.length > 0) {
        queue[0]({
          init: (opts: any) => {
            received = opts;
          },
          addPreferredSource: () => {},
        });
      }
    }, 0);
  };
  await init({ theme: 'dark', lang: 'en' });
  assert.deepEqual(received, { theme: 'dark', lang: 'en' });
});

test('addPreferredSource initializes then triggers', async () => {
  mockDocument();
  const calls: string[] = [];
  (globalThis as any).document.head.appendChild = () => {
    setTimeout(() => {
      const queue = (globalThis as any).PREFERRED_SOURCE;
      if (Array.isArray(queue) && queue.length > 0) {
        queue[0]({
          init: () => {
            calls.push('init');
          },
          addPreferredSource: () => {
            calls.push('trigger');
          },
        });
      }
    }, 0);
  };
  await addPreferredSource();
  assert.deepEqual(calls, ['init', 'trigger']);
});

test('addPreferredSource re-initializes when options passed', async () => {
  mockDocument();
  const calls: string[] = [];
  (globalThis as any).document.head.appendChild = () => {
    setTimeout(() => {
      const queue = (globalThis as any).PREFERRED_SOURCE;
      if (Array.isArray(queue) && queue.length > 0) {
        queue[0]({
          init: (opts: any) => {
            calls.push(`init:${JSON.stringify(opts)}`);
          },
          addPreferredSource: () => {
            calls.push('trigger');
          },
        });
      }
    }, 0);
  };
  await init();
  await addPreferredSource({ theme: 'dark' });
  assert.deepEqual(calls, ['init:{}', 'init:{"theme":"dark"}', 'trigger']);
});

test('loadPreferredSource caches promise', async () => {
  mockDocument();
  const first = loadPreferredSource();
  const second = loadPreferredSource();
  assert.equal(first, second);
  await first;
});

test('handles existing array queue', async () => {
  (globalThis as any).document = {
    querySelector: () => null,
    createElement: () => createMockScript(),
    head: { appendChild: () => {} },
  };
  (globalThis as any).PREFERRED_SOURCE = [];
  const promise = loadPreferredSource();

  setTimeout(() => {
    const queue = (globalThis as any).PREFERRED_SOURCE;
    if (Array.isArray(queue) && queue.length > 0) {
      queue[0]({
        init: () => {},
        addPreferredSource: () => {},
      });
    }
  }, 0);

  const api = await promise;
  assert.equal(typeof api.init, 'function');
});

test('handles existing queue-like object', async () => {
  (globalThis as any).document = {
    querySelector: () => null,
    createElement: () => createMockScript(),
    head: { appendChild: () => {} },
  };
  const callbacks: any[] = [];
  (globalThis as any).PREFERRED_SOURCE = {
    push: (cb: any) => callbacks.push(cb),
  };
  const promise = loadPreferredSource();

  setTimeout(() => {
    callbacks[0]({
      init: () => {},
      addPreferredSource: () => {},
    });
  }, 0);

  const api = await promise;
  assert.equal(typeof api.init, 'function');
});
