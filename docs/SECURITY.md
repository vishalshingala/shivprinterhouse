# Security

A static site has a small attack surface, but "small" is not "none". The
approach here is defence in depth: no third-party code, a strict CSP, and no
place for secrets to leak because there are none in the repository.

## Content Security Policy

Live in `_headers`:

```
default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none';
form-action 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:;
font-src 'self'; connect-src 'self'; manifest-src 'self'; worker-src 'self';
media-src 'self'; frame-src https://www.google.com; upgrade-insecure-requests
```

| Directive | Why |
|---|---|
| `default-src 'self'` | Everything not named below is first-party only. |
| `script-src 'self'` | **No `unsafe-inline`, no `unsafe-eval`.** All JS is in `assets/js/site.js`. |
| `style-src 'self'` | No `unsafe-inline` either — this is why there are zero `style=""` attributes. |
| `img-src 'self' data:` | `data:` is needed for the SVG icons masked in CSS (hamburger, tick). |
| `object-src 'none'` | No Flash/applets, ever. |
| `base-uri 'self'` | Stops an injected `<base>` from re-pointing every relative URL. |
| `frame-ancestors 'none'` | Nobody may frame this site (clickjacking). |
| `form-action 'self'` | A form cannot be repointed at an attacker's collector. **Change this if you move the contact form to an external service.** |
| `frame-src https://www.google.com` | The single third-party allowance: the Maps embed. |
| `upgrade-insecure-requests` | Any stray `http://` reference is upgraded. |

### Why `unsafe-inline` is absent and must stay absent

`unsafe-inline` on `script-src` defeats the main purpose of CSP: it re-enables
exactly the injected-`<script>` XSS the policy exists to stop. The site was
written to not need it — see the utility classes at the end of `style.css`, which
exist solely so no element needs a `style` attribute.

If you ever "fix" a styling problem with an inline style, it will work locally
and silently fail in production. That is the intended failure mode.

### Why COEP is not set

`Cross-Origin-Embedder-Policy: require-corp` would break the Google Maps iframe,
which does not send the required CORP header. Since the only cross-origin
resource is that iframe and there is nothing on the site that needs cross-origin
isolation (no `SharedArrayBuffer`, no high-resolution timers), COEP buys nothing
here and costs the map. COOP and CORP *are* set.

### The map is the only third-party resource

`frame-src` is the one hole in the policy, and even that is not used until the
visitor clicks **"Load the map"** — `assets/js/site.js` injects the iframe on
click. A normal page view makes zero requests to Google. If you remove the map,
delete `frame-src` too.

**Before adding any third-party resource** — analytics, a chat widget, a font
CDN, a review badge — you must widen the CSP. Treat that as the moment to ask
whether it is worth the privacy, performance and security cost. For a local
printer shop, it usually is not.

## Full header set

Applied to `/*` by `_headers`:

| Header | Value | Purpose |
|---|---|---|
| `Content-Security-Policy` | see above | Resource allow-list |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | HTTPS only, for a year |
| `X-Content-Type-Options` | `nosniff` | No MIME sniffing |
| `X-Frame-Options` | `DENY` | Clickjacking (legacy backstop to `frame-ancestors`) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Don't leak full URLs |
| `Permissions-Policy` | camera, mic, geolocation etc. `=()` | Denies powerful APIs the site never uses |
| `Cross-Origin-Opener-Policy` | `same-origin` | Isolates the browsing context |
| `Cross-Origin-Resource-Policy` | `same-origin` | Blocks cross-origin embedding of our resources |
| `X-Permitted-Cross-Domain-Policies` | `none` | Legacy Adobe policy files |

`_headers` is read natively by **Netlify** and **Cloudflare Pages**. Other hosts
need the same policy expressed their way.

> **GitHub Pages cannot set custom headers at all.** If you deploy there, none of
> this applies. Put Cloudflare (free tier) in front of it and set the headers
> there, or accept that the site runs without CSP or HSTS.

### nginx

```nginx
add_header Content-Security-Policy "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; manifest-src 'self'; worker-src 'self'; media-src 'self'; frame-src https://www.google.com; upgrade-insecure-requests" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=()" always;
add_header Cross-Origin-Opener-Policy "same-origin" always;
add_header Cross-Origin-Resource-Policy "same-origin" always;

location ~* \.html$ { add_header Cache-Control "public, max-age=0, must-revalidate" always; }
location /assets/images/ { add_header Cache-Control "public, max-age=604800" always; }
location /assets/icons/  { add_header Cache-Control "public, max-age=604800" always; }
```

`add_header` does not inherit into nested blocks — repeat the security headers in
any `location` that sets its own, or use a shared `include`.

### Apache (`.htaccess`)

```apache
<IfModule mod_headers.c>
  Header always set Content-Security-Policy "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src https://www.google.com; upgrade-insecure-requests"
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "DENY"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
  Header always set Cross-Origin-Opener-Policy "same-origin"
  Header always set Cross-Origin-Resource-Policy "same-origin"
</IfModule>
```

### AWS S3 + CloudFront

S3 static hosting cannot set these. Create a CloudFront **response headers
policy** with the same values, attach it to the default cache behaviour, and
serve only via CloudFront (block direct bucket access with Origin Access
Control). Set the S3 error document to `404.html`.

## Checklist

Design and code:

- [x] No inline `<script>`, no `eval()`, no `new Function()`, no `document.write()`
- [x] No inline event handlers (`onclick=` etc.)
- [x] No inline `style` attributes — CSP needs no `unsafe-inline`
- [x] No third-party scripts, fonts, styles or images
- [x] No analytics, no tracking pixels, no fingerprinting
- [x] No secrets, API keys or tokens anywhere in the repository
- [x] Every `target="_blank"` carries `rel="noopener"`
- [x] External/user-facing links use `rel="noopener"`; policy links use `nofollow`
- [x] Map iframe injected only on explicit user consent, from a hard-coded URL —
      never from user input
- [x] Form has a honeypot field; no user input is ever rendered back into the page
- [x] `autocomplete` set on name/tel fields; no sensitive fields collected
- [x] No cookies. One `localStorage` key (`sph-theme`), disclosed in the privacy policy

Deployment — verify after going live:

- [ ] HTTPS enforced, HTTP 301s to HTTPS
- [ ] One canonical host; the other 301s to it
- [ ] Headers actually arrive:
      `curl -sI https://yourdomain.com | grep -iE "content-security|strict-transport|x-content"`
- [ ] Scan with <https://securityheaders.com> (target A/A+) and
      <https://csp-evaluator.withgoogle.com>
- [ ] Confirm no console CSP violations on `/` and `/contact/`, including after
      clicking "Load the map"
- [ ] HSTS preload submitted only once you are certain about HTTPS-forever
- [ ] Registrar/DNS and hosting accounts on 2FA
- [ ] If the form is live: check submissions arrive, and watch for spam volume

## Reporting

If someone reports a vulnerability, they will likely use the contact details on
the site. There is no bug bounty; just fix it and redeploy — with a static site
there is no server-side component to patch.
