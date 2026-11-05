const { test } = require('node:test');
const { join } = require('node:path');
const { source, section, chrome, runBrowser } = require('./browser-support.cjs');

for (const width of [280, 320, 375, 768, 1024]) {
  test(`content, navigation, and search fit a ${width}px viewport`, { skip: !chrome }, () => {
    const dialog = source.match(/<dialog aria-label='Search this blog'[^\n]+<\/dialog>/)[0];
    const trigger = source.match(/<button aria-controls='pixel-search-dialog'[^>]+><\/button>/)[0];
    const image = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="1200" height="800" fill="#2942ee"/></svg>');
    const body = dialog + `
      <div id="Header1" class="Header pixel-wide body-row"><h1 class="title">${'Magazine'.repeat(7)}</h1></div>
      <div class="pixel-navigation"><div class="body-row menu-wrap"><div id="pixel-menu"><select class="selectnav" aria-label="Navigation"><option>Destinations and travel</option></select></div><div class="pixel-search-btn">${trigger}</div></div></div>
      <div id="content-wrapper" class="body-row"><main id="main-wrapper"><article><div class="post-body">
      <p>${'https://example.com/long/'.repeat(15)}</p><img width="1200" height="800" src="${image}" alt="Responsive sample"/>
      <pre>${'const longLine = 1234567890; '.repeat(15)}</pre>
      <table><tbody><tr>${'<td>Long unbreakable table heading</td>'.repeat(15)}</tr></tbody></table>
      <iframe title="Video" width="560" height="315" src="https://www.youtube.com/embed/abcdefghijk"></iframe>
      </div></article></main><aside id="sidebar-wrapper"><p>Sidebar content</p></aside></div>`;
    const script = section('function initSearchOverlay()', 'initSearchOverlay();') + `
      function check(ok, message) { if (!ok) throw new Error(message); }
      window.addEventListener('load', function () { try {
        check(innerWidth === ${width}, 'Expected viewport ${width}, got ' + innerWidth);
        ['#Header1', '#main-wrapper', '#sidebar-wrapper', '.post-body img', '.post-body pre', '.post-body table', '.post-body iframe'].forEach(function (selector) {
          var rect = document.querySelector(selector).getBoundingClientRect();
          check(rect.left >= -1 && rect.right <= innerWidth + 1, selector + ' exceeds viewport: ' + rect.left + '/' + rect.right);
        });
        var image = document.querySelector('.post-body img').getBoundingClientRect();
        check(document.querySelector('#Header1 h1').scrollWidth <= document.querySelector('#Header1 h1').clientWidth + 1, 'long site title must wrap');
        check(document.querySelector('.post-body table').scrollWidth > document.querySelector('.post-body table').clientWidth, 'wide table must scroll instead of crushing columns');
        check(Math.abs(image.width / image.height - 1.5) < .02, 'image aspect ratio: ' + image.width + '/' + image.height + ', natural=' + document.querySelector('.post-body img').naturalWidth);
        var video = document.querySelector('iframe').getBoundingClientRect();
        check(Math.abs(video.width / video.height - 16 / 9) < .02, 'video aspect ratio');
        if (innerWidth <= 980) {
          check(getComputedStyle(document.getElementById('sidebar-wrapper')).position === 'static', 'stacked sidebar must not stick');
          check(document.getElementById('sidebar-wrapper').getBoundingClientRect().width > 0, 'sidebar content must remain available');
        }
        var trigger = document.querySelector('.pixel-serch');
        check(trigger.getBoundingClientRect().width >= 44, 'search opener must remain visible');
        if (innerWidth <= 980) {
          var select = document.querySelector('select').getBoundingClientRect();
          check(select.right <= trigger.getBoundingClientRect().left, 'mobile navigation overlaps search');
        }
        initSearchOverlay(); trigger.click();
        var field = document.querySelector('dialog input').getBoundingClientRect();
        check(field.width >= Math.min(220, innerWidth - 40), 'search field is too narrow: ' + field.width);
        check(field.left >= 0 && field.right <= innerWidth, 'search field overflow');
        document.querySelector('dialog').close();
        document.body.dataset.result = 'passed';
      } catch (error) {
        var pre = document.createElement('pre'); pre.id = 'failure'; pre.textContent = error.stack; document.body.appendChild(pre);
      } });
    `;
    const screenshot = process.env.PIXEL_SCREENSHOT_DIR && join(process.env.PIXEL_SCREENSHOT_DIR, `layout-${width}.png`);
    runBrowser(body, script, width, screenshot);
  });
}
