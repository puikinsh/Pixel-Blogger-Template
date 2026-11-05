const assert = require('node:assert/strict');
const { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { pathToFileURL } = require('node:url');
const { spawnSync } = require('node:child_process');
const { test } = require('node:test');

const source = readFileSync(join(__dirname, '..', 'Pixel-Blogger-Template.xml'), 'utf8');
function section(start, end) {
  const from = source.indexOf(start);
  const to = source.indexOf(end, from);
  assert.ok(from >= 0 && to > from, `Missing section: ${start}`);
  return source.slice(from, to);
}
const chrome = process.env.CHROME_BIN || [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].find(existsSync);

// Real DOM regression tests run offline against the production functions.
test('search, menus, tabs, feed text, and gallery work in Chrome', { skip: !chrome }, () => {
  const scratch = mkdtempSync(join(tmpdir(), 'pixel-browser-'));
  try {
    const production = [
      section('function initSearchOverlay()', 'initSearchOverlay();'),
      section('function pixelFetchFeed(', '// ---- Main navigation:'),
      section('window.selectnav=', '//main'),
      section('function initMainMenu(', '// ---- Mega menus:'),
      section('var pixelTabGroup =', 'document.addEventListener("DOMContentLoaded", function () {\n  initSidebarTabs();'),
      section('function pixelExcerpt(', 'function initCustomWidgets('),
    ].join('\n');
    const checks = String.raw`
      function check(value, message) { if (!value) throw new Error(message); }
      function key(element, name) {
        element.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true }));
      }
      var perPage = 6, cmtal = true, PIXEL_NO_THUMB = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      var no_image = PIXEL_NO_THUMB;
      function pixelLoadSwiper() { return Promise.resolve(); }
      function Swiper() {}
      async function runChecks() { try {
        initSearchOverlay();
        var searchTrigger = document.querySelector('.pixel-serch');
        var searchDialog = document.getElementById('pixel-search-dialog');
        searchTrigger.focus(); searchTrigger.click();
        check(searchDialog.open && searchDialog.matches(':modal'), 'search must open as a modal');
        check(getComputedStyle(searchDialog).display !== 'none', 'search must be visible with theme styles');
        check(document.activeElement === searchDialog.querySelector('input'), 'focus search field');
        check(searchTrigger.getAttribute('aria-expanded') === 'true', 'expanded search state');
        searchTrigger.focus();
        check(document.activeElement !== searchTrigger, 'background must be inert while search is open');
        var searchClosed = new Promise(function (resolve) { searchDialog.addEventListener('close', resolve, { once: true }); });
        searchDialog.querySelector('.btn-mini-close').click();
        await searchClosed;
        check(!searchDialog.open && document.activeElement === searchTrigger, 'closing search restores focus');
        check(searchTrigger.getAttribute('aria-expanded') === 'false', 'collapsed search state');
        document.body.insertAdjacentHTML('beforeend', '<div id="pixel-menu"><div class="LinkList widget"><ul></ul></div></div>');
        var flat = document.querySelector('#pixel-menu ul');
        ['Home', '_Travel & <em>literal</em>', '__Child', '_Sibling', 'Rock_&_Roll', 'Travel & Food'].forEach(function (title, i) {
          var li = document.createElement('li'), a = document.createElement('a');
          a.textContent = title;
          a.setAttribute('href', i === 5 ? '[mega menu]' : '/search?q=' + encodeURIComponent("O'Reilly & Co"));
          li.appendChild(a); flat.appendChild(li);
        });
        initMainMenu();
        var root = document.getElementById('pixel_menu');
        check(root.children.length === 3, 'menu siblings must not become nested');
        check(root.children[0].querySelectorAll(':scope > ul > li').length === 2, 'submenu siblings');
        check(root.children[0].querySelector(':scope > ul > li > ul > li > a').textContent === 'Child', 'second-level submenu');
        check(root.children[1].firstChild.textContent === 'Rock_&_Roll', 'internal underscores must survive');
        check(!root.querySelector('em'), 'menu labels must remain text');
        check(root.children[2].firstChild.getAttribute('href') === '/search/label/Travel%20%26%20Food?max-results=6', 'mega menu label URL');
        var select = document.querySelector('select.selectnav');
        check(select.options[2].textContent.includes('<em>literal</em>'), 'mobile labels must remain text');
        check(select.options[1].value.includes('O%27Reilly') || select.options[1].value.includes("O'Reilly"), 'mobile URL quotes must survive');

        document.body.insertAdjacentHTML('beforeend', '<div class="pixel-sidebar-tabs" id="pixel-sidebar-tabs"><ul class="pixel-sidebar-tab"><li><a href="#tabside1"></a></li><li><a href="#tabside2"></a></li><li><a href="#tabside3"></a></li></ul><div id="tabside1"><div class="widget"><h2>Recent</h2>Recent content</div></div><div id="tabside2"></div><div id="tabside3"><div class="widget"><h2>Comments</h2>Comment content</div></div></div>');
        initSidebarTabs();
        var tabs = document.querySelectorAll('#pixel-sidebar-tabs [role="tab"]');
        check(tabs.length === 2, 'empty sidebar tab must be removed');
        check(tabs[0].tabIndex === 0 && tabs[1].tabIndex === -1, 'one tab stop');
        tabs[0].focus(); key(tabs[0], 'ArrowRight');
        check(document.activeElement === tabs[1] && tabs[1].getAttribute('aria-selected') === 'true', 'arrow activation and focus');
        check(document.getElementById('tabside1').hidden && !document.getElementById('tabside3').hidden, 'tab visibility');
        key(tabs[1], 'ArrowRight'); check(document.activeElement === tabs[0], 'arrow wrap');
        key(tabs[0], 'End'); check(document.activeElement === tabs[1], 'End key');
        key(tabs[1], 'Home'); check(document.activeElement === tabs[0], 'Home key');
        key(tabs[0], ' '); check(tabs[0].getAttribute('aria-selected') === 'true', 'Space activation');
        tabs[1].click(); check(tabs[1].getAttribute('aria-selected') === 'true', 'pointer activation');
        check(document.getElementById(tabs[1].getAttribute('aria-controls')).getAttribute('aria-labelledby') === tabs[1].id, 'tab/panel association');

        document.body.insertAdjacentHTML('beforeend', '<div class="pixel-tabs"><div data-tab="Blogger">Blogger comments</div><div data-tab="Facebook">Facebook comments</div></div>');
        initCommentTabs();
        var comments = document.querySelectorAll('.pixel-tabs [role="tab"]');
        check(comments[0].id !== tabs[0].id, 'tab IDs must be unique across groups');
        comments[0].focus(); key(comments[0], 'ArrowLeft');
        check(document.activeElement === comments[1] && comments[1].getAttribute('aria-selected') === 'true', 'comment tab keyboard control');

        var widget = document.createElement('div'); document.body.appendChild(widget);
        function entry(id, title, date) {
          return { title: { $t: title }, author: [{ name: { $t: 'O\'Reilly "&" <b>Co</b>' }, uri: { $t: 'https://example.com/author' } }],
            published: { $t: date }, media$thumbnail: { url: id === 'regular' ? PIXEL_NO_THUMB : 'https://img.youtube.com/vi/' + id + '/default.jpg' },
            link: [{ rel: 'alternate', href: 'https://example.com/' + id }] };
        }
        var entries = [entry('abcdefghijk', '<em>Video</em> & "one"', '2026-11-01T10:00:00Z'), entry('regular', 'Photo', '2026-11-02T10:00:00Z'), entry('lmnopqrstuv', 'Video three', '2026-11-03T10:00:00Z')];
        pixelRenderGalleryWidget(widget, { feed: { entry: entries } });
        check(!widget.querySelector('em, b'), 'feed text must not create elements');
        var controls = widget.querySelectorAll('.img_dyn.getinfo');
        check(controls[0].getAttribute('data-auth') === entries[0].author[0].name.$t, 'author attribute must round-trip quotes');
        controls[1].focus(); key(controls[1], 'Enter');
        var preview = widget.querySelector('.feature-image');
        check(preview.getAttribute('data-vidid') === 'regular', 'selected preview media ID');
        check(!preview.hasAttribute('role'), 'photo must not expose a play button');
        preview.click(); check(!widget.querySelector('iframe'), 'photo must not play the original video');
        check(widget.querySelector('time').getAttribute('datetime') === entries[1].published.$t, 'selected machine-readable date');
        check(widget.querySelector('time').parentElement.href === 'https://example.com/regular', 'selected date permalink');
        key(controls[2], ' ');
        check(widget.querySelector('iframe').getAttribute('src').includes('lmnopqrstuv'), 'selected video ID');
        check(widget.querySelector('iframe').title === 'YouTube video player', 'iframe accessible name');
        controls[1].click();
        check(!widget.querySelector('iframe') && preview.style.display === 'block', 'returning to photo clears video');

        var list = document.createElement('div'); document.body.appendChild(list);
        entries[0].content = { $t: '<p>Read &lt;img src=x onerror=alert(1)&gt; literally</p>' };
        pixelRenderListWidget(list, { feed: { entry: [entries[0]] } });
        check(list.querySelectorAll('img').length === 1, 'encoded excerpt markup must remain text');
        check(list.querySelector('.entry-content').textContent.includes('<img src=x onerror=alert(1)>'), 'excerpt entities must decode once');
        check(pixelExcerpt('<p>one two three four</p>', 3) === 'one two three', 'excerpt word limit');
        check(pixelText('<style>bad</style><script>bad<\/script><p>Good &amp; safe</p>') === 'Good & safe', 'exclude script and style text');
        check(list.querySelector('.entry-title').textContent === entries[0].title.$t, 'literal post title');
        document.body.dataset.result = 'passed';
      } catch (error) {
        document.body.dataset.result = 'failed';
        var pre = document.createElement('pre'); pre.textContent = error.stack; document.body.appendChild(pre);
      }
      }
      runChecks();
    `;
    const fixture = join(scratch, 'checks.html');
    const css = section('<b:skin><![CDATA[', ']]></b:skin>').replace('<b:skin><![CDATA[', '')
      .replace(/\$\(maincolor\)|\$maincolor/g, '#2942ee').replace(/\$\(lightcolor\)|\$lightcolor/g, '#f7f7f7')
      .replace(/\$\(body.background\)|\$\(slider\)/g, '#fff');
    const dialog = source.match(/<dialog aria-label='Search this blog'[^\n]+<\/dialog>/)[0];
    const trigger = source.match(/<button aria-controls='pixel-search-dialog'[^>]+><\/button>/)[0];
    writeFileSync(fixture, '<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; script-src \'unsafe-inline\'; style-src \'unsafe-inline\'; img-src data:"><style>' + css + '</style></head><body>' + dialog + '<div class="pixel-search-btn">' + trigger + '</div><script>' + production + '\n' + checks + '</script></body></html>');
    const result = spawnSync(chrome, [
      '--headless', '--disable-gpu', '--no-first-run', '--disable-background-networking',
      '--disable-component-update', '--disable-sync', '--no-default-browser-check',
      '--virtual-time-budget=1000',
      '--user-data-dir=' + join(scratch, 'profile'), '--dump-dom', pathToFileURL(fixture).href,
    ], { encoding: 'utf8', timeout: 30000, maxBuffer: 2 * 1024 * 1024 });
    assert.equal(result.status, 0, result.error?.message || result.stderr);
    const failure = result.stdout.match(/<pre>([\s\S]*?)<\/pre>/);
    assert.ok(/<body data-result="passed">/.test(result.stdout), failure ? failure[1] : result.stdout.slice(-1000));
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
});
