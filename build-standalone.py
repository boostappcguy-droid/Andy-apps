#!/usr/bin/env python3
"""Build statecool-standalone.html: a single-file version of index.html
with all local assets (CSS, JS, favicon, logo) inlined, suitable for
drag-and-drop deploys like Netlify Drop."""
import base64


def b64(path):
    with open(path, 'rb') as f:
        return base64.b64encode(f.read()).decode('ascii')


with open('index.html', encoding='utf-8') as f:
    html = f.read()
with open('css/styles.css', encoding='utf-8') as f:
    css = f.read()
with open('js/main.js', encoding='utf-8') as f:
    js = f.read()

html = html.replace(
    '<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">',
    f'<link rel="icon" href="data:image/svg+xml;base64,{b64("assets/favicon.svg")}" type="image/svg+xml">'
)
html = html.replace(
    '<link rel="stylesheet" href="css/styles.css">',
    f'<style>\n{css}\n</style>'
)
html = html.replace(
    '<script src="js/main.js"></script>',
    f'<script>\n{js}\n</script>'
)
html = html.replace(
    'src="assets/logo-header.png"',
    f'src="data:image/png;base64,{b64("assets/logo-header.png")}"'
)

with open('statecool-standalone.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f'wrote statecool-standalone.html ({len(html) // 1024} KB)')
