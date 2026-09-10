# Changelog

All notable changes to the Pixel Blogger Template are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [2.3.0] - 2026-09-10

Dependency refresh and payload release: icons are now embedded rather than downloaded, the last blocking scripts are gone, and a keyboard trap in the navigation is fixed.

### Performance

- **Icons no longer download anything** — the Font Awesome CDN stylesheet is replaced by a 66-glyph subset of Font Awesome Free 7.3.1, embedded directly in the template as three base64 `woff2` faces. A stock install previously fetched a 20 KB stylesheet plus `fa-solid` (112 KB), `fa-brands` (107 KB) and `fa-regular` (18 KB) — roughly 260 KB — to draw a handful of icons
- The subset covers **all 50 `fa-*` classes the skin styles**, so every social brand the author-bio and social widgets colour renders with no network at all. If a post or widget references an icon outside the subset, `pixelIconFallback()` notices the unresolved glyph and loads the real Font Awesome once, so nothing a user adds silently disappears
- This trades roughly **16 KB of extra gzipped HTML per page** for **~260 KB and one third-party connection on first visit**. It is a clear win for search traffic, which is most blog traffic; the break-even is around 16 page views in a single session
- **Pagination no longer uses `document.write()`** — the pager bootstrapped itself by writing a JSONP `<script>` during parse, which blocked the HTML parser and is flagged directly by Lighthouse. It now reads the same feeds over same-origin `fetch()` with `alt=json`, matching the rest of the template. The last JSONP in the theme is gone

### SEO

- **`BreadcrumbList` structured data** on post and static pages. Posts emit Home > first label > post title, falling back to Home > post title when a post carries no labels; static pages emit Home > page name. This is the markup Google uses to replace the raw URL in a search result with a breadcrumb trail

### Fixed

- **Post titles containing a double quote** no longer break the lead post's `<img>` in the homepage list widget — the `alt` attribute is escaped through `pixelAttr()`, as its sibling attributes already were
- **The RSS and Bloglovin icons in the social widget rendered as empty boxes** — `.pixel-social #social a:before` outranked the two per-icon rules on specificity, so their `font-family` and weight never applied and both glyphs were looked up in the wrong family. Longstanding; visible with the CDN stylesheet too
- **Dropdown and mega menus are reachable by keyboard** — they opened on `:hover` only, so keyboard users could not open a submenu at all (WCAG 2.1.1 Keyboard). They now also open on `:focus-within`

### Changed

- **Swiper 11.1.14 → 11.2.10.** Staying on v11 is deliberate. Swiper 14 ships a slightly *larger* JS bundle, deletes the `swiper-icons` font that the template's `.swiper-button-*:after` sizing override depends on, and uses native CSS nesting that silently drops whole rule blocks below Chrome 112 / Safari 16.4 / Firefox 117. There is no payload win to justify that, so v14 is deferred
- **Facebook SDK v21.0 → v26.0.** Graph API v21.0 reaches end of life on **2027-01-21**, which would have broken Facebook comments for every blog using the theme
- Font Awesome reference pinned to 7.3.1 (from 7.2.0) for the on-demand fallback path

### Accessibility

- Submenu parents carry `aria-haspopup`
- Visible `:focus-visible` rings for keyboard users, with a light-on-dark variant for the menu bar and image tiles, leaving pointer interaction unchanged
- A `prefers-reduced-motion: reduce` block that neutralises animations and transitions

## [2.2.0] - 2026-06-12

Stability and polish release: layout regressions fixed, menus made instant and reliable, typography refined, and accessibility tightened.

- **Instant mega menu paging** — pages are cached and the next page (feed and images) prefetches in the background, so the pager arrows flip with zero waiting; the heavy solid-color loading overlay is replaced by a subtle dim with an accent spinner
- **Post content typography overhaul** — a real heading scale with vertical rhythm, properly indented lists with accent-colored markers, underlined accent links, and refined blockquote styling inside post bodies
- **Dropdown hover fix** — hidden dropdown and mega menus are now pointer-inert, eliminating a loop where the closing mega menu kept re-opening while using the regular dropdowns
- **Accessibility/SEO** — every image, server-rendered or JavaScript-generated, now carries an alt attribute (post covers use the post title, ads and avatars are labeled appropriately)
- **Mixed content eliminated** — remaining http:// logos, background images, share endpoints, and social links upgraded to https
- **Self-updating footer copyright year** (with 2026 fallback) and removal of leftover Owl Carousel license comments
- **Documentation** — README rebuilt with a live preview screenshot and a cross-linked gallery of all nine Colorlib Blogger templates

