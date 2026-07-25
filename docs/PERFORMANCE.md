# Performance — Lighthouse notes

Targets from the brief: **Lighthouse 95+**, FCP < 1s, LCP < 2s, CLS ≈ 0.

## Why this site is fast

Not from optimisation tricks — from not shipping much in the first place.

| Decision | Effect |
|---|---|
| No framework, no hydration | Zero JS parse/execute cost on the critical path |
| One CSS file, ~14 KB uncompressed (~4 KB gzipped) | One blocking request, cached after first view |
| `assets/js/site.js` is ~4 KB and `defer`red | Never blocks parsing or first paint |
| **System font stack** | Zero font requests, zero swap-in reflow, no FOIT/FOUT |
| Inline SVG icons | No icon font, no sprite request, sharp at any DPI |
| No third-party requests on a normal page view | No DNS/TLS to unknown hosts, no unpredictable latency |
| Map loads on click only | The heaviest thing on the site costs nothing unless wanted |

Total critical path for a first view: **1 HTML + 1 CSS**. Everything else is
deferred, lazy, or absent.

## Requests on a first page view

```
index.html          ~31 KB  (~7 KB gzipped)
assets/css/style.css ~14 KB  (~4 KB gzipped)
assets/js/site.js     ~4 KB  deferred
assets/icons/logo.svg  ~1 KB
favicon.ico                 (browser, cached)
```

No render-blocking JS. No web fonts. No images above the fold — the hero is text
and CSS gradient, which is why LCP is fast.

## CLS ≈ 0 by construction

Layout shift was designed out, not measured out:

- The logo `<img>` has explicit `width`/`height`.
- The theme toggle is hidden with `visibility: hidden`, **not** `display: none`,
  so its box occupies space from the first paint. `site.js` reveals it without
  moving anything. (This is a deliberate choice — `display:none` here would shift
  the header on every page load.)
- The map container has a fixed `aspect-ratio: 16 / 10`, so injecting the iframe
  does not resize anything.
- No web font, so no swap-in reflow.
- No late-injected banners, no ads, no cookie bar.

**The main way to break this** is adding an image without `width`/`height`. See
MAINTENANCE.md → Images.

## Caching

Set in `_headers`:

| Path | Policy | Reasoning |
|---|---|---|
| `*.html`, `/` | `max-age=0, must-revalidate` | Content edits go live immediately |
| `/assets/css/*`, `/assets/js/*` | `max-age=86400, must-revalidate` | **Not content-hashed** (no build step), so they cannot be immutable |
| `/assets/images/*`, `/assets/icons/*` | `max-age=604800` | Change rarely |
| `/assets/fonts/*` | `max-age=31536000, immutable` | Only if you add self-hosted fonts |

The CSS/JS window is a deliberate compromise: no build step means no content
hashes, and caching un-hashed assets for a year would strand visitors on stale
files. If a change must appear instantly, bump `?v=` (MAINTENANCE.md → Cache
busting).

Enable Brotli or gzip at the host — Netlify and Cloudflare Pages do this
automatically. It is the single biggest remaining win, roughly 4× on HTML/CSS.

## Measuring

```bash
# Local, needs a server running
python3 -m http.server 8000 &
npx lighthouse http://localhost:8000/ --view --preset=desktop
npx lighthouse http://localhost:8000/ --view    # mobile, the stricter one
```

Test the **deployed** URL too — compression and real latency only show up there.
Use PageSpeed Insights (<https://pagespeed.web.dev>) for field-accurate mobile
throttling.

Pages worth checking individually:
- `/` — the reference page.
- `/contact/` — the only page with an iframe. Audit it **before** clicking "Load
  the map" (that is what real visitors get) and after (the worst case).
- `/products/` and `/brands/` — the largest DOMs, with long tables and lists.

## Expected results and honest caveats

Static HTML with one stylesheet and a deferred 4 KB script should score at or
near 100 on Performance, Accessibility, Best Practices and SEO, on both desktop
and mobile.

Two caveats:

1. **These figures have not been measured on a deployed instance.** File sizes
   above are real; Lighthouse scores are expectations based on the structure, not
   observed results. Run it yourself after deploying.
2. **Clicking "Load the map" will hurt the Performance score on `/contact/`.**
   The Google Maps iframe pulls in a large amount of third-party JavaScript that
   is entirely outside our control. This is the intended trade-off — the cost is
   only paid by visitors who ask for the map, and never on any other page.

## If the score drops

Look at what was added, in this order of likelihood:

1. An image without `width`/`height`, or an unresized photo → CLS and LCP.
2. A third-party script (analytics, chat widget, review badge) → blocks the main
   thread and requires opening the CSP. Usually not worth it.
3. A web font, especially from a CDN → extra connection plus swap reflow.
4. A large hero image with `loading="lazy"` → lazy-loading above the fold delays
   LCP. Never lazy-load the hero.
5. Autoplaying video or a carousel library → both are avoidable.

## Budget

Keep a first page view under:

- **50 KB** HTML + CSS + JS, gzipped
- **1 render-blocking request** (the stylesheet)
- **0 third-party requests** before user interaction
- **0** layout shift from anything we control
