#!/usr/bin/env python3
"""Validate Blogger XML and standalone inline JavaScript without dependencies."""

from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET


def main():
    root = Path(__file__).resolve().parents[1]
    node = shutil.which("node")
    if not node:
        sys.exit("Node.js is required for JavaScript syntax checks.")
    checked = 0
    templated = 0
    with tempfile.TemporaryDirectory(prefix="pixel-check-") as scratch:
        for filename in ("Pixel-Blogger-Template.xml", "Pixel Demo Content.xml"):
            tree = ET.parse(root / filename)
            print(f"XML OK: {filename}")
            if filename != "Pixel-Blogger-Template.xml":
                continue
            for index, element in enumerate(tree.iter("{http://www.w3.org/1999/xhtml}script"), 1):
                if element.get("src") or element.get("type") == "application/ld+json":
                    continue
                if len(element):
                    templated += 1
                    continue
                code = "".join(element.itertext())
                path = Path(scratch) / f"inline-{index}.js"
                path.write_text(code, encoding="utf-8")
                result = subprocess.run([node, "--check", str(path)], capture_output=True, text=True)
                if result.returncode:
                    sys.exit(f"Inline script {index} failed:\n{result.stderr}")
                checked += 1
    print(f"JavaScript OK: {checked} standalone blocks; {templated} Blogger-dependent blocks require live testing.")


if __name__ == "__main__":
    main()
