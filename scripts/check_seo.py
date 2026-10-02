"""Run after npm run build: python3 scripts/check_seo.py."""
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
from xml.etree import ElementTree


class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.tags = []
        self.title = ""
        self.schemas = []
        self.capture = None
        self.buffer = ""
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.append((tag, attrs))
        if tag == "title" or (tag == "script" and attrs.get("type") == "application/ld+json"):
            self.capture, self.buffer = tag, ""

    def handle_data(self, data):
        if self.capture:
            self.buffer += data

    def handle_endtag(self, tag):
        if tag == self.capture:
            if tag == "title":
                self.title = self.buffer
            else:
                self.schemas.extend(json.loads(self.buffer)["@graph"])
            self.capture = None


dist = Path(__file__).resolve().parents[1] / "dist"
urls = [node.text for node in ElementTree.parse(dist / "sitemap.xml").iterfind(".//{*}loc")]
assert urls and len(urls) == len(set(urls)), "Sitemap vide ou URLs dupliquées"
titles, descriptions, images = set(), set(), set()
for url in urls:
    path = urlsplit(url).path
    page = Page((dist / path.lstrip("/") / "index.html").read_text())
    meta = {a.get("name", a.get("property")): a.get("content") for t, a in page.tags if t == "meta"}
    canonical = [a["href"] for t, a in page.tags if t == "link" and a.get("rel") == "canonical"]
    assert canonical == [url], url
    assert "noindex" not in meta["robots"], url
    assert page.title and page.title not in titles, url
    assert meta["description"] and meta["description"] not in descriptions, url
    assert any(t == "html" and a.get("lang") == "fr" for t, a in page.tags), url
    assert sum(t == "h1" for t, a in page.tags) == 1, url
    assert meta["og:title"] == meta["twitter:title"] == page.title, url
    assert meta["og:description"] == meta["twitter:description"] == meta["description"], url
    assert meta["og:url"] == url, url
    assert meta["og:image"] == meta["twitter:image"] and meta["og:image:alt"], url
    image = urlsplit(meta["og:image"])
    assert image.scheme == "https" and image.netloc == urlsplit(url).netloc, url
    assert (dist / image.path.lstrip("/")).is_file(), image.path
    assert meta["og:image"] not in images, url
    nodes = {node["@type"]: node for node in page.schemas}
    if path == "/":
        assert {"Person", "WebSite", "ProfilePage"} <= nodes.keys(), url
        assert "Lyon" in page.title and nodes["Person"]["homeLocation"]["name"] == "Lyon", url
    else:
        assert {"WebPage", "CreativeWork", "BreadcrumbList"} <= nodes.keys(), url
        crumbs = nodes["BreadcrumbList"]["itemListElement"]
        assert [item["position"] for item in crumbs] == [1, 2], url
        assert crumbs[-1]["item"] == url and nodes["WebPage"]["url"] == url, url
    for tag, attrs in page.tags:
        href = attrs.get("href", "")
        if tag == "a" and href.startswith("/") and not href.startswith("//"):
            target = dist / urlsplit(href).path.lstrip("/")
            assert target.is_file() or (target / "index.html").is_file(), href
    titles.add(page.title)
    descriptions.add(meta["description"])
    images.add(meta["og:image"])

indexed_files = {dist / urlsplit(url).path.lstrip("/") / "index.html" for url in urls}
assert indexed_files == set(dist.rglob("*.html")) - {dist / "404.html"}, "Pages absentes du sitemap"
error_page = Page((dist / "404.html").read_text())
assert any(t == "meta" and a.get("name") == "robots" and "noindex" in a["content"] for t, a in error_page.tags)
assert not any(t == "link" and a.get("rel") == "canonical" for t, a in error_page.tags)
assert f"Sitemap: {urls[0]}sitemap.xml" in (dist / "robots.txt").read_text()
print(f"SEO vérifié : {len(urls)} pages, métadonnées, images, JSON-LD, liens internes, sitemap et 404.")
