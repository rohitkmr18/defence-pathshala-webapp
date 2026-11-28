"""Fetch public RSS/Atom and verify extractive claims against primary HTML."""
import hashlib
import json
import re
import sys
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser
from urllib.parse import urlparse
from urllib.request import HTTPRedirectHandler, Request, build_opener
from xml.etree import ElementTree
from concurrent.futures import ThreadPoolExecutor

LIMIT = 2_000_000


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


def fetch(url, hosts):
    target = urlparse(url)
    if (target.scheme != 'https' or target.hostname not in hosts
            or target.username or target.password or target.port not in (None, 443)):
        raise ValueError('URL outside configured HTTPS source hosts')
    request = Request(url, headers={'User-Agent': 'DefencePathshalaEditorial/2.1'})
    with build_opener(NoRedirect()).open(request, timeout=12) as response:
        data = response.read(LIMIT + 1)
        if len(data) > LIMIT:
            raise ValueError('Source response exceeds limit')
        return data, response.headers.get_content_charset() or 'utf-8', response.headers.get_content_type()


def when(value):
    try:
        date = datetime.fromisoformat(value.replace('Z', '+00:00'))
    except ValueError:
        date = parsedate_to_datetime(value)
    if date.tzinfo is None:
        raise ValueError('Source timestamp needs a timezone')
    return date.astimezone(timezone.utc)


def normalized(text):
    return ' '.join(text.split())


def discover(feed, window):
    url = feed['url']
    try:
        data, _, _ = fetch(url, {urlparse(url).hostname})
        if re.search(br'<!\s*(?:DOCTYPE|ENTITY)', data, re.I):
            raise ValueError('DTD is unsupported')
        root = ElementTree.fromstring(data)
        entries = [node for node in root.iter() if node.tag.split('}')[-1] in ('item', 'entry')]
        start, end = when(window['start']), when(window['end'])
        candidates, timestamps = [], []
        for entry in entries:
            fields = {node.tag.split('}')[-1]: node for node in entry}
            links = [node for node in entry if node.tag.split('}')[-1] == 'link'
                     and node.get('rel', 'alternate') == 'alternate']
            date = next((fields[key].text for key in ('pubDate', 'published', 'date') if key in fields), None)
            if not date or not links or 'title' not in fields:
                continue
            published = when(date)
            timestamps.append(published)
            link = links[0]
            href = link.get('href') or link.text
            if start <= published < end and href and fields['title'].text:
                candidates.append({'title': normalized(fields['title'].text), 'url': href,
                                   'publishedAt': published.isoformat(), 'feed': url})
        covers_start = bool(timestamps) and min(timestamps) <= start <= max(timestamps)
        return ({'url': url, 'group': feed['group'],
                 'status': 'checked' if covers_start else 'limited_history',
                 'linkCount': len(candidates)}, candidates)
    except (ValueError, OSError, ElementTree.ParseError, OverflowError, TypeError):
        return ({'url': url, 'group': feed['group'], 'status': 'unavailable'}, [])


class VisibleText(HTMLParser):
    excluded = {'script', 'style', 'template', 'noscript', 'nav', 'footer', 'header', 'head', 'aside'}
    breaks = {'p', 'div', 'li', 'br', 'tr', 'td', 'section', 'h1', 'h2', 'h3'}

    def __init__(self):
        super().__init__()
        self.parts = []
        self.hidden = []

    def handle_starttag(self, tag, attrs):
        if tag in self.excluded:
            self.hidden.append(tag)
        elif tag in self.breaks:
            self.parts.append(' ')

    def handle_endtag(self, tag):
        if self.hidden and tag == self.hidden[-1]:
            self.hidden.pop()
        elif tag in self.breaks:
            self.parts.append(' ')

    def handle_data(self, data):
        if not self.hidden:
            self.parts.append(data)


def verify_page(url, hosts):
    data, encoding, media = fetch(url, hosts)
    if media not in ('text/html', 'application/xhtml+xml', 'text/plain'):
        raise ValueError('Unsupported primary source format')
    text = data.decode(encoding)
    if media != 'text/plain':
        parser = VisibleText()
        parser.feed(text)
        text = ''.join(parser.parts)
    return {'text': normalized(text), 'sha256': hashlib.sha256(data).hexdigest(),
            'checkedAt': datetime.now(timezone.utc).isoformat()}


def main(request):
    if request['operation'] == 'discover':
        feeds = request['feeds']
        if not 1 <= len(feeds) <= 16:
            raise ValueError('Configure 1–16 feed endpoints')
        with ThreadPoolExecutor(max_workers=6) as pool:
            results = list(pool.map(lambda feed: discover(feed, request['window']), feeds))
        candidates = {item['url']: item for _, items in results for item in items}
        return {'window': request['window'], 'coverage': [status for status, _ in results],
                'candidates': list(candidates.values())}
    urls = request['urls']
    if not 1 <= len(urls) <= 16:
        raise ValueError('Expected 1–16 primary sources')
    with ThreadPoolExecutor(max_workers=6) as pool:
        pages = pool.map(lambda url: verify_page(url, request['hosts']), urls)
        return dict(zip(urls, pages, strict=True))


if __name__ == '__main__':
    print(json.dumps(main(json.load(sys.stdin)), ensure_ascii=False))
