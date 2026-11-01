import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { Script } from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const inlineScripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter(([, attributes, source]) => !/\bsrc\s*=/i.test(attributes) && source.trim());

assert.ok(inlineScripts.length > 0, 'Expected inline JavaScript in index.html');
for (const [, , source] of inlineScripts) new Script(source);

for (const id of ['distance', 'speed', 'increase', 'departure', 'frequency', 'radar-data', 'fast-route-fill']) {
  assert.ok(html.includes(`id="${id}"`), `Missing required calculator element: ${id}`);
}
assert.ok(existsSync(new URL('../favicon.svg', import.meta.url)), 'favicon.svg must exist');

console.log(`Speedwise checks passed: ${inlineScripts.length} inline scripts parse; calculator hooks and favicon are present.`);
