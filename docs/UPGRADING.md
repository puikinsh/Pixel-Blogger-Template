# Upgrading to Pixel 2.4.0

Released November 5, 2026. This release updates the existing Blogger theme; it does not migrate posts or require a new blog.

## Before installation

1. Download a theme backup from **Theme → Customize dropdown → Backup**.
2. Copy your current Layout gadget settings, menu links, author details, ad code, and any custom CSS/JavaScript. Replacing the complete XML can change those settings.
3. Try the new XML on a test blog. Download the release ZIP from [GitHub Releases](https://github.com/puikinsh/Pixel-Blogger-Template/releases/latest), extract it, and use `Pixel-Blogger-Template.xml`.
4. Do not import `Pixel Demo Content.xml` into an established blog merely to upgrade the theme. That file imports separate sample content.

## Install and restore your settings

Paste the complete template into **Theme → Edit HTML**, save, and restore your saved gadget settings. In the mobile settings, select **Desktop** to serve the responsive theme. Follow [Setup and customization](SETUP.md) for exact widget snippets.

Set **Allow blog feed → Full**, leave feed redirection empty, and match **Posts Per Page** with Blogger's main-page post count. Replace demo labels with labels on your published posts.

## Behavior changes

- **Navigation:** only leading underscores create submenus. Internal underscores remain literal. Mega-menu link names must match labels; set the URL to `[Mega Menu]`.
- **Pagination:** native Older/Newer links remain present. Numbered jumps are optional and are omitted when Blogger shortens a page or the current page number is unknown. If posts share a timestamp at a page boundary, use Older/Newer rather than a numbered jump.
- **Search and tabs:** search uses a native modal dialog. Tabs and gallery selectors support keyboard input. Test any custom CSS that targets the former search link or tab structure.
- **Comments:** new installations default to native Blogger comments. Enable optional providers explicitly in Comments System and configure your own Disqus Shortname; an absent Disqus pane no longer loads its embed script.
- **Post titles and SEO:** responsive post titles are `h1` headings. Article/breadcrumb JSON-LD now appears in both post renderers, with JSON-escaped values and canonical references. Blogger supplies the Open Graph fields; custom additions should avoid duplicating them.
- **Mobile content:** wide tables and code blocks scroll inside the article. Sidebars stack without sticking; search and sidebar content remain available on very narrow screens.

## Coming from GitHub release 2.2.0

The repository contained 2.3.0 changes without a corresponding GitHub release. Version 2.4.0 also includes that work: embedded stock icons, pinned dependency updates, fetch-based pagination, locked-empty Blogger Navbar, focus styling, and reduced-motion support. See [CHANGELOG.md](../CHANGELOG.md).

## Verify or roll back

Check the homepage, label pages, search, a static page, a post, navigation, and mobile layouts. Try several pages of posts and confirm no entries are skipped. Confirm your ads and comment provider settings. For the full checklist, see [Contributing](../CONTRIBUTING.md#blogger-release-checklist).

If you need to revert, restore the theme backup and saved gadget settings. A theme change does not require deleting posts or changing their permalinks.
