# Changelog

All notable changes to the Pixel Blogger Template are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

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
- Labeled search buttons (`aria-label`), keyboard-focusable search trigger, Escape closes the search overlay, and the search input is focused on open
- Sidebar and comment tabs expose `tablist`/`tab`/`tabpanel` roles with `aria-selected`
- Labeled mega menu arrows and mobile navigation selects

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
