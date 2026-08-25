import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import {
  loadPreferredSource,
  init,
  addPreferredSource,
  __setModuleLoader,
  __reset,
} from './client-esm.ts';

beforeEach(() => {
  __reset();
});

afterEach(() => {
  delete (globalThis as any).window;
});

function mockWindow() {
  (globalThis as any).window = globalThis;
}

test('rejects in non-browser environment', async () => {
  await assert.rejects(async () => loadPreferredSource(), /browser environment/);
});

test('loads module and resolves with API', async () => {
  mockWindow();
  __setModuleLoader(async () => ({
    preferredSource: {
      init: () => {},
      addPreferredSource: () => {},
    },
  }));
  const api = await loadPreferredSource();
  assert.equal(typeof api.init, 'function');
  assert.equal(typeof api.addPreferredSource, 'function');
});

test('init calls api.init with options', async () => {
  mockWindow();
  let received: any = null;
  __setModuleLoader(async () => ({
    preferredSource: {
      init: (opts: any) => {
        received = opts;
      },
      addPreferredSource: () => {},
    },
  }));
  await init({ theme: 'dark', lang: 'en' });
  assert.deepEqual(received, { theme: 'dark', lang: 'en' });
});

test('addPreferredSource initializes then triggers', async () => {
  mockWindow();
  const calls: string[] = [];
  __setModuleLoader(async () => ({
    preferredSource: {
      init: () => {
        calls.push('init');
      },
      addPreferredSource: () => {
        calls.push('trigger');
      },
    },
  }));
  await addPreferredSource();
  assert.deepEqual(calls, ['init', 'trigger']);
});

test('addPreferredSource re-initializes when options passed', async () => {
  mockWindow();
  const calls: string[] = [];
  __setModuleLoader(async () => ({
    preferredSource: {
      init: (opts: any) => {
        calls.push(`init:${JSON.stringify(opts)}`);
      },
      addPreferredSource: () => {
        calls.push('trigger');
      },
    },
  }));
  await init();
  await addPreferredSource({ theme: 'dark' });
  assert.deepEqual(calls, ['init:{}', 'init:{"theme":"dark"}', 'trigger']);
});

test('loadPreferredSource caches promise', async () => {
  mockWindow();
  __setModuleLoader(async () => ({
    preferredSource: {
      init: () => {},
      addPreferredSource: () => {},
    },
  }));
  const first = loadPreferredSource();
  const second = loadPreferredSource();
  assert.equal(first, second);
});

test('rejects on module load error', async () => {
  mockWindow();
  __setModuleLoader(async () => {
    throw new Error('Network error');
  });
  await assert.rejects(() => loadPreferredSource(), /Network error/);
});
