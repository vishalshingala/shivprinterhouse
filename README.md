# Shiv Printer House — static website

Printer sales, service and spare parts business site for **Shiv Printer House**,
Gondal Road, Rajkot, Gujarat.

Hand-written HTML5 + CSS with ~4 KB of optional JavaScript. **No build step, no
dependencies, no framework.** The repository root *is* the deployable site.

---

## Before you launch: 5 things to replace

The site is production-ready except for values nobody has supplied yet. Each is
marked in the source with an `<!-- CONFIG ... -->` comment.

| # | What | Current placeholder | Where |
|---|------|--------------------|-------|
| 1 | **GSTIN** | `24XXXXXXXXXXXZX` (a template, not a real number) | footer of every page, `contact/`, `terms/` |
| 2 | **Domain** | `https://www.shivprinterhouse.com` | canonical + `og:url` in all pages, `sitemap.xml`, `robots.txt` |
| 3 | **Email** | `info@shivprinterhouse.com` | footer, `contact/`, `privacy/`, `terms/` |
| 4 | **Business hours** | Mon–Sat 10:00–19:30, Sun closed | footer, `contact/`, `about/`, JSON-LD on `index.html` + `contact/` |
| 5 | **Social profiles** | suggested handles — **may not exist yet** | footer of every page, `sameAs` in `index.html` JSON-LD |

Full details and exact commands: **[docs/SITE-CONFIG.md](docs/SITE-CONFIG.md)**.

> The GSTIN is deliberately a visibly-fake template. A made-up GST number on a
> live business site is a misrepresentation, so it needs the real one before
> launch.

---

## Preview locally

There is nothing to install and nothing to compile.

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Any static server works (`npx serve`, `php -S`, VS Code Live Server). Open the
file directly with `file://` and most things still work, but relative directory
URLs like `/about/` will not resolve — use a server.

## Deploy

The site works unmodified on all four targets because every asset path is
**relative**.

### Cloudflare Pages
1. Connect the repository.
2. Build command: *(leave empty)* · Build output directory: `/`
3. `_headers` is applied automatically.

### Netlify
1. Connect the repository. `netlify.toml` sets `publish = "."` and no build command.
2. `_headers` is applied automatically.
3. The contact form works out of the box — see *Contact form* below.

### GitHub Pages
1. Settings → Pages → Deploy from branch → `main` / root.
2. **GitHub Pages cannot send custom headers.** The CSP and security headers in
   `_headers` will be ignored. Either put Cloudflare in front of it, or accept
   the reduced hardening. Everything else works.
3. Deploying to `username.github.io/repo/` works because paths are relative.

### AWS S3 + CloudFront
1. `aws s3 sync . s3://your-bucket --delete --exclude ".git/*" --exclude "docs/*" --exclude "SKILL.md" --exclude "*.md"`
2. Index document `index.html`, error document `404.html`.
3. Add the headers via a CloudFront **response headers policy** — see
   [docs/SECURITY.md](docs/SECURITY.md) for the exact values.

## Contact form

The form on `contact/` is wired for **Netlify Forms** (`data-netlify="true"`
plus a honeypot field). It needs no JavaScript and no API key.

- **On Netlify:** works immediately; submissions appear in the dashboard. Add a
  notification email to have them forwarded.
- **Anywhere else:** the form will not submit. Either connect a static form
  service (Formspree, Cloudflare Worker, Web3Forms) — which means updating
  `form-action` in the CSP — or delete the `<form>` block. Phone, WhatsApp and
  email are prominent on the page regardless, and are how most customers here
  actually get in touch.

## What's where

```
index.html              Home
about/  brands/  contact/  privacy/  terms/
printer-sales/          New printer sales
services/               Repair, on-site service, AMC
products/               Spare parts & consumables
cartridge-refilling/    Toner & ink refilling
wholesale/              Trade supply
404.html
assets/css/style.css    The entire design system (~1 file, no framework)
assets/js/site.js       Theme toggle, mobile nav, click-to-load map. All optional.
assets/icons/           Logo + favicon (SVG) and generated PNG app icons
assets/images/          Open Graph image
_headers                CSP + security + caching (Netlify / Cloudflare Pages)
netlify.toml            Netlify config (no build)
sitemap.xml  robots.txt  manifest.webmanifest  favicon.ico
docs/                   Config, maintenance, security, a11y, performance
```

## Docs

- **[SITE-CONFIG.md](docs/SITE-CONFIG.md)** — every placeholder and how to change it
- **[MAINTENANCE.md](docs/MAINTENANCE.md)** — editing content, adding pages/images, gotchas
- **[SECURITY.md](docs/SECURITY.md)** — CSP explained, headers for every host, checklist
- **[ACCESSIBILITY.md](docs/ACCESSIBILITY.md)** — WCAG 2.2 AA checklist and what was done
- **[PERFORMANCE.md](docs/PERFORMANCE.md)** — Lighthouse notes and the budget

## Design and technical choices

- **No web font.** A system font stack means zero font requests and zero
  swap-in layout shift. See MAINTENANCE.md to self-host one if branding needs it.
- **No third-party requests at all** on a normal page view. The Google Maps
  embed is the single exception and is injected only after the visitor clicks
  "Load the map".
- **Illustration over stock photography.** Inline SVG rather than invented
  photos of a shop we have not seen. Add real photos when you have them —
  MAINTENANCE.md has the markup pattern.
- **No inline styles or inline scripts anywhere**, so the CSP needs no
  `unsafe-inline`. Utility classes at the end of `style.css` exist for this reason.
- **Dark mode** follows the OS and can be overridden by the header toggle.
