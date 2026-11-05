"""Build the offline, self-contained HTML preview; no network or repository writes."""
from pathlib import Path
import re
root = Path(__file__).resolve().parents[1]
html = (root / 'index.html').read_text()
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>\n' + (root / 'style.css').read_text() + '\n</style>')
def inline_script(match):
    source = (root / match.group(1)).read_text()
    return '<script>\n' + source.replace('</script', '<\\/script') + '\n</script>'
html = re.sub(r'<script src="([^"]+)"></script>', inline_script, html)
(root / 'preview.html').write_text(html)
print('Built preview.html:', len(html.encode()), 'bytes')
