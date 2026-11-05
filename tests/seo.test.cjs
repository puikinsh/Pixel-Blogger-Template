const assert = require('node:assert/strict');
const { join } = require('node:path');
const { spawnSync } = require('node:child_process');
const { test } = require('node:test');

test('SEO schema branches, canonical references, and standard post title', () => {
  const result = spawnSync('python3', [join(__dirname, 'seo_fixtures.py')], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.error?.message || result.stderr);
});
