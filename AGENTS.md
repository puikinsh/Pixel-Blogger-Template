# Repository Guidelines

## Project Structure & Module Organization

- `Pixel-Blogger-Template.xml` is the complete theme: head metadata, CSS inside `<b:skin>`, Blogger layout/widgets, and inline JavaScript near the bottom. Embedded icon fonts also live here; there is no separate asset directory.
- `Pixel Demo Content.xml` contains sample content for Blogger import, not theme source.
- `README.md` documents installation and customization; `CHANGELOG.md` records releases using Keep a Changelog; `LICENSE` contains GPL v3 terms.
- `docs/SETUP.md` covers widgets and troubleshooting; `CONTRIBUTING.md` describes validation. Checks live in `scripts/` and `tests/`.

## Build, Test, and Development Commands

There is no package manager, build step, or local development server. Checks use Python 3 and Node.js 18+ without npm dependencies.

- `xmllint --noout Pixel-Blogger-Template.xml` checks XML well-formedness.
- `python3 scripts/check_template.py` validates both XML files and standalone inline JavaScript.
- `node --test tests/*.test.cjs` runs regressions; browser tests use Chrome/Chromium when available (`CHROME_BIN` overrides detection).
- `git diff --check` catches whitespace errors before submission.

For functional testing, paste the complete template into a test blog through **Theme → Edit HTML**. Blogger renders its own tags and expressions; opening the XML locally cannot reproduce that behavior.

## Coding Style & Naming Conventions

Match surrounding formatting: XML uses spaces with some legacy tabs, CSS is mostly compact, and JavaScript uses descriptive `pixel`-prefixed helpers such as `pixelFetchFeed()`. Use two-space indentation for new expanded blocks; avoid reformatting unrelated code. No formatter or linter is configured.

Keep JavaScript vanilla and reuse existing helpers. Preserve widget IDs, Blogger namespaces, theme variables, and CDATA boundaries. Match surrounding XML/entity escaping; use `pixelAttr()` for feed values interpolated into HTML attributes. Keep dependencies pinned and loaded on demand; check embedded glyph coverage before adding icons.

## Testing Guidelines

No coverage threshold is configured. Name tests `tests/*.test.cjs` and cover observable regressions. Run checks, then verify homepage, post, static, label/search, and pagination views in Blogger. For UI changes, check mobile layouts, keyboard navigation, widgets, and console errors. Check structured data with posts both with and without labels when editing JSON-LD.

## Commit & Pull Request Guidelines

Follow history's short, imperative commit subjects, such as `Add BreadcrumbList structured data` or `Fix the RSS and Bloglovin social icons rendering as empty boxes`.

PRs should explain the problem, resulting behavior, and validation performed; link relevant issues and include screenshots for visual changes. Update documentation and the changelog when behavior or release details change.
