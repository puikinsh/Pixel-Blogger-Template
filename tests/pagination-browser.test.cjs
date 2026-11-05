const { test } = require('node:test');
const { section, chrome, runBrowser } = require('./browser-support.cjs');

for (const width of [320, 1200]) {
test(`numbered navigation and label links work at ${width}px`, { skip: !chrome }, () => {
  const body = `<div class="pixel-navigation"></div><div id="hpick"><h1>Post title</h1></div>
    <div id="Blog1"><div class="blog-posts">${'<div class="grid-item"></div>'.repeat(6)}</div>
    <div id="blog-pager"><a class="blog-pager-older-link" href="https://example.com/search?updated-max=2026-11-01T10%3A00%3A00Z&amp;max-results=6">Older Posts</a></div></div>
    <div class="Label"><a id="with-query" href="https://example.com/search/label/Travel?m=1#posts">Travel</a>
    <a id="configured" href="https://example.com/search/label/Travel?max-results=20#posts">Travel</a>
    <a id="malformed" href="http://[">Invalid custom link</a></div>
    <div class="feturepostwidgetpixel"><div class="pixel_featured_widget pixel-initiate"><div class="HTML"><div class="widget-content"><span data-type="pixelfeatured" data-label="travel"></span></div></div></div></div>`;
  const production = section(' // Keep Blogger\'s native pager', '      /*]]>*/').replace(/\s*pagecurrentg\(\);\s*$/, '')
    + section('function pixelLimitLabelLinks()', 'pixelLimitLabelLinks();')
    + section('function initFeaturedGrid()', '// ---- Sidebar feed widgets:')
    + section('(function () {\n  var nav = document.querySelector(".pixel-navigation");', '//]]>');
  const script = `
    var urlactivepage = 'https://example.com/', perPage = 6, numPages = 5, home_page = '/', firstText = 'First', lastText = 'Last';
    var mode = 'failure';
    function pixelAttr(value) { return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;'); }
    function pixelFetchFeed(url, success, error) {
      if (url.includes('/feeds/posts/default/')) error();
      else if (url.includes('start-index')) {
        if (mode === 'failure') error();
        else success({feed: {entry: [{published: {$t: '2026-11-05T10:00:00Z'}}, {published: {$t: '2026-11-05T10:00:00Z'}}]}});
      } else success({feed: {openSearch$totalResults: {$t: '60'}}});
    }
    ${production}
    function check(ok, message) { if (!ok) throw new Error(message); }
    try {
      var native = document.getElementById('blog-pager');
      var oldLink = native.querySelector('a'), originalHref = oldLink.href;
      pagecurrentg();
      var area = document.getElementById('pixel-numbered-pager');
      check(area && native.querySelector('a') === oldLink && oldLink.href === originalHref, 'native pager must remain intact');
      check(area.scrollWidth <= innerWidth, 'numbered navigation must wrap on mobile');
      check(!area.querySelector('a[href="#"]'), 'numbered controls must not masquerade as crawlable links');
      var button = area.querySelector('button[data-page="2"]');
      check(button && button.getAttribute('type') === 'button', 'numbered page button');
      button.click();
      check(!button.disabled && area.getAttribute('aria-busy') === 'false', 'failed request restores controls');
      check(document.getElementById('pixel-pager-status').textContent.includes('Older Posts'), 'visible fallback after failure');
      mode = 'ties'; button.click();
      check(!button.disabled && native.querySelector('a') === oldLink, 'tied dates preserve real navigation');
      pagecurrentg();
      check(document.querySelectorAll('#pixel-numbered-pager').length === 1, 'avoid duplicate numbered controls');
      pixelLimitLabelLinks();
      var label = new URL(document.getElementById('with-query').href);
      check(label.searchParams.get('m') === '1' && label.searchParams.get('max-results') === '6' && label.hash === '#posts', 'preserve label query and fragment');
      check(new URL(document.getElementById('configured').href).searchParams.get('max-results') === '20', 'keep explicit label limit');
      check(document.getElementById('malformed').getAttribute('href') === 'http://[', 'malformed links must not stop initialization');
      check(document.querySelectorAll('h1').length === 1 && document.querySelector('.pixel-navigation').nextElementSibling.id === 'hpick', 'move the hero without duplicating its title');
      initFeaturedGrid();
      var featured = document.querySelector('.pixel_featured_widget');
      check(!featured.classList.contains('pixel-initiate') && featured.textContent.includes('unavailable'), 'failed featured feed must not leave an invisible reserved block');
      document.body.dataset.result = 'passed';
    } catch (error) {
      var pre = document.createElement('pre'); pre.id = 'failure'; pre.textContent = error.stack; document.body.appendChild(pre);
    }
  `;
  runBrowser(body, script, width);
});
}
