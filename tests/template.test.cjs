const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const source = readFileSync(join(__dirname, '..', 'Pixel-Blogger-Template.xml'), 'utf8');
function section(start, end) {
  const from = source.indexOf(start);
  const to = source.indexOf(end, from);
  assert.ok(from >= 0 && to > from, `Missing template section: ${start}`);
  return source.slice(from, to);
}
const helpers = section('function pixelFetchFeed(', '// ---- Main navigation:');
const pager = section(' // Keep Blogger\'s native pager', '      /*]]>*/');

test('skin variables are declared, including the legacy slider setting from issue #1', () => {
  const skin = section('<b:skin><![CDATA[', ']]></b:skin>');
  const declared = new Set([...skin.matchAll(/<Variable\b[^>]*\bname=["']([^"']+)["']/g)].map(match => match[1]));
  assert.ok(declared.has('slider'), 'Blogger must receive the slider variable declaration');
  const css = skin.replace(/\/\*[\s\S]*?\*\//g, '');
  const references = [...css.matchAll(/\$\(([\w.]+)\)|\$([a-zA-Z_]\w*)/g)].map(match => match[1] || match[2]);
  for (const name of references) assert.ok(declared.has(name), `Undeclared Blogger skin variable: ${name}`);
});

function makePager(url, total = 60, options = {}) {
  const requests = [];
  const elements = {};
  const native = {
    innerHTML: 'native older/newer links',
    querySelector() { return null; },
    insertBefore(area) {
      elements[area.id] = area;
      elements['pixel-pager-status'] = { textContent: '' };
    },
  };
  elements['blog-pager'] = native;
  const size = Number(new URL(url).searchParams.get('max-results')) || 6;
  const count = options.count ?? size;
  const context = {
    URL, urlactivepage: url, perPage: options.configSize ?? 6, numPages: 5, home_page: '/',
    firstText: 'First', lastText: 'Last', prevText: 'Previous', nextText: 'Next',
    location: { href: url },
    document: {
      querySelectorAll: () => Array(count).fill({}),
      querySelector: () => options.olderUrl ? { href: options.olderUrl } : null,
      getElementById: id => elements[id] || null,
      createElement: () => ({ innerHTML: '', setAttribute() {}, querySelectorAll: () => [], remove() { delete elements[this.id]; delete elements['pixel-pager-status']; } }),
    },
    pixelAttr: value => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;'),
    pixelFetchFeed(path, success) {
      requests.push(path);
      const feedSize = options.olderUrl ? Number(new URL(options.olderUrl).searchParams.get('max-results')) : size;
      const entries = options.entries || Array.from({ length: Math.min(feedSize + 1, Number(total) || 0) }, (_, i) => ({ published: { $t: new Date(Date.UTC(2026, 10, 5, 12) - i * 60000).toISOString() } }));
      if (total !== null) success({ feed: { openSearch$totalResults: { $t: String(total) }, entry: entries } });
    },
  };
  vm.createContext(context);
  vm.runInContext(pager, context);
  return { context, requests, native, elements };
}

test('HTML escaping preserves literal markup, quotes, and ampersands', () => {
  const context = vm.createContext({});
  vm.runInContext(helpers, context);
  assert.equal(context.pixelAttr(`<b title="O'Reilly">A & B</b>`), '&lt;b title=&quot;O&#39;Reilly&quot;&gt;A &amp; B&lt;/b&gt;');
});

test('empty-state image uses the real fallback URL', () => {
  const context = vm.createContext({ PIXEL_NO_THUMB: 'https://example.com/fallback.png' });
  vm.runInContext(section('var PIXEL_EMPTY_PANEL =', 'function pixelRecentItemHtml('), context);
  assert.match(context.PIXEL_EMPTY_PANEL, /src="https:\/\/example.com\/fallback.png"/);
  assert.doesNotMatch(context.PIXEL_EMPTY_PANEL, /\+ PIXEL_NO_THUMB/);
});

test('clean label URLs retain the complete encoded label and configured page size', () => {
  const { requests, context } = makePager('https://example.com/search/label/Travel%20%26%20Food%2FTrips');
  assert.equal(requests[0], '/feeds/posts/summary/-/Travel%20%26%20Food%2FTrips?max-results=7&alt=json&orderby=published');
  assert.equal(context.perPage, 6);
});

test('standard max-results query and page hash are respected', () => {
  const { context, elements } = makePager('https://example.com/search/label/travel?updated-max=2026-11-01T00%3A00%3A00Z&max-results=3#PageNo=2');
  assert.equal(context.currentPageNo, 2);
  assert.equal(context.perPage, 3);
  assert.match(elements['pixel-numbered-pager'].innerHTML, /aria-current="page">2/);
});

test('numbered pages preserve native crawlable navigation', () => {
  const { native, elements } = makePager('https://example.com/search?updated-max=2026-11-01T00%3A00%3A00Z&max-results=6#PageNo=10');
  assert.equal(native.innerHTML, 'native older/newer links');
  assert.match(elements['pixel-numbered-pager'].innerHTML, /data-page="9"/);
  assert.doesNotMatch(elements['pixel-numbered-pager'].innerHTML, /href="#"/);
});

for (const path of [
  '/search?max-results=6&q=hello', '/search?q=hello', '/2026/11/',
  '/search?updated-max=2026-11-01T12%3A00%3A00Z', '/#PageNo=10',
  '/search?updated-min=2026-01-01', '/search?reverse-paginate=true',
]) {
  test(`native navigation remains for ${path}`, () => {
    const { requests, native } = makePager('https://example.com' + path);
    assert.equal(requests.length, 0);
    assert.equal(native.innerHTML, 'native older/newer links');
  });
}

for (const total of [0, null, 'invalid']) {
  test(`empty, failed, or invalid feeds preserve native navigation (${total})`, () => {
    const { native } = makePager('https://example.com/', total);
    assert.equal(native.innerHTML, 'native older/newer links');
  });
}

test('page cursor uses the preceding post and preserves timestamp precision and timezone', () => {
  const { context } = makePager('https://example.com/search/label/travel?max-results=6');
  const timestamp = '2026-11-04T10:15:30.123+05:30';
  context.pixelFetchFeed = (path, success) => {
    assert.equal(path, '/feeds/posts/summary/-/travel?start-index=6&max-results=2&alt=json&orderby=published');
    success({ feed: { entry: [{ published: { $t: timestamp } }, { published: { $t: '2026-11-03T00:00:00Z' } }] } });
  };
  context.redirectlabel(2);
  assert.equal(context.location.href, '/search/label/travel?updated-max=' + encodeURIComponent(timestamp) + '&max-results=6#PageNo=2');
});

test('missing cursor entry leaves the current page in place', () => {
  const url = 'https://example.com/';
  const { context } = makePager(url);
  context.pixelFetchFeed = (path, success) => success({ feed: {} });
  context.redirectpage(2);
  assert.equal(context.location.href, url);
});


test('Blogger auto-pagination disables fixed page jumps', () => {
  const { native, elements } = makePager('https://example.com/', 60, { count: 4 });
  assert.equal(native.innerHTML, 'native older/newer links');
  assert.equal(elements['pixel-numbered-pager'], undefined);
});

test('homepage page size follows the native Older Posts URL', () => {
  const { context, elements } = makePager('https://example.com/', 60, { count: 7, olderUrl: 'https://example.com/search?updated-max=2026-11-01&max-results=7' });
  assert.equal(context.perPage, 7);
  assert.ok(elements['pixel-numbered-pager']);
});

for (const value of ['2garbage', '-1', 'Infinity', '9007199254740993']) {
  test(`invalid page size preserves native navigation: ${value}`, () => {
    const { requests } = makePager('https://example.com/?max-results=' + value, 60, { count: 6 });
    assert.equal(requests.length, 0);
  });
}

for (const boundary of [
  ['2026-11-04T10:00:00Z', '2026-11-04T10:00:00Z'],
  ['2026-11-04T10:00:00Z', 'invalid'],
  ['invalid', '2026-11-04T10:00:00Z'],
]) {
  test(`unsafe cursor boundary does not skip posts: ${boundary}`, () => {
    const { context, elements } = makePager('https://example.com/');
    context.pixelFetchFeed = (path, success) => success({ feed: { entry: boundary.map(value => ({ published: { $t: value } })) } });
    context.redirectpage(2);
    assert.equal(context.location.href, 'https://example.com/');
    assert.equal(elements['pixel-numbered-pager'], undefined);
  });
}

test('cursor fetch failure reports the native fallback', () => {
  const { context, elements, native } = makePager('https://example.com/');
  context.pixelFetchFeed = (path, success, error) => error();
  context.redirectpage(2);
  assert.equal(elements['pixel-numbered-pager'], undefined);
  assert.equal(native.innerHTML, 'native older/newer links');
});

test('known duplicate publication dates keep the native pager without offering broken numbers', () => {
  const entries = Array.from({ length: 7 }, () => ({ published: { $t: '2017-11-05T10:00:00Z' } }));
  const { native, elements } = makePager('https://example.com/', 60, { entries });
  assert.equal(elements['pixel-numbered-pager'], undefined);
  assert.equal(native.innerHTML, 'native older/newer links');
});

test('a single page has no unnecessary numbered controls', () => {
  const { elements } = makePager('https://example.com/', 6);
  assert.equal(elements['pixel-numbered-pager'], undefined);
});

test('stale cursor response cannot overwrite a newer navigation request', () => {
  const { context } = makePager('https://example.com/');
  const responses = [];
  context.pixelFetchFeed = (path, success) => responses.push(success);
  context.redirectpage(2);
  context.redirectpage(3);
  const data = { feed: { entry: [
    { published: { $t: '2026-11-04T10:00:00Z' } }, { published: { $t: '2026-11-03T10:00:00Z' } },
  ] } };
  responses[1](data);
  responses[0](data);
  assert.match(context.location.href, /#PageNo=3$/);
});

for (const [hasPane, shortname, expected] of [[false, 'example-site', 0], [true, '', 0], [true, 'example-site', 1]]) {
  test(`Disqus loads only with its pane and a configured shortname (${hasPane}, ${shortname || 'empty'})`, () => {
    const widget = section("<b:widget id='HTML989'", '</b:widget>');
    const script = widget.slice(widget.indexOf('&lt;script'), widget.indexOf('&lt;/script&gt;'))
      .replace(/^&lt;script[^\n]+\n/, '')
      .replace(/<data:content\.jsEscaped\/>/g, shortname)
      .replace(/&#39;/g, "'");
    const loaded = [];
    vm.runInNewContext(script, { document: {
      getElementById: () => hasPane ? {} : null,
      createElement: () => ({}),
      getElementsByTagName: () => [{ appendChild: script => loaded.push(script) }],
    } });
    assert.equal(loaded.length, expected);
    if (expected) assert.equal(loaded[0].src, 'https://example-site.disqus.com/embed.js');
  });
}
