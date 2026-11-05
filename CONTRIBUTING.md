# Contributing to Pixel

Pixel ships as one Blogger XML template. Development checks require Python 3.9+ and Node.js with the built-in test runner (Node 18 or newer); installing the theme requires neither. There are no npm dependencies or build artifacts.

## Validate changes

From the repository root, run:

```sh
python3 scripts/check_template.py
node --test tests/*.test.cjs
git diff --check
```

The Python check parses both XML files and checks standalone inline JavaScript with `node --check`. Scripts containing Blogger tags and generated JSON-LD require testing after Blogger renders them; syntax checks do not validate those expressions.

Node regression tests cover escaping, empty states, label URLs, page boundaries, feed failures, and timestamp cursors. The browser test exercises production menu, tab, and gallery functions in an offline HTML fixture. It uses a temporary Chrome profile, blocks external page resources, and removes its temporary files afterward.

The browser test includes the theme CSS, search dialog, keyboard tabs, menu nesting, and gallery media selection. It detects common Chrome/Chromium installation paths and skips when no browser is found. Set `CHROME_BIN` for another installation:

```sh
CHROME_BIN=/path/to/chromium node --test tests/browser.test.cjs
```

A passing fixture checks browser behavior; it does not reproduce Blogger's server rendering, actual feeds, Swiper's CDN delivery, or third-party comments.

Responsive fixtures use exact-width iframe viewports at 280, 320, 375, 768, and 1024 pixels; this avoids Chrome's minimum desktop window width. They check overflow, navigation/search overlap, image/video proportions, and stacked sidebar behavior. Pager DOM tests run at phone and desktop widths.

The SEO fixture test uses Python's XML parser to check both post renderers, JSON escaping slots, canonical references, and JSON-LD branches with/without images, labels, and modification dates. It models string substitutions locally; a real Blogger upload is still required to validate Blogger's escaping and data availability.

## Implementation conventions

- Keep CSS, markup, and JavaScript in `Pixel-Blogger-Template.xml`. Reuse `pixel` helpers and vanilla JavaScript; preserve widget IDs and existing customization variables.
- Escape feed text and attributes with `pixelAttr()`. Convert feed HTML to text with `pixelText()` before escaping excerpts or comments. Encoding a URL component and escaping HTML are separate operations.
- Preserve CDATA and Blogger entity escaping. Avoid unrelated formatting changes, especially embedded font data.
- Keep libraries pinned and loaded on demand. Check embedded icon coverage before adding a glyph.
- Document behavior changes in the changelog's **Unreleased** section. Do not change release versions until preparing a release.

## Blogger release checklist

Install the XML on a test blog using the [setup guide](docs/SETUP.md), then verify:

- Homepage, a clean label URL, a label with spaces/non-ASCII characters, search results, date archives, a static page, a post, and a missing page.
- At least three pages of posts: use Next, Previous, first/last, and numbered links; check for repeated or skipped posts.
- A shortened Blogger page and posts with identical publication dates at a page boundary: native Older/Newer links must remain usable when numbered jumps are unavailable.
- Feed widgets with populated labels, empty labels, no comments, and disabled feeds. Normal post content and native navigation should remain usable if a feed request fails.
- Titles/authors containing quotes, ampersands, angle brackets, and non-ASCII text; article excerpts should remain readable text.
- Menus, tabs, search, and gallery using keyboard and touch; narrow mobile widths, browser zoom, reduced motion, and visible focus.
- Gallery transitions between photos and videos, plus multiple gallery widgets.
- Rendered JSON-LD on posts with and without labels, using titles with quotes and backslashes. Check metadata and canonical URLs in the rendered source.
- Browser console and network errors, image sizing, layout shifts, and performance with the blog's actual ads and embeds.

Tab behavior follows the [WAI-ARIA tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/). Full accessibility and performance evaluation still requires rendered pages on real devices.

PRs should state the problem, behavior change, and checks performed. Link related issues and include before/after screenshots for visual changes. Report test-blog limitations explicitly.

For release packaging, GitHub publication, and the separate Blogger demo deployment, follow [Publishing a Pixel release](docs/RELEASING.md).
