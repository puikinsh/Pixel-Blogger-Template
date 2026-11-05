"""Model Blogger's JSON substitutions and conditional branches; not a Blogger emulator."""

from pathlib import Path
import json
import unittest
import xml.etree.ElementTree as ET

ROOT = ET.parse(Path(__file__).resolve().parents[1] / "Pixel-Blogger-Template.xml").getroot()
HTML = "{http://www.w3.org/1999/xhtml}"
B = "{http://www.google.com/2005/gml/b}"
DATA = "{http://www.google.com/2005/gml/data}"


def find_include(name):
    return next(node for node in ROOT.iter(B + "includable") if node.get("id") == name)


def render(node, values):
    if node.tag.startswith(DATA):
        field = node.tag[len(DATA):]
        if not field.endswith(".jsonEscaped"):
            raise AssertionError(f"Unescaped JSON-LD value: {field}")
        return json.dumps(values[field.removesuffix(".jsonEscaped")], ensure_ascii=False)[1:-1]
    if node.tag == B + "loop":
        items = values.get(node.get("values"), [])
        return "".join(render_children(node, {**values, "data:label.isFirst": i == 0,
            "label.name": item["name"], "label.url": item["url"]}) for i, item in enumerate(items))
    if node.tag == B + "if":
        active = bool(values.get(node.get("cond")))
        output = (node.text or "") if active else ""
        for child in node:
            if child.tag == B + "else":
                active = not active
            elif active:
                output += render(child, values)
            if active:
                output += child.tail or ""
        return output
    return render_children(node, values)


def render_children(node, values):
    return (node.text or "") + "".join(render(child, values) + (child.tail or "") for child in node)


def fixture(image=True, labels=True, modified=True):
    title = 'Travel "Guide" \\ notes\nA & B — Rīga'
    return {
        "blog.title": title, "blog.homepageUrl": "https://example.com/",
        "blog.homepageUrl.canonical": "https://example.com/",
        "blog.canonicalUrl": "https://example.com/p/about.html",
        "blog.pageName": title, "post.title": title, "post.author": 'Author "Name" & Co',
        "post.url.canonical": "https://example.com/2026/11/post.html",
        "post.firstImageUrl": "https://example.com/image.jpg?a=1&b=2",
        "post.timestampISO8601": "2026-11-05T10:00:00+02:00",
        "post.lastUpdatedISO8601": "2026-11-05T11:00:00+02:00",
        'data:blog.pageType == "item"': True,
        "data:post.firstImageUrl": image, "data:post.lastUpdatedISO8601": modified,
        "data:post.labels": [{"name": title, "url": "https://example.com/search/label/Travel%20%26%20Food"}] if labels else [],
    }


class SEOFixtures(unittest.TestCase):
    def test_schema_reachable_from_both_renderers(self):
        for name in ("post", "mobile-post"):
            includes = [n for n in find_include(name).iter(B + "include") if n.get("name") == "pixel-post-schema"]
            self.assertEqual(len(includes), 1, name)
            self.assertEqual(includes[0].get("data"), "post")

    def test_all_schema_branches(self):
        scripts = list(find_include("pixel-post-schema").iter(HTML + "script"))
        self.assertEqual(len(scripts), 2)
        for image in (True, False):
            for labels in (True, False):
                for modified in (True, False):
                    with self.subTest(image=image, labels=labels, modified=modified):
                        values = fixture(image, labels, modified)
                        article, breadcrumbs = [json.loads(render(n, values)) for n in scripts]
                        self.assertEqual(article["headline"], values["post.title"])
                        self.assertEqual(article["author"]["name"], values["post.author"])
                        self.assertEqual(article["url"], values["post.url.canonical"])
                        self.assertEqual(article["mainEntityOfPage"]["@id"], article["url"])
                        self.assertEqual("image" in article, image)
                        self.assertEqual("dateModified" in article, modified)
                        entries = breadcrumbs["itemListElement"]
                        self.assertEqual(len(entries), 3 if labels else 2)
                        self.assertEqual([e["position"] for e in entries], list(range(1, len(entries) + 1)))
                        self.assertEqual(entries[-1]["item"], article["url"])

    def test_head_schemas_preserve_text_and_canonical_urls(self):
        scripts = list(ROOT.find(HTML + "head").iter(HTML + "script"))
        schemas = [json.loads(render(n, fixture())) for n in scripts if n.get("type") == "application/ld+json"]
        self.assertEqual(len(schemas), 2)
        self.assertEqual(schemas[0]["name"], fixture()["blog.title"])
        self.assertEqual(schemas[1]["itemListElement"][-1]["item"], "https://example.com/p/about.html")

    def test_standard_post_title_is_visible_h1(self):
        post = find_include("post")
        hero = next(n for n in post.iter(HTML + "div") if n.get("id") == "hpick")
        self.assertNotIn("hidden", hero.get("class", ""))
        headings = list(hero.iter(HTML + "h1"))
        self.assertEqual(len(headings), 1)
        self.assertEqual(headings[0].get("class"), "entry-title")
        scripts = "".join("".join(n.itertext()) for n in post.iter(HTML + "script"))
        self.assertIn('insertAdjacentElement("afterend", pick)', scripts)
        self.assertNotIn('pick.innerHTML', scripts)

    def test_blogger_owns_canonical_and_open_graph_metadata(self):
        head = ROOT.find(HTML + "head")
        self.assertTrue(any(n.get("name") == "all-head-content" for n in head.iter(B + "include")))
        properties = [n.get("property") for n in head.iter(HTML + "meta")]
        for name in ("og:title", "og:url", "og:image", "og:description"):
            self.assertNotIn(name, properties, f"Duplicates Blogger's generated {name}")


if __name__ == "__main__":
    unittest.main()
