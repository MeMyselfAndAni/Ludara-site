# -*- coding: utf-8 -*-
"""Build every share card from SHARE-CARD-COPY.md.

The .md is the source of truth for the words. Edit it, run this, done.
A NEW: line wins; a blank NEW: keeps the NOW: text.
Type is auto-fitted: the headline shrinks until it fits 2 lines, the subline 3,
so a long line never overflows or gets clipped.
"""
import re, os, json
from PIL import Image
from playwright.sync_api import sync_playwright

ASSETS = '/mnt/user-data/uploads/A Perfect Day/MainSite/assets/'
HERE   = '/root/og/'

# which screenshot sits behind which card, and how much of its top chrome to trim
BASE = {
 'og-ludara':          ('fsm-map-path.webp',    0.16),
 'og-aperfectday':     ('demos/hotels.webp',    0.13),
 'og-hotels':          ('demos/hotels.webp',    0.13),
 'og-museums':         ('demos/museum.webp',    0.13),
 'og-realestate':      ('muza-map-desktop.webp',0.13),
 'og-perfectstorymap': ('demos/storymap2.webp', 0.13),
 'og-familystorymap':  ('fsm-map-path.webp',    0.16),
}
ORDER = ['og-ludara','og-aperfectday','og-hotels','og-museums',
         'og-realestate','og-perfectstorymap','og-familystorymap']

def parse(md):
    out, order = {}, []
    for block in re.split(r'\n## ', md)[1:]:
        m = re.search(r'`assets/(og-[a-z]+)\.jpg`', block)
        if not m: continue
        key = m.group(1); order.append(key); vals = {}
        for field in ('EYEBROW','HEADLINE','SUBLINE'):
            f = re.search(r'\*\*%s\*\*.*?NOW: (.*?)\n\s*NEW:[ \t]*(.*?)[ \t]*\n' % field, block, re.S)
            if not f: continue
            now, new = f.group(1).strip(), f.group(2).strip()
            vals[field] = new or now
        out[key] = vals
    return out, order

TPL = """<!DOCTYPE html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Fraunces';src:url('fraunces-var.woff2') format('woff2');font-weight:100 900;}
@font-face{font-family:'Inter';src:url('inter-var.woff2') format('woff2');font-weight:100 900;}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;position:relative;background:#0f0d0a}
.bg{position:absolute;inset:0;background:url('%(base)s') center/cover no-repeat;}
.veil{position:absolute;inset:0;background:
  linear-gradient(to bottom, rgba(11,10,7,0.82) 0%%, rgba(11,10,7,0.30) 15%%, rgba(11,10,7,0) 30%%),
  linear-gradient(to top, rgba(11,10,7,0.97) 0%%, rgba(11,10,7,0.86) 26%%, rgba(11,10,7,0.18) 55%%, rgba(11,10,7,0) 100%%);}
.eyebrow{position:absolute;top:38px;left:64px;font-family:'Inter';font-size:19px;font-weight:800;
  letter-spacing:0.30em;text-transform:uppercase;color:#d4a84b;}
.wrap{position:absolute;left:64px;right:96px;bottom:52px;}
h1{font-family:'Fraunces',Georgia,serif;font-weight:700;font-size:70px;line-height:1.06;color:#fdf6e6;
   letter-spacing:-0.01em;text-shadow:0 3px 18px rgba(0,0,0,0.75);}
p{font-family:'Inter';font-weight:500;font-size:26px;line-height:1.4;color:#e2d3b0;margin-top:18px;max-width:840px;}
.brand{position:absolute;right:64px;bottom:54px;font-family:'Inter';font-size:21px;font-weight:800;
  letter-spacing:0.16em;color:#d4a84b;}
.rule{position:absolute;left:64px;right:64px;bottom:34px;height:3px;
  background:linear-gradient(to right,#d4a84b,rgba(212,168,75,0));}
</style></head><body>
<div class="bg"></div><div class="veil"></div>
<div class="eyebrow">%(eyebrow)s</div>
<div class="wrap"><h1>%(head)s</h1><p>%(sub)s</p></div>
<div class="rule"></div><div class="brand">LUDARA.AI</div>
<script>
/* Shrink until it fits: a long headline should get smaller, never clipped. */
function fit(el, maxLines, min){
  var lh = parseFloat(getComputedStyle(el).lineHeight);
  var fs = parseFloat(getComputedStyle(el).fontSize);
  while (el.scrollHeight > lh * maxLines + 2 && fs > min) {
    fs -= 1; el.style.fontSize = fs + 'px';
    lh = parseFloat(getComputedStyle(el).lineHeight);
  }
  return fs;
}
window.__fit = [fit(document.querySelector('h1'), 2, 34),
                fit(document.querySelector('p'),  3, 18)];
var pr = document.querySelector('p').getBoundingClientRect();
var br = document.querySelector('.brand').getBoundingClientRect();
window.__clash = !(pr.right <= br.left || pr.bottom <= br.top || pr.top >= br.bottom);
window.__gap = Math.round(br.left - pr.right);
</script></body></html>"""


