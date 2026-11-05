# Pixel — Free News & Magazine Blogger Template

[![Version](https://img.shields.io/badge/Version-2.4.1-2942ee.svg)](CHANGELOG.md)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-zero_frameworks-F7DF1E?logo=javascript&logoColor=black)](http://vanilla-js.com/)
[![Font Awesome](https://img.shields.io/badge/Font%20Awesome-7-528DD7?logo=fontawesome&logoColor=white)](https://fontawesome.com/)

Pixel is a free news and magazine Blogger template (Blogspot theme) designed for online newspapers, content-rich magazine sites, and multi-author blogs. It ships with a drag-and-drop featured post grid, multi-level dropdown and mega menu navigation, three built-in AdSense ad slots, and a tabbed sidebar - all running on 100% vanilla JavaScript with zero render-blocking assets.

Created and maintained by [Colorlib](https://colorlib.com), Pixel is a fast, AdSense-ready news and magazine theme with a mega menu, featured post grid, and tabbed sidebar — free for personal and commercial use.

[![Pixel — free news & magazine Blogger template (Blogspot theme) by Colorlib](https://colorlib.com/wp/wp-content/uploads/sites/2/pixel-free-news-adsense-blogger-template.jpg)](https://pixel-template.blogspot.com)

**[Live Demo](https://pixel-template.blogspot.com)** | **[Download ZIP](https://github.com/puikinsh/Pixel-Blogger-Template/releases/latest/download/pixel-blogger-template.zip)** | **[Setup & Troubleshooting](docs/SETUP.md)** | **[Changelog](CHANGELOG.md)**

## Features

- **Featured post grid** - an eye-catching homepage hero with secondary story tiles, loaded from any post label you choose and optimized for Largest Contentful Paint
- **Mega menu navigation** - turn any menu item into a paged, image-rich mega menu by pointing it at a post label; pages are prefetched so the arrows flip instantly
- **AdSense-ready** - three built-in advertisement slots (full-width home banner, post top, post bottom) plus a sidebar ad widget
- **Tabbed sidebar** - Recent, Popular, and Comments tabs with accessible keyboard-friendly switching
- **Custom list and gallery widgets** - magazine-style homepage sections fed by post labels, including a touch-friendly Swiper gallery with YouTube video support
- **Mobile-first responsive design** - 7 CSS breakpoints from 1200px down to 300px
- **SEO-optimized markup** — primary `h1` post titles, JSON-LD structured data (`WebSite`, `SearchAction`, `BlogPosting`, `BreadcrumbList`), Open Graph and Twitter card meta tags, semantic landmarks
- **Fast page load** — zero jQuery, zero CSS frameworks, no render-blocking external assets, no `document.write()`, preconnect hints, native lazy loading, and right-sized images served by Blogger's CDN
- **Accessible** — skip-to-content link, labeled controls, ARIA tab roles, keyboard-operable dropdown and mega menus, visible focus rings, `prefers-reduced-motion` support, and no user-zoom blocking
- **Easy color customization** — change the color scheme from Blogger's theme editor, no code required
- **Font Awesome 7 icons, embedded** — the icons the theme uses ship inside the template as a subsetted font, so a stock install downloads no icon files at all; Google Fonts still load without blocking the first paint
- **Self-updating copyright year** in the footer

## What’s new in 2.4.1

One pagination bar replaces the duplicated controls from 2.4.0. Blogs with tied publication dates use native Older/Newer links immediately; unsafe numbered controls are not offered. Includes the responsive SEO, mobile, and keyboard improvements from 2.4.0. See the [release notes](docs/releases/2.4.1.md) and [upgrade guide](docs/UPGRADING.md). The live demo is deployed separately; deployment status is recorded in the release notes.

## How to Install a Blogger Template

Before upgrading, download a backup of your current theme from **Theme → Customize dropdown → Backup** and save your widget settings. Try changes on a test blog first; see the [setup guide](docs/SETUP.md) for exact menu and widget examples.

1. **Download** the [ZIP](https://github.com/puikinsh/Pixel-Blogger-Template/releases/latest/download/pixel-blogger-template.zip) or clone this repository
2. **Sign in to Blogger** at [blogger.com](https://www.blogger.com) and pick your blog
3. **Open the theme editor** — *Theme* → *Customize* dropdown → **Edit HTML**
4. **Replace the code** — select everything, delete it, and paste the full contents of `Pixel-Blogger-Template.xml`
5. **Save** - if Blogger warns that the FollowByEmail (Newsletter) widget will be deleted, confirm it; that widget posted to FeedBurner email subscriptions, which Google shut down in 2021
6. **Set mobile to Desktop** — in *Theme*, click the gear icon under the Mobile preview and choose **Desktop**; the template is fully responsive and this removes Blogger's legacy `?m=1` mobile wrapper (and its extra redirect) for mobile visitors

### Import Demo Content (Optional)

To preview the template with sample posts before publishing your own:

1. Go to **Settings** > **Manage blog** > **Import content**
2. Upload `Pixel Demo Content.xml` from this repository

## Customization

- **Colors** — *Theme* → *Customize* → *Advanced* exposes the template's color variables (accent color, backgrounds, text) with live preview
- **Menus** — edit *Layout → Main Navigation Menu*; prefix link names with `_` or `__` for nested dropdowns. For a mega menu, use the exact post label as the link name and `[Mega Menu]` as its URL
- **Homepage sections** — the label-driven widgets are configured from *Layout* by editing each widget's content (the label name and post count)
- **Ads** — paste your AdSense (or any) ad code into the advertisement widgets in *Layout*

Feed widgets work best with **Settings → Site feed → Allow blog feed → Full**. Match **Layout → Posts Per Page** to Blogger's main-page post count. The [setup guide](docs/SETUP.md) covers feed settings, sidebar snippets, page-size configuration, and common problems.

## Tech Stack

| Library | Version | Loading |
| ------- | ------- | ------- |
| [Swiper](https://swiperjs.com/) | 11.2.10 (pinned) | On demand, only when a slider/carousel exists on the page |
| [Font Awesome](https://fontawesome.com/) | 7.3.1 (66-glyph subset) | Embedded in the template — no request. Full stylesheet fetched only if a page uses an icon outside the subset |
| [Google Fonts](https://fonts.google.com/) | — | `display=swap`, non-blocking |

Everything else is hand-written CSS and vanilla JavaScript inside the single template file — no jQuery, no Bootstrap, no build step. Feeds load over same-origin `fetch()` with `alt=json`.

## Contributing

Run `python3 scripts/check_template.py` and `node --test tests/*.test.cjs` to check XML, JavaScript syntax, and behavior. The browser regression test uses Chrome/Chromium when installed. See [CONTRIBUTING.md](CONTRIBUTING.md) for prerequisites, limitations, and the Blogger release checklist.

## FAQ

**Is Pixel really free?** Yes — free for personal and commercial use under GPL v3. Attribution to [Colorlib](https://colorlib.com) is appreciated but not required.

**Does it work with AdSense?** Yes. The layout includes dedicated ad widgets, and you can add more ad units through Blogger's Layout editor.

**How fast is it?** The template avoids render-blocking external assets and legacy frameworks, embeds its stock icons, and loads the gallery library on demand. Actual performance depends on your images, ads, tracking, embeds, and added gadgets. See the [changelog](CHANGELOG.md) for the performance work.

**Can I use it on multiple blogs?** Yes, on as many blogs as you like.

## More Free Blogger Templates by Colorlib

Pixel is one of nine free, open-source Blogger templates we maintain on GitHub - every one modernized with vanilla JavaScript, structured data, and an accessibility pass. Pick the design that fits your blog:

<table><tr><td align="center" width="33%"><a href="https://github.com/puikinsh/Minimal-Blogger-Template"><img src="https://colorlib.com/wp/wp-content/uploads/sites/2/minimal-blogger-lifestyle-blog-theme.jpg" alt="Minimal - free clean & minimal blog Blogger template" width="260"/><br/><b>Minimal</b></a><br/>Clean & Minimal Blog Blogger template</td><td align="center" width="33%"><a href="https://github.com/puikinsh/Simplify-Blogger-Template"><img src="https://colorlib.com/wp/wp-content/uploads/sites/2/simplify-free-fullscreen-blogger-template.jpg" alt="Simplify - free minimal personal blog Blogger template" width="260"/><br/><b>Simplify</b></a><br/>Minimal Personal Blog Blogger template</td><td align="center" width="33%"><a href="https://github.com/puikinsh/Ember-Blogger-Template"><img src="https://colorlib.com/wp/wp-content/uploads/sites/2/ember-simple-blogger-blog-theme.jpg" alt="Ember - free magazine Blogger template" width="260"/><br/><b>Ember</b></a><br/>Magazine Blogger template</td></tr><tr><td align="center" width="33%"><a href="https://github.com/puikinsh/Kaplan-Blogger-Template"><img src="https://colorlib.com/wp/wp-content/uploads/sites/2/kaplan-minimal-blogger-website-template.jpg" alt="Kaplan - free magazine Blogger template" width="260"/><br/><b>Kaplan</b></a><br/>Magazine Blogger template</td><td align="center" width="33%"><a href="https://github.com/puikinsh/Plasma-Blogger-Template"><img src="https://colorlib.com/wp/wp-content/uploads/sites/2/plasma-simple-trave-blogger-news-template.jpg" alt="Plasma - free travel & news magazine Blogger template" width="260"/><br/><b>Plasma</b></a><br/>Travel & News Magazine Blogger template</td><td align="center" width="33%"><a href="https://github.com/puikinsh/PhotoMag-Blogger-Template"><img src="https://colorlib.com/wp/wp-content/uploads/sites/2/photomag-fullscreen-website-template.jpg" alt="PhotoMag - free photography Blogger template" width="260"/><br/><b>PhotoMag</b></a><br/>Photography Blogger template</td></tr><tr><td align="center" width="33%"><a href="https://github.com/puikinsh/FutureMag-Blogger-Template"><img src="https://colorlib.com/wp/wp-content/uploads/sites/2/futuremag.jpg" alt="FutureMag - free news & magazine Blogger template" width="260"/><br/><b>FutureMag</b></a><br/>News & Magazine Blogger template</td><td align="center" width="33%"><a href="https://github.com/puikinsh/Shutter-Blogger-Template"><img src="https://colorlib.com/wp/wp-content/uploads/sites/2/shutter-creative-portfolio-blogger-template.jpg" alt="Shutter - free photography portfolio Blogger template" width="260"/><br/><b>Shutter</b></a><br/>Photography Portfolio Blogger template</td><td width="33%"></td></tr></table>

Looking for even more? Browse the full collection of [free Blogger templates](https://colorlib.com/wp/free-blogger-templates/) on Colorlib, or explore our [free WordPress themes](https://colorlib.com/wp/free-wordpress-themes/) and [free HTML website templates](https://colorlib.com/wp/templates/).

## License

Pixel is released under the [GPL v3 license](https://www.gnu.org/licenses/gpl-3.0). You are free to use, modify, and redistribute it for personal and commercial projects.

---

Made with care by [Colorlib](https://colorlib.com) — free website templates and WordPress themes since 2013.
