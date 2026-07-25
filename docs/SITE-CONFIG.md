# Site configuration — placeholders to replace

Everything below is marked in the source with an `<!-- CONFIG <key> -->` comment.
Find them all with:

```bash
grep -rn "CONFIG" --include="*.html" --include="*.txt" --include="*.xml" .
```

---

## 1. GSTIN — **must be replaced**

**Current:** `24XXXXXXXXXXXZX` — a deliberately invalid template. `24` is the
Gujarat state code; the rest is placeholder.

I did not invent a plausible-looking GST number. Publishing a fabricated GSTIN
on a live business website misrepresents a real legal registration, so this is
the one value that must be corrected rather than left as-is.

```bash
grep -rln "24XXXXXXXXXXXZX" .          # footer of all 12 pages, contact/, terms/
sed -i 's/24XXXXXXXXXXXZX/YOUR_REAL_GSTIN/g' *.html */index.html
```

## 2. Domain — ✅ done

**Set to `https://shivprinterhouse.com`** (apex, no `www`), confirmed as the
registered domain. Used consistently in `<link rel="canonical">`, `og:url`,
`twitter:*`, the JSON-LD `@id` values, `sitemap.xml` and `robots.txt`.

Remaining task: **301 `www` to the apex**, so both forms resolve but only one is
canonical. On Cloudflare Pages, add both `shivprinterhouse.com` and
`www.shivprinterhouse.com` to the Pages project, then add a redirect rule
sending `www` to the apex. Leaving `www` unresolvable (as it is now) is also
acceptable, just less forgiving of people who type it.

If the domain ever changes:

```bash
sed -i 's|https://shivprinterhouse.com|https://newdomain.com|g' \
  *.html */index.html sitemap.xml robots.txt
```

All of these must agree, and must match the host visitors actually reach — a
canonical pointing at a domain that 301s elsewhere causes indexing problems.

## 3. Email address

**Current:** `info@shivprinterhouse.com`

```bash
sed -i 's/info@shivprinterhouse.com/real@address.com/g' *.html */index.html
```

## 4. Business hours

**Current:** Monday–Saturday 10:00–19:30, Sunday closed. **This was assumed, not
supplied** — a plausible Rajkot retail pattern. Confirm the real hours.

Three places must stay in sync:

1. Human-readable text — footer of every page, `contact/`, `about/`.
2. `openingHoursSpecification` in the JSON-LD on `index.html` (24-hour
   `opens`/`closes`).
3. Your Google Business Profile — Google cross-checks these.

If you close for a daily lunch break, that needs two `OpeningHoursSpecification`
entries rather than one continuous range.

## 5. Social media profiles — **verify before launch**

You asked me to suggest these. The handles below are **suggestions, not
confirmed accounts** — a footer icon linking to a profile that does not exist
looks worse than no icon at all. Either create/claim them under these handles,
update the URLs to your real ones, or delete the `<li>` entries.

| Platform | Suggested URL | Why it's worth having |
|---|---|---|
| **Google Business Profile** | already linked to your Maps listing ✅ | By far the highest impact for a local shop. Reviews and "near me" searches come from here. Claim it first. |
| **WhatsApp** | live, uses `+91 99794 68675` ✅ | Already how most customers will contact you. |
| Facebook | `facebook.com/shivprinterhouse` | Still the primary local business channel in Gujarat; good for shop updates and reach among older customers. |
| Instagram | `instagram.com/shivprinterhouse` | Photos of repairs, before/after, new stock. Cheap to run, builds trust. |
| YouTube | `youtube.com/@shivprinterhouse` | Optional. Short "how to clear a paper jam" clips attract search traffic and reduce trivial callouts. |

Also worth considering, not added to the site: **IndiaMART** and **JustDial**
listings, which drive real wholesale enquiries in this trade. They need a seller
account first, so add the links once the accounts exist.

Update in two places:

```bash
grep -n "CONFIG social" */index.html *.html      # footer block
grep -n '"sameAs"' index.html                    # JSON-LD
```

Delete the unused ones from **both**, or Google may treat a dead `sameAs` as a
weak signal.

---

## Smaller items

| Key | Where | Note |
|---|---|---|
| `CONFIG date` | `privacy/`, `terms/` | "Last updated: 25 July 2026". Bump when you change the text. |
| `CONFIG warranty-period` | `terms/` §6 | State the repair warranty you actually give, and match your job cards. |
| `CONFIG storage-period` | `terms/` §7 | Period after which uncollected equipment may be disposed of. |
| `CONFIG form` | `contact/` | Form backend. See README → Contact form. |
| `CONFIG form-processor` | `privacy/` §4 | Must name whatever actually processes submissions. |
| `CONFIG hours` | `contact/` | See §4 above. |
| `CONFIG gstin` | footer, `contact/`, `terms/` | See §1 above. |
| `CONFIG domain` | `robots.txt`, `sitemap.xml` | See §2 above. |

## Values that are already correct

Verified against what you supplied — do not "fix" these:

- Business name, and the full address including postal code 360001.
- `+91 99794 68675` (Alpesh Shingala) and `+91 96871 06227` (Nalin Shingala),
  as both `tel:` and `wa.me/` links.
- Geo coordinates **22.283303, 70.799252**, resolved from the Google Maps link
  you gave. These match "Samrudhi Bhawan" on Gondal Road, which corroborates the
  street address. Used in the `GeoCoordinates` JSON-LD and the map embed.
- `hasMap` → your original `maps.app.goo.gl` short link.

## After launch

1. Submit `sitemap.xml` in Google Search Console.
2. Run the [Rich Results Test](https://search.google.com/test/rich-results) on
   `/` and `/contact/` to confirm LocalBusiness and FAQ parse.
3. Claim/verify the Google Business Profile and make its name, address, phone
   and hours **identical** to the site. Inconsistency is the most common local
   SEO problem.
4. Re-check `docs/SECURITY.md` headers actually arrive:
   `curl -sI https://yourdomain.com | grep -i content-security`