## [2.0.0] - 2026-06-11

Major modernization release: zero frameworks, zero render-blocking external assets, structured data, and a full accessibility pass.

### Upgrade notes

- When saving the theme, Blogger may warn that the **FollowByEmail (Newsletter) widget will be deleted** — confirm the deletion; the widget posted to FeedBurner email subscriptions, which Google shut down in 2021
- In **Theme → mobile settings (gear icon)**, choose **"Desktop"** — the template is fully responsive, and serving it directly removes Blogger's legacy mobile wrapper and its `?m=1` redirect (~500 ms per mobile visit)

### Performance

- **Bootstrap removed entirely** — the template used only a handful of Bootstrap classes (`row`, `col-sm-3`, `input-group`, `btn`, a few utilities), which are now ~16 lines of custom CSS; this removes ~31 KB of gzipped render-blocking CSS
- **jQuery removed entirely** — every script (menu builder, mega menu, featured grid, sidebar feed widgets, custom widgets, tabs, search overlay) rewritten in modular vanilla JavaScript; the head now loads zero external render-blocking assets
- **Right-sized images** — feed-driven widgets no longer rewrite Blogger's 72px thumbnails to full-size `s1600` originals; they request context-appropriate sizes (`s400`–`s1200`), the largest bandwidth saving in the template
- **Featured grid LCP/CLS fixes** — the grid reserves its height while loading (no layout shift), the hero image preloads with `fetchPriority=high`, and the feed request is skipped entirely on non-homepage views where the grid is hidden
- **Same-origin `fetch()` with `alt=json`** replaces all JSONP feed loading; post images are scanned with an inert `DOMParser` so feed processing no longer downloads every image in each post
- **Swiper loads on demand** — only when a gallery custom widget actually exists on the homepage, instead of render-blocking in the head on every page
- **Facebook SDK lazy-loads** — fetched once (was loaded twice), only when facebook comments are configured, and only when the comment area scrolls near the viewport; upgraded v2.0 → v21.0
- **Preconnect hints** for cdn.jsdelivr.net, fonts.googleapis.com, and fonts.gstatic.com
- **Native lazy loading** (`loading="lazy"`, `decoding="async"`) on below-the-fold template images
- **Server-side image resizing** — post cards use Blogger's `resizeImage()` expression (800px) so full-size originals never reach the browser; the sidebar Featured Post background is resized the same way
- **Blogger's render-blocking widget CSS bundle suppressed** via `b:css='false'` (~750 ms off the critical path); the template ships its own styles for all widgets
- **Swiper pinned to an exact version** (11.1.14) for 1-year immutable CDN caching instead of jsDelivr's 7-day range cache, and its on-demand CSS loads outside the critical request chain
- Removed the dead Google+ follow button from the Profile widget, which pulled in `apis.google.com/js/platform.js` (~58 KiB) on every page
- Removed duplicated scripts that ran multiple times per page (`.format-date` ×4, author/ad injection ×2), the hidden Navbar widget's dead Google+ scripts, and the eager hidden YouTube iframe in gallery widgets

### SEO

- **Removed site-wide `index,nofollow` robots meta** that made every link on every page nofollow
- JSON-LD structured data: `WebSite` + `SearchAction` sitewide, `BlogPosting` (headline, image, dates, author, publisher) on post pages
- Open Graph and Twitter `summary_large_image` card meta tags
- Post pages now have exactly one `h1` (the post title); the blog header title is an `h1` only on the homepage
- Image `alt` attributes are no longer overwritten with filenames; alt text is only filled in when missing
- Removed obsolete meta tags (`MobileOptimized`, `HandheldFriendly`, `apple-mobile-web-app-capable`)

### Accessibility

- Skip-to-content link, visually hidden until focused
- `lang` attribute from the blog's locale on the `html` element and a `main` landmark on the content wrapper
- Labeled search buttons (`aria-label`), keyboard-focusable search trigger, Escape closes the search overlay, and the search input is focused on open
- Sidebar and comment tabs expose valid `tablist`/`tab`/`tabpanel` roles (`role='presentation'` list items) with `aria-selected` kept in sync
- `aria-label` with the post title on every background-image post link (featured hero and secondary cards, recent-post thumbnails, list-widget thumbnails, mega menu covers, grid cards)
- Contact form fields and the archive dropdown are labeled with Blogger's own localized strings
- Icon-only pager arrows carry screen-reader-only text; labeled mega menu arrows and mobile navigation selects
- Profile widget uses valid markup instead of a definition list whose `dt` could appear without a `dd`