def balance(text):
    """A ' / ' in the .md is an explicit line break and is always honoured.
    Without one, break at the word boundary nearest the middle, so a headline
    never leaves a single short word stranded on the second line."""
    if ' / ' in text:
        return text.replace(' / ', '<br>')
    words = text.split()
    if len(words) < 4:
        return text
    best, gap = None, 1e9
    for i in range(1, len(words)):
        a, b = ' '.join(words[:i]), ' '.join(words[i:])
        d = abs(len(a) - len(b))
        if d < gap: gap, best = d, (a, b)
    return best[0] + '<br>' + best[1]

def crop(src, drop_top, out):
    im = Image.open(ASSETS + src).convert('RGB')
    im = im.crop((0, int(im.height * drop_top), im.width, im.height))
    tw, th = 1200, 630
    if im.width / im.height > tw / th:
        nw = int(im.height * tw / th); x = (im.width - nw) // 2
        im = im.crop((x, 0, x + nw, im.height))
    else:
        im = im.crop((0, 0, im.width, int(im.width * th / tw)))
    im.resize((tw, th), Image.LANCZOS).save(HERE + out)

cards, _ = parse(open(HERE + 'SHARE-CARD-COPY.md', encoding='utf-8').read())
subs = {}
with sync_playwright() as pw:
    b = pw.chromium.launch()
    for key in ORDER:
        v = cards.get(key)
        if not v: print('  ! no block for', key); continue
        src, drop = BASE[key]
        crop(src, drop, key + '-base.png')
        head = balance(v['HEADLINE'])
        open(HERE + 'tmp.html', 'w', encoding='utf-8').write(
            TPL % dict(base=key + '-base.png', eyebrow=v['EYEBROW'], head=head, sub=v['SUBLINE']))
        p = b.new_page(viewport={'width': 1200, 'height': 630})
        p.goto('file://' + HERE + 'tmp.html'); p.wait_for_timeout(900)
        sizes = p.evaluate('() => window.__fit')
        clash = p.evaluate('() => window.__clash')
        gap   = p.evaluate('() => window.__gap')
        p.screenshot(path=HERE + key + '.png'); p.close()
        Image.open(HERE + key + '.png').convert('RGB').save(
            HERE + key + '.jpg', quality=86, optimize=True, progressive=True)
        subs[key] = v['SUBLINE']
        print(f'{key:<20} headline {sizes[0]:>3.0f}px  subline {sizes[1]:>3.0f}px  '
              f'{os.path.getsize(HERE+key+".jpg")//1024:>3} KB'
              + ('   *** TEXT OVERLAPS THE LUDARA.AI MARK ***' if clash else f'   gap to brand {gap}px'))
    b.close()
json.dump(subs, open(HERE + 'sublines.json', 'w'), ensure_ascii=False, indent=1)
