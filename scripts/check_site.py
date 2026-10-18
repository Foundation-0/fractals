#!/usr/bin/env python3
"""fractals site gate, adapted from Foundation0's check_site.py. Standard library only, no network.

  1  pages:    every page has <title>, a description, lang, a viewport, and an absolute og:image
               under SITE that resolves to a file in the repo
  2  links:    every relative href/src in the pages resolves to a file in the repo,
               and every same-page #anchor exists
  3  scripts:  no third-party script origins (stylesheets from Google Fonts are the one exception,
               as on the Foundation0 site)
  4  dup ids:  no duplicate id attributes on a page

Usage: python3 scripts/check_site.py   (exit 0 = clean)
"""
import html.parser
import os
import posixpath
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://foundation-0.github.io/fractals/'
PAGES = ['index.html', '404.html', 'gravitational-atom/index.html']
errs = []


def err(check, msg):
    errs.append(f'{check}: {msg}')


class Page(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = False
        self.desc = False
        self.lang = False
        self.viewport = False
        self.og_image = None
        self.og_url = None
        self.refs = []
        self.ids = []
        self.scripts = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'html' and a.get('lang'):
            self.lang = True
        if tag == 'title':
            self.title = True
        if tag == 'meta':
            if a.get('name') == 'description' and a.get('content'):
                self.desc = True
            if a.get('name') == 'viewport':
                self.viewport = True
            if a.get('property') == 'og:image':
                self.og_image = a.get('content')
            if a.get('property') == 'og:url':
                self.og_url = a.get('content')
        if 'id' in a:
            self.ids.append(a['id'])
        for k in ('href', 'src'):
            if a.get(k):
                self.refs.append(a[k])
        if tag == 'script' and a.get('src'):
            self.scripts.append(a['src'])


for rel in PAGES:
    path = os.path.join(ROOT, rel)
    page = Page()
    page.feed(open(path, encoding='utf-8').read())
    base = posixpath.dirname(rel)
    if not page.title:
        err('pages', f'{rel}: no <title>')
    if not page.desc:
        err('pages', f'{rel}: no meta description')
    if not page.lang:
        err('pages', f'{rel}: no lang')
    if not page.viewport:
        err('pages', f'{rel}: no viewport')
    if not page.og_image:
        err('pages', f'{rel}: no og:image')
    elif not page.og_image.startswith(SITE):
        err('pages', f'{rel}: og:image not absolute under {SITE}: {page.og_image}')
    elif not os.path.isfile(os.path.join(ROOT, page.og_image[len(SITE):])):
        err('pages', f'{rel}: og:image does not resolve: {page.og_image}')
    if not page.og_url:
        err('pages', f'{rel}: no og:url')
    seen = set()
    for i in page.ids:
        if i in seen:
            err('dup-ids', f'{rel}: duplicate id "{i}"')
        seen.add(i)
    for ref in page.refs:
        if ref.startswith(('http://', 'https://', 'mailto:', 'data:')):
            continue
        target, _, frag = ref.partition('#')
        if target == '':
            if frag and frag not in seen:
                err('links', f'{rel}: anchor #{frag} has no element')
            continue
        full = os.path.normpath(os.path.join(ROOT, base, target))
        if os.path.isdir(full):
            full = os.path.join(full, 'index.html')
        if not full.startswith(ROOT) or not os.path.isfile(full):
            err('links', f'{rel}: {ref} does not resolve')
    for src in page.scripts:
        if src.startswith(('http://', 'https://', '//')):
            err('scripts', f'{rel}: third-party script {src}')

for e in errs:
    print(e)
print(f'{len(errs)} error(s)' if errs else 'site check clean')
sys.exit(1 if errs else 0)
