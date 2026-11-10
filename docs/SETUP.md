# Setup and customization

## Install or upgrade

1. Save your existing theme using **Theme → Customize dropdown → Backup → Download**. Back up content separately before importing demo posts. See [Blogger's backup instructions](https://support.google.com/blogger/answer/41387?hl=en).
2. Try the theme on a separate test blog first. Paste all of `Pixel-Blogger-Template.xml` into **Theme → Edit HTML**, then save. A theme upgrade can replace widget settings; keep copies of your menus, ad snippets, and custom widget content.
3. In the theme's mobile settings, select **Desktop** so the responsive template handles mobile visitors.
4. Replace sample links, author information, ads, and label names through **Layout**. Use **Theme → Customize → Advanced** for colors.

`Pixel Demo Content.xml` is optional sample content. Import it through **Settings → Manage blog → Import content** on your test blog. It does not install the theme. Turn off automatic publishing during import if you want to review posts first. [Blogger supports legacy XML imports](https://support.google.com/blogger/answer/41387?hl=en).

Download the named package from [GitHub Releases](https://github.com/puikinsh/Pixel-Blogger-Template/releases/latest), extract it, and open `Pixel-Blogger-Template.xml`. If using GitHub's file view, choose **Raw** before copying the XML; saving the GitHub webpage downloads HTML, not the theme. A parser error mentioning `data-pjax-transient`, GitHub page metadata, or an HTML `meta` tag is a sign to check the downloaded file. The XML theme declares the `slider` skin setting; do not replace its variable-definition block with a partial CSS excerpt.

## Configure feeds and page size

Under **Settings → Site feed**, use **Allow blog feed → Full** for the richest widget images and excerpts. Disabled feeds prevent feed-driven widgets from loading; shortened feeds may omit post images or text. Leave **Post feed redirect URL** empty when using the theme's JSON feeds. Blogger documents these options in its [settings reference](https://support.google.com/blogger/answer/9691230?hl=en).

Recent posts use `/feeds/posts/default?alt=json` and include posts without labels. Label widgets use `/feeds/posts/default/-/<encoded-label>?alt=json`; the `/-/` segment selects a label and must stay in the URL. Use an exact published label, including case, rather than changing the feed route. The theme encodes spaces, slashes and non-ASCII characters itself.

Set **Layout → Posts Per Page** to a positive whole number, such as `6`. Match it to **Settings → Posts → Max posts shown on main page**. Numbered pagination assumes a consistent page size. Search results and date archives use Blogger's native Older/Newer navigation.

There is one pagination bar. Older/Newer links remain available, with optional page numbers inside that same bar. Blogger can automatically serve fewer posts than requested; on those pages, the template omits page numbers to avoid skipping posts. If the initial feed contains tied or invalid publication dates, only native links are shown. If a later numbered jump fails or has an ambiguous date boundary, the optional numbers are removed and native navigation remains. This follows [Blogger's automatic pagination behavior](https://blogger.googleblog.com/2010/02/auto-pagination-on-blogger.html).

## Navigation

Edit **Layout → Main Navigation Menu**, keep sorting disabled, and arrange links in their intended order. The theme supplies a Home link automatically.

| Link name | Link URL | Result |
| --- | --- | --- |
| `Destinations` | `/search/label/travel` | Top-level link |
| `_Europe` | `/search/label/Europe` | Child of Destinations |
| `__Italy` | `/search/label/Italy` | Child of Europe |
| `_Asia` | `/search/label/Asia` | Another child of Destinations |
| `travel` | `[Mega Menu]` | Paged preview of posts labeled `travel` |

Only leading underscores mark nesting. For mega menus, the link name must match the post label, including case. Avoid skipping nesting levels. Mobile visitors use the generated navigation select.

## Logo, social links, and author details

Edit the Header gadget in **Layout** to upload your logo or change the displayed title. Keep a readable blog title in Blogger's settings even when you use a logo image.

In **Top Social Widget**, use supported names such as `instagram`, `pinterest`, `youtube`, `tiktok`, `x-twitter`, `facebook`, `threads`, `telegram`, `whatsapp`, `linkedin`, or `rss`, and set each URL to your own profile. Delete unused placeholder links. Older documentation lists discontinued services that are no longer appropriate defaults.

Edit **Author Description** and **Author Social Links** to replace Colorlib's sample information. In **Boxed Layout**, use `true` for a constrained desktop wrapper or `false` for the normal layout.

## Homepage widgets

Edit the HTML/JavaScript gadgets in **Layout** using their HTML content editor. Replace `travel` or `mountain` with a label used by published posts. Encode an ampersand inside an HTML attribute as `&amp;`.

**Featured Grid Widget** displays up to three posts:

```html
<span data-type="pixelfeatured" data-label="travel"></span>
```

In **Customized Widgets**, use either a five-post list or gallery:

```html
<object class="pixel-widget" data-label="travel" data-type="list"></object>
<object class="pixel-widget" data-label="mountain" data-type="gallery"></object>
```

Add each example as a separate gadget. These sections render on the homepage. Gallery video playback uses YouTube thumbnails supplied by Blogger's feed; other posts display images.

## Sidebar widgets

Place an HTML/JavaScript gadget in a sidebar or one of **Tab [1]**, **Tab [2]**, and **Tab [3]**. Its title becomes the tab label. Empty tab sections are omitted.

```html
<!-- Recent posts -->
<span class="pixel-recent" data-no="5"></span>
<!-- Recent comments -->
<span class="pixel-cmnt" data-no="5"></span>
<!-- Posts matching a label -->
<span class="pixel-tagswid" data-label="travel" data-no="5"></span>
```

Tabs support Left/Right arrows, Home/End, Enter, and Space. Use Tab to move into the selected panel.

## Ads and comments

Paste your own ad code into **Home Advertisement [Full Width]**, **Post Page Advertisement [Top]**, and **Post Page Advertisement [Bottom]**. Remove sample image links from unused slots. Ads added to the sidebar are separate gadgets. Ad slots do not guarantee approval from an ad network.

Set **Comments System** to `[blogger]` for native comments. Supported combinations include `[blogger][disqus]` and `[blogger][disqus][facebook]`, with the order determining the tabs. Use the exact bracket tokens without spaces. If you enable Disqus, replace the sample **Disqus Shortname** with your site's shortname. Optional providers require their own working service configuration; native Blogger comments are the simplest starting point.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Empty featured grid or mega menu | Publish posts with the exact configured label; check feed settings and `/feeds/posts/default?alt=json&max-results=1` on your blog. |
| Missing sidebar comments | Confirm the gadget uses `pixel-cmnt` and that the comment feed is enabled and contains comments. |
| Incorrect page counts or repeated posts | Match both page-size settings. Test an unfiltered homepage and a label page with more than one page of posts. |
| Theme refuses to save | Paste the complete XML; escape raw `&` outside CDATA. Keep Blogger widget IDs and namespaces intact. |
| Demo differs from your installation | The hosted demo is updated manually. Compare its source's `Version:` header with your downloaded template. |
| Slow pages after customization | Test added ads, embeds, tracking, and gadgets individually; they can add blocking resources and layout shifts. |

Before replacing a live theme, follow the [release checklist](../CONTRIBUTING.md#blogger-release-checklist).

The [legacy issue review](ISSUE-REVIEW-2026.md) records the current upload/feed/widget checks and the outstanding measured desktop performance audit.
