# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository state

This repo currently contains **only `SKILL.md`** — a specification for a static website that has not been built yet. There is no source code, no build system, no dependency manifest, and no tests. `SKILL.md` is the authoritative brief; read it before generating anything.

## Commands

There are intentionally **no build, install, or test commands**. The spec forbids build pipelines and runtime dependencies, so the deployed artifact is the source: hand-written HTML/CSS/JS served as-is.

To preview locally, serve the repo root with any static file server (e.g. `python3 -m http.server 8000`). Do not add a `package.json`, bundler, or task runner without an explicit request — doing so violates a core constraint.

Validation is manual/external rather than scripted: W3C HTML validation, Lighthouse (target 95+), and the accessibility/security checklists listed in `SKILL.md`.

## Architecture constraints

These are hard requirements from `SKILL.md`, not preferences:

- **No frameworks.** No React, Vue, Angular, Svelte, Next/Nuxt/Astro, no SSR, no Node server, no CSS frameworks.
- **JavaScript is optional and minimal.** Permitted only for mobile navigation, an image gallery, and an optional theme toggle. Everything must work with JS disabled.
- **CSP-compatible by construction.** Never write inline `<script>`/`<style>`, `eval()`, `new Function()`, `document.write()`, or inline event handlers (`onclick=`). The target CSP has no `unsafe-inline`/`unsafe-eval`, so inline code silently breaks in production rather than failing loudly in dev.
- **Self-hosted assets only.** Fonts, icons, and images live in `assets/`. No CDNs, no third-party requests, no analytics unless explicitly requested.
- **CSS approach:** CSS custom properties, Flexbox/Grid, container queries. Modular files under `assets/css/`.

Design reference is https://oat.ink/ — used as visual inspiration, not as a dependency to install.

## Planned structure

Directory-per-page with `index.html` inside each (clean URLs without `.html`), shared assets at the root:

```
index.html, about/, products/, services/, brands/, contact/
assets/{css,js,images,fonts,icons}/
sitemap.xml, robots.txt, manifest.webmanifest, favicon.ico
```

Pages called for: Home, About Us, Brands, Printer Sales, Printer Services, Spare Parts, Cartridge Refilling, Wholesale, Contact, Privacy Policy, Terms of Service.

Must deploy unmodified to GitHub Pages, Netlify, Cloudflare Pages, and AWS S3 — so use relative paths and avoid host-specific config as the only source of routing behavior.

## Business data (canonical — reuse verbatim, do not paraphrase)

**Shiv Printer House** — printer sales, service, and retail/wholesale spare parts.

Address: Shiv Printer House (Ground Floor), #69, Samrudhi Bhawan, Gondal Road, Bhaktinagar Station Plot, Bhakti Nagar, Rajkot – 360001, Gujarat, India

Contacts:
- Alpesh Shingala — `tel:+919979468675` / `https://wa.me/919979468675`
- Nalin Shingala — `tel:+919687106227` / `https://wa.me/919687106227`

Click-to-call and WhatsApp links belong on the Contact page *and* in the mobile header. Every page needs a footer with business name, full address, contact numbers, quick nav, copyright, and Privacy/Terms links.

## SEO requirements

Every page needs: meta title, meta description, canonical URL, Open Graph and Twitter Card tags. JSON-LD for LocalBusiness (name, full address, postal code 360001, city, state, country, phone numbers, category) plus Organization, and Breadcrumb schema where a page sits below the root.

Omit `geo` coordinates and `openingHours` from the schema unless the values are supplied — leave them as clearly marked configurable fields rather than guessing.

## No placeholder content

Do not fill gaps with lorem ipsum or invented specifics. For missing business information — email address, business hours, GST number, logo, social media links, Google Maps embed coordinates — either ask the user or mark the field as explicitly configurable with a visible comment. The site should be production-ready, not a mockup.

Google Maps on the Contact page is optional: structure the markup so an embed can be dropped in later without a redesign (and note that adding it will require relaxing `frame-src` in the CSP).
