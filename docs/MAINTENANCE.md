# Maintenance guide

No build step, no dependencies. Edit an `.html` file, save, upload. That is the
whole workflow — and it is the main reason the site is built this way.

## The one thing to know

**The header and footer are duplicated in all 12 HTML files.** This is the cost
of having no template engine. If you change a nav link, a phone number or a
footer entry, you must change it everywhere.

```bash
# See every page containing the thing you're changing
grep -rln "99794 68675" *.html */index.html

# Change it everywhere at once
sed -i 's/OLD/NEW/g' *.html */index.html

# Always confirm the count matches what you expected
grep -rc "NEW" *.html */index.html
```

Adding a nav item touches the `<ul class="nav-list">` in all 12 files plus the
footer lists. If you find yourself doing this often, that is the point at which
a static site generator earns its keep — but it also ends the zero-dependency
guarantee, so don't do it for one change a year.

## Common edits

### Change text on a page
Open the page, find the text, edit it. Nothing else to do.

### Add a page
1. Copy the closest existing page (`about/index.html` is the simplest).
2. Update `<title>`, `<meta name="description">`, `<link rel="canonical">`,
   `og:title`, `og:url`, `twitter:*`.
3. Update the `BreadcrumbList` JSON-LD (`name` and `item`).
4. Add it to `sitemap.xml` with today's date.
5. Add it to the nav and/or footer in **all 12** files if it should be linked.
6. Re-run the checks at the bottom of this file.

### Update the "last updated" date on a policy
`privacy/index.html` and `terms/index.html`, search for `Last updated`.

### Change a colour or spacing
`assets/css/style.css`, section 1 (design tokens). Change the variable, not the
places that use it. Both light and dark values are defined — update both.

### Never use `style="..."`
The production CSP sets `style-src 'self'` with no `unsafe-inline`, so inline
styles **silently stop applying in production** while working fine locally. Use
one of the utility classes at the end of `style.css`, or add a new one.

The same applies to `<script>` blocks and `onclick=` attributes — external files
only.

## Images

There are currently no photographs, only inline SVG and the generated Open Graph
image. When you have real photos of the shop, stock or repairs, use this pattern:

```html
<img src="../assets/images/workshop.webp"
     alt="Technician replacing a fuser unit on an HP LaserJet"
     width="1200" height="800" loading="lazy" decoding="async">
```

Rules that keep Lighthouse green:

- **Always set `width` and `height`** (the intrinsic pixel size). Without them
  the page reflows as images arrive and CLS spikes.
- `loading="lazy"` on everything **below** the fold; never on a hero image.
- Prefer WebP. Convert with `cwebp -q 82 in.jpg -o out.webp`, or:
  ```bash
  python3 -c "from PIL import Image; im=Image.open('in.jpg'); im.save('out.webp', quality=82, method=6)"
  ```
- Resize to the largest size actually displayed — a 4000px photo in a 600px slot
  is the most common performance mistake.
- For genuinely responsive images use `srcset`:
  ```html
  <img src="../assets/images/shop-800.webp"
       srcset="../assets/images/shop-800.webp 800w, ../assets/images/shop-1600.webp 1600w"
       sizes="(min-width: 56em) 50vw, 100vw"
       alt="…" width="1600" height="1067" loading="lazy" decoding="async">
  ```
- Write real `alt` text describing the content. Use `alt=""` only for purely
  decorative images (as on the logo, which sits next to the business name).

Regenerate the icons and Open Graph image after a logo change — see
`assets/icons/logo.svg` and `favicon.svg`, then rebuild the PNGs with any
rasteriser (the originals were made with ImageMagick + Pillow at 192, 512,
maskable 512, apple-touch 180, and OG 1200×630).

## Adding a self-hosted font

The site intentionally uses the system font stack: zero requests, zero font
swap. If branding requires a specific typeface:

1. Put `woff2` files in `assets/fonts/` (subset to Latin; add Gujarati only if
   you publish Gujarati text).
2. Add `@font-face` with `font-display: swap` to `style.css`.
3. Set `--font` to the new family with the system stack still as fallback.
4. Preload only the one weight used above the fold:
   `<link rel="preload" href="../assets/fonts/x.woff2" as="font" type="font/woff2" crossorigin>`
5. Keep `font-src 'self'` — do **not** switch to Google Fonts. That reintroduces
   a third-party request and a privacy disclosure.

## Cache busting

CSS and JS are served with `max-age=86400` and are **not** content-hashed. After
editing either, visitors may hold the old copy for up to a day. To force it:

```bash
sed -i 's|style.css"|style.css?v=2"|g; s|site.js"|site.js?v=2"|g' *.html */index.html
```

Increment the number each time. HTML itself is `max-age=0, must-revalidate`, so
content edits appear immediately.

## Contact form

Currently wired for Netlify Forms. To move it elsewhere, change the `<form>`
`action` and update **two** things:

1. `form-action 'self'` in the `_headers` CSP — an external endpoint must be
   listed there or the browser blocks the submission.
2. `privacy/index.html` §4, which names the processor.

## Checks before publishing

```bash
# 1. No inline styles, scripts or event handlers (CSP would block them)
grep -rn 'style="' *.html */index.html
grep -rn ' on[a-z]*="' *.html */index.html
grep -rn '<script>' *.html */index.html

# 2. Every JSON-LD block still parses
python3 - <<'EOF'
import json, re, glob
for f in ['index.html','404.html'] + sorted(glob.glob('*/index.html')):
    for b in re.findall(r'<script type="application/ld\+json">(.*?)</script>',
                        open(f).read(), re.S):
        try: json.loads(b)
        except Exception as e: print('FAIL', f, e)
print('json-ld ok')
EOF

# 3. No broken internal links
python3 - <<'EOF'
import re, os, glob
bad = 0
for f in ['index.html','404.html'] + sorted(glob.glob('*/index.html')):
    for h in re.findall(r'(?:href|src)="([^"]+)"', open(f).read()):
        if re.match(r'^(https?:|mailto:|tel:|#|data:)', h): continue
        p = h.split('#')[0].split('?')[0]
        if not p: continue
        t = p.lstrip('/') if p.startswith('/') else os.path.join(os.path.dirname(f), p)
        t = os.path.normpath(t)
        if os.path.isdir(t) or t.endswith('/'): t = os.path.join(t, 'index.html')
        if not os.path.exists(t): print('BROKEN', f, '->', h); bad += 1
print('link check done, %d broken' % bad)
EOF
```

Then validate the markup at <https://validator.w3.org/nu/> and run Lighthouse
(see PERFORMANCE.md).
