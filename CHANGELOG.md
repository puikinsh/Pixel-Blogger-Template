# Changelog

All notable changes to the Pixel Blogger Template are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

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
