import importlib.util
from pathlib import Path
from unittest import TestCase, main, mock

spec = importlib.util.spec_from_file_location(
    'sources', Path(__file__).with_name('current-affairs-sources.py'))
sources = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sources)


class SourcesTest(TestCase):
    def test_discovery_filters_exclusive_end_and_reports_thin_history(self):
        window = {'start': '2026-11-27T03:30:00Z', 'end': '2026-11-28T03:30:00Z'}
        feed = {'group': 'india', 'url': 'https://pib.gov.in/rss'}
        items = [
            ('before', 'Fri, 27 Nov 2026 03:29:59 GMT'),
            ('opening', 'Fri, 27 Nov 2026 03:30:00 GMT'),
            ('closing', 'Sat, 28 Nov 2026 03:30:00 GMT'),
        ]
        def document(entries):
            return ('<rss><channel>' + ''.join(
                f'<item><title>{title}</title><link>https://pib.gov.in/{title}</link>'
                f'<pubDate>{stamp}</pubDate></item>' for title, stamp in entries
            ) + '</channel></rss>').encode()
        with mock.patch.object(sources, 'fetch', return_value=(document(items), 'utf-8', 'application/xml')):
            coverage, candidates = sources.discover(feed, window)
        self.assertEqual(coverage['status'], 'checked')
        self.assertEqual([item['title'] for item in candidates], ['opening'])
        with mock.patch.object(sources, 'fetch', return_value=(document(items[-1:]), 'utf-8', 'application/xml')):
            coverage, _ = sources.discover(feed, window)
        self.assertEqual(coverage['status'], 'limited_history')

    def test_verification_excludes_non_editorial_markup(self):
        markup = b'<head><title>Hidden</title></head><script>Injected</script><main><p>Real &amp; public.</p></main>'
        with mock.patch.object(sources, 'fetch', return_value=(markup, 'utf-8', 'text/html')):
            page = sources.verify_page('https://pib.gov.in/record', {'pib.gov.in'})
        self.assertEqual(page['text'], 'Real & public.')
        self.assertEqual(len(page['sha256']), 64)
        with self.assertRaisesRegex(ValueError, 'outside configured'):
            sources.fetch('https://example.invalid', {'pib.gov.in'})


if __name__ == '__main__':
    main()