### Fixed

- Broken `notfound.pngg` fallback image URL in the PopularPosts script
- Mega menu labels linked to the original author's demo blog (`pixel-blossom.blogspot.com`) instead of the user's own blog
- Default ad placeholders linked to the defunct `blossomtheme.com` domain over http
- Mixed-content http:// image URLs (fallback images, comment avatars, background pattern)
- `maxwidget` → `maxwidgets` typo on the featured grid section
- Author bio link title was hardcoded to "Posts by Diago"
- `eval()` calls in the tab plugin (blocked strict Content Security Policies)

### Removed

- Bootstrap 5.3.8 CDN stylesheet (replaced by ~16 lines of custom CSS)
- jQuery 3.7.1 and the tabslet, simplyTab, and replacetext jQuery plugins (replacetext was never called)
- FollowByEmail "Newsletter" widget and its CSS — it posted to FeedBurner email subscriptions, which Google shut down in 2021
- Hidden Navbar widget markup (discontinued Google+ `plusone.js`, demo-blog iframe)
- Dead WooCommerce CSS selectors and obsolete `-o-`/`-moz-`/`-webkit-` transition prefixes

### Upgraded

- **Bootstrap 4.6.0 to 5.3.8** — updated CDN link and migrated all Bootstrap 4 classes to v5 equivalents (`pull-right` to `float-end`, `data-toggle` to `data-bs-toggle`, `data-target` to `data-bs-target`, etc.)
- **Owl Carousel to Swiper 11** — replaced Owl Carousel slider with Swiper, including new `.swiper-wrapper` structure and navigation buttons
- **Font Awesome 4.7.0 + Ionicons to Font Awesome 7** — consolidated two icon libraries into one; migrated all icon unicode values and font-family declarations
- **jQuery 1.11.0 removed** — replaced with vanilla JavaScript for all template functionality (search toggle, mobile menu, tabs, featured post carousel)

### Added

- Sticky sidebar with `position: sticky` for better content navigation
- CSS Grid layout for the featured posts section (replaces float-based layout)
- Modern social media icons: X (Twitter), TikTok, Threads, Telegram, WhatsApp
- Swiper CSS loaded via CDN for slider functionality
- Proper `type="submit"` attribute on search button

### Removed

- jQuery dependency (was v1.11.0 from Google APIs CDN)
- Owl Carousel library (replaced by Swiper 11)
- Ionicons library (consolidated into Font Awesome 7)
- Obsolete social icons: Google Plus, StumbleUpon, Digg, Delicious, SlideShare, Yahoo
- `maximum-scale=1` from viewport meta (improves accessibility — allows user zoom)
- Obsolete vendor-prefixed transition declarations in social icon styles

### Fixed

- Search form close button uses proper Font Awesome icon instead of Ionicons
- Pagination arrows use Font Awesome icons consistently
- Comment timestamps use correct font-family declaration
- Featured post secondary items no longer use `display: block` (fixes layout)
- Featured grid secondary items: text overlay (label, title, author, date) now stays anchored to its respective image instead of being displaced to only one image — moved `.pixel-content` inside `.pixelfeatured-thumb` and added `position: relative; overflow: hidden` to the thumb container
- Author description updated from "Blossom Themes" to "Colorlib"
- Demo content XML cleaned up and modernized
- Demo content no longer embeds an obsolete copy of the template — the original blog export carried the full jQuery-era theme as a kind#template entry (51% of the file); only posts, pages, comments, and settings remain

## [1.1.0] - 2023-01-25

### Changed

- Template file updated for 2023 compatibility (community contribution by @anandmt)

## [1.0.2] - 2021-06-30

### Fixed

- Two rounds of template XML fixes and improvements

## [1.0.1] - 2020-10-01

### Changed

- README improvements (community contributions by @harsh3029 and @trojan-ali)

## [1.0.0] - 2017-11-15

### Added

- Initial release of Pixel Blogger Template
- Bootstrap 4.6.0 CSS framework
- jQuery 1.11.0
- Owl Carousel for featured post slider
- Font Awesome 4.7.0 + Ionicons for icons
- Responsive design with 7 breakpoints (1200px down to 300px)
- Featured posts carousel with hero + secondary layout
- Tabbed sidebar (recent, popular, random posts)
- Built-in AdSense advertisement slots
- Social media icon bar with 20+ platform support
- Mega menu with multi-level dropdown navigation
- Related posts widget
- Custom search overlay
- Post author bio section
- Responsive mobile navigation
- `loadCSS()` for non-blocking font loading
- Blogger variable system for easy color customization
