# Legacy issue review — November 10, 2026

Reviewed all four open issues against released **Pixel 2.4.1**, its unchanged XML, the live [Pixel demo](https://pixel-template.blogspot.com/), and the regression suite. No production theme change or new release was needed.

| Issue | Current finding | Disposition |
| --- | --- | --- |
| [#1: theme upload / slider variable](https://github.com/puikinsh/Pixel-Blogger-Template/issues/1) | The released skin declares `slider`; XML/JavaScript checks pass, and the live demo identifies itself as 2.4.1. The thread also contains a confirmed resolution. Its later `data-pjax-transient` error concerns GitHub webpage HTML, which is absent from the theme XML. | Close the historical report as completed. |
| [#2: API and unlabeled Recent posts](https://github.com/puikinsh/Pixel-Blogger-Template/issues/2) | Recent uses the unfiltered posts feed and does not require `category`. Label feeds retain Blogger's `/-/` route and encode the full label. Current public recent/travel/mountain requests return HTTP 200. | Close as resolved by the existing feed implementation. |
| [#4: custom widgets](https://github.com/puikinsh/Pixel-Blogger-Template/issues/4) | The demo renders the featured grid, custom list and gallery. Selecting a gallery post updates its featured title. Current regression checks also exercise the documented widget snippets. | Close the old non-working-widget report as completed. |
| [#9: desktop speed](https://github.com/puikinsh/Pixel-Blogger-Template/issues/9) | The old report has no retained metric values or trace. Later versions removed jQuery/framework dependencies and changed script, font and image loading, but that does not establish current desktop performance. Google platform scripts are still observed in the served demo. | Keep open for a fresh measured desktop audit. |

## Observed widget and feed results

The live homepage's version comment reports **2.4.1**. It rendered one featured hero, two featured secondary posts, one custom list, one custom gallery with five choices, and five Recent sidebar entries. No empty widget panel or featured-feed error was present. Selecting **Modelling is the new way** changed the gallery's featured title accordingly.

These public requests succeeded:

| Feed path | HTTP status | Returned entries |
| --- | --- | ---: |
| `/feeds/posts/default?alt=json&max-results=3` | 200 | 3 |
| `/feeds/posts/default/-/travel?alt=json&max-results=3` | 200 | 3 |
| `/feeds/posts/default/-/mountain?alt=json&max-results=5` | 200 | 5 |

The `/-/` segment selects a label; removing it is not the current fix. Recent posts should include unlabeled entries, while label-filtered widgets need matching published labels. The [setup guide](SETUP.md) now explains both routes and how to avoid uploading a saved GitHub webpage as XML.

## Regression coverage

- Added a skin-variable check covering the legacy `slider` declaration and all variable references used by the CSS.
- Expanded the real Chrome fixture with feed entries that omit `category`; Recent retains every entry.
- Exercised the featured grid and both custom widget types with encoded spaces, ampersands, slashes and non-ASCII labels.
- Existing gallery selection, keyboard, mobile, pagination and SEO checks remain in the suite.

Validation: both XML files parsed, 23 standalone JavaScript blocks passed syntax checks, and **43 tests passed with zero failures or skips**. Chrome initially could not launch inside the filesystem sandbox; the normal-permission run completed. An initially missing date-format fixture dependency was corrected before accepting the results. These were test-environment/fixture problems, not theme regressions.

## Remaining desktop performance work

No current Lighthouse score, Core Web Vitals result or desktop trace was obtained: instrumented Chrome DevTools tools were unavailable. Keep #9 open until a current desktop report records its URL, device/network profile, metric values and attributable causes. Do not remove observed Google scripts without establishing their purpose and cost. Ads, widgets and provider configuration can change the result.

The checks here do not revalidate arbitrary owner customizations or establish that every future Blogger/API response is compatible. A new reproducible failure should include the installed version, affected URL, gadget snippet and exact error.
