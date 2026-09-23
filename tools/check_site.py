"""Check the built site's routes, local resources and retained content.

Usage: python3 tools/check_site.py local/site [--baseline local/baseline]
Only Python's standard library is required. This is not a visual browser test.
"""
from argparse import ArgumentParser
from collections import Counter
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlparse
import re


def normalize(text):
    return ' '.join(unescape(text).split())


class Document(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.ids, self.links, self.h1, self.paragraphs, self.labels = [], [], 0, [], []
        self.text, self.stack, self.paragraph = [], [], None
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.stack.append((tag, attrs.get('class', '').split()))
        if tag == 'h1': self.h1 += 1
        if attrs.get('id'): self.ids.append(attrs['id'])
        self.labels.extend(attrs.get('aria-labelledby', '').split())
        for key in ('href', 'src', 'xlink:href'):
            if attrs.get(key): self.links.append(attrs[key])
        if tag == 'p' and any('page__content' in classes for _, classes in self.stack):
            self.paragraph = []

    def handle_endtag(self, tag):
        if tag == 'p' and self.paragraph is not None:
            self.paragraphs.append(normalize(''.join(self.paragraph)))
            self.paragraph = None
        for index in range(len(self.stack)-1, -1, -1):
            if self.stack[index][0] == tag:
                self.stack = self.stack[:index]
                break

    def handle_data(self, text):
        if any(tag in ('script', 'style') for tag, _ in self.stack): return
        self.text.append(text)
        if self.paragraph is not None: self.paragraph.append(text)


parser = ArgumentParser()
parser.add_argument('site', type=Path)
parser.add_argument('--baseline', type=Path)
args = parser.parse_args()
site = args.site.resolve()
errors = []


def resolve(path):
    target = site / unquote(path).lstrip('/')
    for candidate in (target, target / 'index.html', target.with_suffix('.html')):
        if candidate.is_file(): return candidate
    return None


pages = sorted(set([site/'index.html', site/'publications/index.html', site/'teaching/index.html', site/'cv-json/index.html'] + list((site/'publication').rglob('*.html')) + list((site/'teaching').rglob('*.html'))))
for path in pages:
    if not path.exists():
        errors.append(f'Missing page: {path}')
        continue
    doc = Document(path.read_text())
    if doc.h1 != 1: errors.append(f'{path.relative_to(site)}: expected one H1, got {doc.h1}')
    duplicates = [name for name, count in Counter(doc.ids).items() if count > 1]
    if duplicates: errors.append(f'{path.relative_to(site)}: duplicate IDs {duplicates}')
    if any(name not in doc.ids for name in doc.labels): errors.append(f'{path.relative_to(site)}: broken accessible label')
    base = 'https://georgeoshardo.github.io/' + str(path.relative_to(site))
    for ref in doc.links:
        parsed = urlparse(urljoin(base, ref))
        if parsed.scheme not in ('http', 'https'): continue
        if parsed.hostname not in ('georgeoshardo.github.io', '127.0.0.1', 'localhost'): continue
        target = resolve(parsed.path)
        if target is None:
            errors.append(f'{path.relative_to(site)}: missing local target {ref}')
        elif parsed.fragment and target.suffix == '.html':
            if unquote(parsed.fragment) not in Document(target.read_text()).ids:
                errors.append(f'{path.relative_to(site)}: missing fragment {ref}')
    if args.baseline:
        old = args.baseline / path.relative_to(site)
        if old.exists():
            old_doc = Document(old.read_text())
            new_text = normalize(''.join(doc.text))
            for paragraph in old_doc.paragraphs:
                if not paragraph or paragraph.startswith('Recommended citation:'): continue
                if paragraph not in new_text:
                    errors.append(f'{path.relative_to(site)}: original paragraph missing: {paragraph[:80]}')

if args.baseline:
    before = {p.relative_to(args.baseline) for p in args.baseline.rglob('*.html')}
    after = {p.relative_to(site) for p in site.rglob('*.html')}
    if before-after: errors.append(f'Lost existing HTML routes: {sorted(str(p) for p in before-after)}')
    cv_before = Document((args.baseline/'cv-json/index.html').read_text())
    cv_after = normalize(''.join(Document((site/'cv-json/index.html').read_text()).text))
    # Verify the content data rather than old navigation or duplicate headings.
    import json
    data = json.loads(Path('_data/cv.json').read_text())
    def strings(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key not in ('website', 'url', 'username', 'releaseDate', 'date', 'label', 'countryCode'):
                    yield from strings(child)
        elif isinstance(value, list):
            for child in value: yield from strings(child)
        elif isinstance(value, str) and value.strip(): yield normalize(value)
    for value in strings(data):
        if value not in cv_after: errors.append(f'CV content missing: {value[:80]}')

for ref in re.findall(r'url\("?([^\")]+)', (site/'assets/css/desk.css').read_text()):
    if not ref.startswith(('data:', 'https:')) and not (site/'assets/css'/ref).resolve().is_file():
        errors.append(f'Missing CSS resource: {ref}')
for forbidden in ('design-studies', 'local', 'tools', 'docs', 'logs'):
    if (site/forbidden).exists(): errors.append(f'Development directory leaked into site: {forbidden}')

if errors:
    raise SystemExit('\n'.join(errors))
print(f'PASS: {len(pages)} main and collection pages; local links, assets, headings and accessible labels.')
if args.baseline: print('PASS: existing HTML routes, original page paragraphs and CV content retained.')
print('PASS: design studies, tools and build logs excluded from the published site.')
