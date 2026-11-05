const assert = require('node:assert/strict');
const { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { pathToFileURL } = require('node:url');
const { spawnSync } = require('node:child_process');

const source = readFileSync(join(__dirname, '..', 'Pixel-Blogger-Template.xml'), 'utf8');
function section(start, end) {
  const from = source.indexOf(start), to = source.indexOf(end, from);
  assert.ok(from >= 0 && to > from, `Missing section: ${start}`);
  return source.slice(from, to);
}
const css = section('<b:skin><![CDATA[', ']]></b:skin>').replace('<b:skin><![CDATA[', '')
  .replace(/\$\(maincolor\)|\$maincolor/g, '#2942ee').replace(/\$\(lightcolor\)|\$lightcolor/g, '#f7f7f7')
  .replace(/\$\(body.background\)|\$\(slider\)/g, '#fff');
const chrome = process.env.CHROME_BIN || [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].find(existsSync);

function runBrowser(body, script, width = 1200, screenshot) {
  const scratch = mkdtempSync(join(tmpdir(), 'pixel-layout-'));
  try {
    const path = join(scratch, 'fixture.html');
    const fixture = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; script-src \'unsafe-inline\'; style-src \'unsafe-inline\'; img-src data:"><style>' + css + '\n*{transition:none!important;animation:none!important}</style></head><body>' + body + '<script>' + script + '</script></body></html>';
    // A sized iframe provides an exact CSS viewport below Chrome's 500px window minimum.
    const encoded = JSON.stringify(fixture).replace(/</g, '\\u003c');
    writeFileSync(path, '<!doctype html><html><body style="margin:0"><iframe id="viewport" style="display:block;border:0;width:' + width + 'px;height:1000px"></iframe><script>var frame=document.getElementById("viewport");frame.onload=function(){var body=frame.contentDocument.body;document.body.dataset.result=body.dataset.result||"failed";var error=body.querySelector("#failure");if(error)document.body.appendChild(error.cloneNode(true));};frame.srcdoc=' + encoded + ';</script></body></html>');
    const args = [
      '--headless', '--disable-gpu', '--no-first-run', '--disable-background-networking',
      '--disable-component-update', '--disable-sync', '--no-default-browser-check',
      '--force-device-scale-factor=1', '--window-size=' + width + ',1000',
      '--virtual-time-budget=1500', '--user-data-dir=' + join(scratch, 'profile'), '--dump-dom',
    ];
    if (screenshot) args.push('--screenshot=' + screenshot);
    const result = spawnSync(chrome, [...args, pathToFileURL(path).href], { encoding: 'utf8', timeout: 30000, maxBuffer: 2 * 1024 * 1024 });
    assert.equal(result.status, 0, result.error?.message || result.stderr || `Chrome signal: ${result.signal}`);
    const failure = result.stdout.match(/<pre id="failure">([\s\S]*?)<\/pre>/);
    assert.ok(/<body[^>]*data-result="passed"/.test(result.stdout), failure ? failure[1] : result.stdout.slice(-1000));
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

module.exports = { source, section, css, chrome, runBrowser };
