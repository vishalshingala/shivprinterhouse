# Accessibility — WCAG 2.2 AA

Target: **WCAG 2.2 Level AA**. What follows is what was actually implemented,
followed by the checks that still need a human.

## Implemented

### Structure and semantics
- One `<h1>` per page, and no skipped heading levels (h1 → h2 → h3).
- Real landmarks: `<header>`, `<nav>`, `<main id="main">`, `<footer>`.
- Two navs on a page are distinguished by `aria-label` ("Main", "Breadcrumb",
  "Quick contact") so screen-reader users can tell them apart.
- Lists are `<ul>`/`<ol>`, tables use `<caption>`, `<thead>` and
  `<th scope="col">` / `<th scope="row">`.
- `<address>` for the postal address; `lang="en-IN"` on `<html>`.
- FAQs are native `<details>`/`<summary>` — keyboard and screen-reader accessible
  with no ARIA and no JavaScript.

### Keyboard
- Logical DOM order; no `tabindex` above 0 anywhere.
- **Skip link** to `#main` as the first focusable element, visible on focus.
- A single global `:focus-visible` rule — a 3px brand outline with 2px offset.
  Focus indicators are never removed.
- The mobile menu is a real `<button>` with `aria-expanded`, closes on `Escape`
  and returns focus to the button.
- The theme toggle is a `<button>` with `aria-pressed` and an `aria-label` that
  updates to describe the action.
- Everything interactive is a `<button>` or `<a>` — no click handlers on `<div>`s.

### Non-text content
- Icons are inline SVG with `aria-hidden="true" focusable="false"` — decorative,
  so they are skipped rather than announced.
- Icon-only links (social, map) carry a `.sr-only` text label, so they are not
  announced as just "link".
- The logo uses `alt=""` because the business name sits beside it as text;
  announcing it twice would be noise.
- No information is conveyed by colour alone.

### Forms
- Every control has a `<label for>` pointing at a real `id` (verified).
- Required fields use the `required` attribute, not just a visual asterisk; the
  asterisk itself is `aria-hidden`.
- Help text sits inside the `<label>`, so it is announced with the field.
- `autocomplete="name"` / `"tel"` and `inputmode="tel"` set (WCAG 2.2
  *3.3.7 Redundant Entry* / *1.3.5 Identify Input Purpose*).
- Placeholders are never used as the only label.

### Motion and preferences
- `@media (prefers-reduced-motion: reduce)` collapses all transitions and
  disables smooth scrolling.
- Dark mode follows `prefers-color-scheme`, with a manual override that persists.
- No autoplay, no carousels, no motion that cannot be stopped.

### Target size (WCAG 2.2, new in this version)
- *2.5.8 Target Size (Minimum)* — buttons and nav links are at least 24×24 CSS
  px; the mobile call/WhatsApp bar and nav rows are ~44px tall.

### Zoom and reflow
- `<meta name="viewport">` sets no `maximum-scale` and no `user-scalable=no`, so
  pinch-zoom works.
- Layout is fluid down to 320px with no horizontal scrolling; wide tables scroll
  inside their own `.table-wrap` container rather than the page body
  (*1.4.10 Reflow*).
- Text sizing uses `rem`/`clamp()`, so browser font-size settings are respected
  and 200% zoom reflows rather than clipping (*1.4.4*).

### Contrast
Design tokens were chosen to clear **4.5:1** for body text and **3:1** for large
text and UI borders, in both themes. Key pairs:

| Pair | Light | Dark |
|---|---|---|
| `--text` on `--bg` | `#131920` on `#ffffff` — ~16.9:1 | `#e7edf5` on `#0f1319` — ~15.8:1 |
| `--text-muted` on `--bg` | `#545f6d` on `#ffffff` — ~7.0:1 | `#9aa7b8` on `#0f1319` — ~8.4:1 |
| `--brand` link on `--bg` | `#10457e` on `#ffffff` — ~9.4:1 | `#6aa9e9` on `#0f1319` — ~7.8:1 |
| Button text on `--brand` | `#ffffff` on `#10457e` — ~9.4:1 | `#0f1319` on `#6aa9e9` — ~7.8:1 |

Note the dark-theme button rule: because `--brand` becomes a *light* blue in dark
mode, button text flips to near-black. Getting this wrong (white on light blue)
is the easiest way to fail contrast here — check it if you change the palette.

## Still needs a human

Automated tools catch perhaps a third of real problems. Before launch:

- [ ] **Keyboard-only pass.** Tab through every page. Can you reach and operate
      the menu, the theme toggle, "Load the map", every FAQ, and the whole form?
      Is focus always visible? Does focus never get trapped?
- [ ] **Screen reader pass.** NVDA (Windows, free) or VoiceOver (Mac, ⌘F5).
      Check the heading outline reads sensibly, links make sense out of context,
      and the form announces labels, required state and errors.
- [ ] **400% zoom** at 1280px width — content should reflow to one column with no
      horizontal scrollbar.
- [ ] **Windows High Contrast / forced-colors mode** — confirm the masked CSS
      icons (hamburger, ticks) do not disappear. They use `background:
      currentColor` with a mask, which usually survives, but verify.
- [ ] **Contrast re-check** if you change any colour — <https://webaim.org/resources/contrastchecker/>
- [ ] **axe DevTools** or Lighthouse accessibility audit on every page (expect
      100 on the automated portion).
- [ ] **Real content check** — when photos are added, confirm every `alt` is
      descriptive rather than a filename.
- [ ] **Form error states.** The current form relies on native browser
      validation. If you add custom errors, they must be programmatically
      associated (`aria-describedby`) and announced, not colour-only.

## If you change things

- Adding a page: keep one `<h1>`, don't skip heading levels, keep the skip link.
- Adding an icon: `aria-hidden="true"` if decorative; a `.sr-only` label if it is
  the only content of a link or button.
- Adding a colour: check both themes against the table above.
- Adding JavaScript interaction: it must work from the keyboard, and the
  no-JavaScript path must still be usable. Everything on this site currently is.
