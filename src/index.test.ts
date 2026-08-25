import { test, beforeEach } from 'node:test';
import assert from 'node:assert';
import googlePreferredSource, { __resetScriptInjected } from './index.ts';

beforeEach(() => {
  __resetScriptInjected();
});

test('returns integration with correct name', () => {
  const integration = googlePreferredSource();
  assert.equal(integration.name, '@puralex/astro-google-preferred-source');
});

test('rejects invalid mode', () => {
  assert.throws(
    () => googlePreferredSource({ mode: 'invalid' as any }),
    /Invalid mode/,
  );
});

test('injects standard script by default', () => {
  let scriptContent = '';
  const integration = googlePreferredSource();
  integration.hooks['astro:config:setup']!({
    injectScript: (_stage: string, content: string) => {
      scriptContent = content;
    },
    logger: { info: () => {}, warn: () => {} },
  } as any);
  assert.match(scriptContent, /publisher\.js/);
  assert.doesNotMatch(scriptContent, /preferred-sources-control/);
});

test('injects manual script in advanced mode', () => {
  let scriptContent = '';
  const integration = googlePreferredSource({ mode: 'advanced' });
  integration.hooks['astro:config:setup']!({
    injectScript: (_stage: string, content: string) => {
      scriptContent = content;
    },
    logger: { info: () => {}, warn: () => {} },
  } as any);
  assert.match(scriptContent, /preferred-sources-control.*manual/);
});

test('does not inject script when injectScript is false', () => {
  let injected = false;
  const integration = googlePreferredSource({ injectScript: false });
  integration.hooks['astro:config:setup']!({
    injectScript: () => {
      injected = true;
    },
    logger: { info: () => {}, warn: () => {} },
  } as any);
  assert.equal(injected, false);
});

test('warns and skips on duplicate setup', () => {
  let injectCount = 0;
  let warnMessage = '';
  const integration = googlePreferredSource();
  const hook = integration.hooks['astro:config:setup']!;
  const args = {
    injectScript: () => {
      injectCount++;
    },
    logger: {
      info: () => {},
      warn: (msg: string) => {
        warnMessage = msg;
      },
    },
  } as any;

  hook(args);
  hook(args);

  assert.equal(injectCount, 1);
  assert.match(warnMessage, /already injected/);
});
