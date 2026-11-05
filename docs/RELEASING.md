# Publishing a Pixel release

## Prepare

1. Start from the latest remote default branch and review the exact files to publish. Exclude credentials, backups, scratch fixtures, and ignored local instructions.
2. Choose the next semantic version. Update `Version:` in the template, the README badge, and a dated changelog entry. Keep an empty **Unreleased** section for future work.
3. Add `docs/releases/VERSION.md` with the final behavior, upgrade notes, downloads, validation, and an accurate hosted-demo status. Update setup and upgrade guides as needed.
4. Run:

```sh
python3 scripts/check_template.py
node --test tests/*.test.cjs
git diff --check
python3 scripts/package_release.py --output /tmp/pixel-release
```

Chrome/Chromium is needed to run browser fixtures rather than skip them. Inspect the ZIP contents and verify its checksums. The package uses an explicit public-file list and the changelog date, so repeated builds of the same files are reproducible.

## Publish

Commit the reviewed files, push without force, and verify the remote commit SHA. Use a new immutable `vVERSION` tag; do not move an existing release tag. Publish the release with `docs/releases/VERSION.md` as its body, targeting that verified commit.

Attach these generated files:

- `pixel-blogger-template.zip`: complete public distribution, including the theme, optional demo content, documentation, and development checks.
- `Pixel-Blogger-Template.xml`: the installable theme by itself.
- `SHA256SUMS`: SHA-256 hashes for the ZIP and XML.

Keep the ZIP asset's name stable so the README and external sites can use:

`https://github.com/puikinsh/Pixel-Blogger-Template/releases/latest/download/pixel-blogger-template.zip`

Verify the published release, tag/commit, asset downloads, and checksums after publishing.

## Deploy the demo separately

Back up its theme and content first. Apply the released XML through Blogger, restore the demo's widget settings, and follow the manual [release checklist](../CONTRIBUTING.md#blogger-release-checklist). Update the documentation page using `demo/documentation.html`, keeping its existing permalink. Refresh demo screenshots only after the new theme is live.

Audit Colorlib's download, preview, and documentation links after each release. Never reuse another product's download merely because its filename is also `pixel.zip`. The website and demo are separate deployments from a GitHub release.
