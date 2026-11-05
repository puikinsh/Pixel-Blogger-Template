#!/usr/bin/env python3
"""Build an installer ZIP from an explicit public-file list and write checksums."""

import argparse
from datetime import datetime
import hashlib
from pathlib import Path
import re
import shutil
import zipfile


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    template = (root / "Pixel-Blogger-Template.xml").read_text(encoding="utf-8")
    version = re.search(r"Version: (\d+\.\d+\.\d+)", template).group(1)
    changelog = (root / "CHANGELOG.md").read_text(encoding="utf-8")
    match = re.search(r"## \[" + re.escape(version) + r"\] - (\d{4}-\d{2}-\d{2})", changelog)
    if not match or f"Version-{version}-" not in (root / "README.md").read_text(encoding="utf-8"):
        parser.error("Template, README, and dated changelog versions must agree.")
    timestamp = datetime.strptime(match.group(1), "%Y-%m-%d").timetuple()[:6]
    names = ["Pixel-Blogger-Template.xml", "Pixel Demo Content.xml", "README.md", "CHANGELOG.md", "LICENSE", "CONTRIBUTING.md", "AGENTS.md"]
    names += [str(p.relative_to(root)) for p in sorted((root / "docs").rglob("*.md"))]
    names += [str(p.relative_to(root)) for p in sorted((root / "demo").glob("*.html"))]
    names += [str(p.relative_to(root)) for p in sorted((root / "scripts").glob("*.py"))]
    names += [str(p.relative_to(root)) for p in sorted((root / "tests").iterdir()) if p.suffix in {".py", ".cjs"}]
    args.output.mkdir(parents=True, exist_ok=True)
    archive = args.output / "pixel-blogger-template.zip"
    with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as package:
        for name in names:
            info = zipfile.ZipInfo(f"Pixel-Blogger-Template-{version}/{name}", timestamp)
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            package.writestr(info, (root / name).read_bytes())
        if package.testzip():
            raise SystemExit("ZIP integrity check failed.")
    xml = args.output / "Pixel-Blogger-Template.xml"
    shutil.copyfile(root / xml.name, xml)
    assets = [archive, xml]
    sums = "".join(f"{hashlib.sha256(path.read_bytes()).hexdigest()}  {path.name}\n" for path in assets)
    (args.output / "SHA256SUMS").write_text(sums, encoding="utf-8")
    print(f"Built Pixel {version}: {len(names)} files; {archive.stat().st_size:,} byte ZIP")
    print(sums, end="")


if __name__ == "__main__":
    main()
