# Colorlib Blogger template maintenance — November 2026

The eight sibling templates were updated to **2.3.0** on November 5, 2026. Pixel remains on its separately released **2.4.1** pagination hotfix. All nine have maintained GitHub downloads; the eight sibling demo themes were also updated in Blogger, preserving their widget settings and colors.

## Releases and demos

| Template | Versioned release | Live demo |
| --- | --- | --- |
| Pixel | [2.4.1](https://github.com/puikinsh/Pixel-Blogger-Template/releases/tag/v2.4.1) | [Demo](https://pixel-template.blogspot.com/) |
| Ember | [2.3.0](https://github.com/puikinsh/Ember-Blogger-Template/releases/tag/v2.3.0) | [Demo](https://ember-preview.blogspot.com/) |
| FutureMag | [2.3.0](https://github.com/puikinsh/FutureMag-Blogger-Template/releases/tag/v2.3.0) | [Demo](https://futuremag-demo.blogspot.com/) |
| Kaplan | [2.3.0](https://github.com/puikinsh/Kaplan-Blogger-Template/releases/tag/v2.3.0) | [Demo](https://kaplan-demo.blogspot.com/) |
| Minimal | [2.3.0](https://github.com/puikinsh/Minimal-Blogger-Template/releases/tag/v2.3.0) | [Demo](https://minimal-preview.blogspot.com/) |
| PhotoMag | [2.3.0](https://github.com/puikinsh/PhotoMag-Blogger-Template/releases/tag/v2.3.0) | [Demo](https://photomag-preview.blogspot.com/) |
| Plasma | [2.3.0](https://github.com/puikinsh/Plasma-Blogger-Template/releases/tag/v2.3.0) | [Demo](https://plasma-preview.blogspot.com/) |
| Shutter | [2.3.0](https://github.com/puikinsh/Shutter-Blogger-Template/releases/tag/v2.3.0) | [Demo](https://shutter-demo.blogspot.com/) |
| Simplify | [2.3.0](https://github.com/puikinsh/Simplify-Blogger-Template/releases/tag/v2.3.0) | [Demo](https://simplify-preview.blogspot.com/) |

PhotoMag's missing public repository was restored from its existing local Git history. Its current source, release and automated validation are available at the original repository URL again.

## What changed in the eight sibling templates

- Native Older/Newer links survive pagination failures. Optional numbers share one bar, validate publication boundaries and retain complete timestamps. Search/native cursor pages and ambiguous feeds use server navigation.
- Infinite loading checks HTTP responses, post wrappers and repeated cursors before advancing. Failures restore the last working native URL; automatic modes stop after three pages so the footer stays reachable. Simplify retains complete nested grid rows; Shutter initializes only new masonry articles.
- Article JSON-LD now reaches both desktop and legacy mobile renderers. Dynamic JSON values are escaped, optional modification dates are conditional, and duplicate Open Graph tags are removed. Image-logo home/listing pages retain a heading.
- Feed text is escaped at HTML output boundaries. Label links preserve queries, fragments and configured page sizes. FutureMag's leftover encoded jQuery initializer is removed, and Disqus embeds are guarded and loaded on demand where supported.
- Narrow post content contains wide code, tables and embeds. PhotoMag/Simplify outer gutters and PhotoMag's footer no longer widen the phone viewport. Navigation wraps, exposes focus and respects reduced-motion settings. Shutter's namespaces and sidebar snippet scope are repaired.
- Each repository includes contributor/agent guidance, upgrade and rollback notes, GPL license text, a documented audit, reproducible packaging and a GitHub Actions validation workflow.

## Completed validation

Across the eight repositories: **42 passing Node regression tests**, including Chrome fixtures at 320px and 1200px; **15 XML files**, **149 standalone JavaScript blocks** and **16 JSON-LD blocks** checked. JSON substitutions exercise quoted/Unicode text and optional fields present/absent. All eight GitHub validation runs passed.

Every complete theme saved successfully in Blogger. Live home/post and pagination checks confirmed rendered article JSON-LD, working Older/Newer or additional-post loading, and a 375px home viewport without horizontal page overflow. Shutter's load-more control was also activated by keyboard, growing seven articles to fourteen while preserving the first article. Slider assets load asynchronously; screenshots should be taken after feed/image loading completes.

The published ZIP and standalone XML downloads were downloaded again and verified against `SHA256SUMS`; release tags match the tested commits. Private theme backups are retained separately and excluded from releases. These checks cover the identified regressions; custom post HTML, ad/consent widgets and third-party comment configuration still require normal owner testing.

## Colorlib website updates still needed

The [Blogger template collection](https://colorlib.com/wp/free-blogger-templates/) was audited on November 5, 2026. Its nine download targets are still `https://downloads.colorlib.com/theme/<name>.zip`. The public ZIP contents do not match these maintained releases:

| Download name | Current Colorlib package | Recommended maintained download |
| --- | --- | --- |
| pixel | 126 files; no XML theme | [Latest Pixel ZIP](https://github.com/puikinsh/Pixel-Blogger-Template/releases/latest/download/pixel-blogger-template.zip) |
| minimal | Theme version 2.2.0 | [Latest Minimal ZIP](https://github.com/puikinsh/Minimal-Blogger-Template/releases/latest/download/minimal-blogger-template.zip) |
| kaplan | Older unversioned XML | [Latest Kaplan ZIP](https://github.com/puikinsh/Kaplan-Blogger-Template/releases/latest/download/kaplan-blogger-template.zip) |
| plasma | Theme version 2.2.0 | [Latest Plasma ZIP](https://github.com/puikinsh/Plasma-Blogger-Template/releases/latest/download/plasma-blogger-template.zip) |
| ember | Older unversioned XML and macOS metadata | [Latest Ember ZIP](https://github.com/puikinsh/Ember-Blogger-Template/releases/latest/download/ember-blogger-template.zip) |
| simplify | Theme version 2.2.0 | [Latest Simplify ZIP](https://github.com/puikinsh/Simplify-Blogger-Template/releases/latest/download/simplify-blogger-template.zip) |
| photomag | Theme version 2.2.0 | [Latest PhotoMag ZIP](https://github.com/puikinsh/PhotoMag-Blogger-Template/releases/latest/download/photomag-blogger-template.zip) |
| futuremag | Older unversioned XML and macOS metadata | [Latest FutureMag ZIP](https://github.com/puikinsh/FutureMag-Blogger-Template/releases/latest/download/futuremag-blogger-template.zip) |
| shutter | 180 files; no XML theme | [Latest Shutter ZIP](https://github.com/puikinsh/Shutter-Blogger-Template/releases/latest/download/shutter-blogger-template.zip) |

Update the collection's Download links to the maintained URLs above, or update the download service's routing to serve these Blogger archives. Pixel and Shutter need distinct Blogger download names if the short names also serve HTML products; replacing an HTML product's archive would break its own users.

The Shutter Documentation link currently points to Colorlib search; Simplify's points to the demo home. Point these to each repository's README/upgrade guide, and add FutureMag documentation alongside its Download/Preview links. The repository documentation is current; hosted legacy documentation pages have not been rewritten in this rollout. The Colorlib website and download service have been audited, not edited.
