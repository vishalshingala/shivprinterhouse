# Photo gallery — how to add photos

**Short version:** put photos in `assets/images/gallery/originals/`, commit, push.
They appear on the site a minute later, resized and optimised. You never touch HTML.

---

## Adding photos

```bash
cp ~/Downloads/shopfront.jpg assets/images/gallery/originals/
git add assets/images/gallery/originals
git commit -m "Add shopfront photo"
git push
```

That's it. On push, the **Build photo gallery** GitHub Action:

1. resizes each photo to **400 / 800 / 1600 px** wide and converts it to **WebP**
2. writes those into `assets/images/gallery/`
3. regenerates the gallery on `/gallery/` and the teaser strip on the home page
4. commits the results

Cloudflare Pages then deploys as usual. Watch progress in the repo's **Actions** tab.

Originals are never published — only the WebP derivatives are referenced by the
site. You can drop in a full-size 6 MB phone photo; visitors receive a file
around 60–150 KB.

**Filename becomes the URL,** so use lowercase words with hyphens:
`workshop-bench.jpg`, not `IMG_20260726_112233.JPG`.

## Captions, alt text and grouping

Entirely optional, but worth doing. Edit `assets/images/gallery/captions.json`:

```json
{
  "shopfront.jpg": {
    "alt": "Shiv Printer House shopfront on Gondal Road, Rajkot",
    "caption": "Our shop on Gondal Road, Bhaktinagar",
    "group": "Our shop",
    "order": 1
  },
  "workshop-bench.jpg": {
    "alt": "Technician replacing a fuser unit on an HP LaserJet",
    "caption": "Fuser replacement on the bench",
    "group": "Workshop & repairs",
    "order": 2
  }
}
```

| Field | Meaning |
|---|---|
| `alt` | Describes the photo for screen-reader users and search engines. **Write a real one** — this is also what Google reads. |
| `caption` | Text shown under the photo. Omit for none. |
| `group` | Section heading. Default `Photos`. |
| `order` | Lower first. Default `9999`, then alphabetical. |

Groups render in this order, then any others alphabetically:
`Our shop` → `Workshop & repairs` → `Spare parts & stock` →
`Printers we supply` → `Our team` → `Photos`.

Changing only `captions.json` also triggers a rebuild, so you can retitle
photos without re-uploading them.

## What to photograph

You don't need a camera — a recent phone in daylight beats mediocre stock
photography, because it shows *your* shop. Aim for **10–15 photos, at least 3
per group**, otherwise a group looks sparse next to the others.

Worth taking:

1. **Shopfront** from across Gondal Road, sign clearly legible — this reassures
   people they've found the right place.
2. **The counter**, straight on, tidy.
3. **Parts shelves**, wide enough to show the depth of stock. This is the shot
   that convinces wholesale buyers you actually hold inventory.
4. **Repair bench** with a printer opened up mid-service.
5. **Close-up of a repair** — hands, a fuser or roller being fitted. The single
   most persuasive type of shot for a service business.
6. **Toner and cartridge stock**, boxes stacked and visible.
7. **A row of printers** for sale.
8. **Dot-matrix / TVS machines**, which distinguish you from generic sellers.
9. **Alpesh and Nalin** at the counter — a face makes a business real. Only with
   their consent, obviously.
10. **A delivery or on-site visit** in progress, if convenient.

Practical tips:

- Shoot **landscape** (sideways). Tiles are 4:3 landscape; portrait photos get
  cropped top and bottom.
- Use daylight or turn on all the lights. Avoid flash — it flattens everything
  and reflects off printer casings.
- Wipe dust off machines first; it shows badly in photos.
- Keep customers' documents, invoices and screens out of frame — printers often
  have paperwork on them, and that's other people's private information.
- Straighten up. A tidy shelf photographs far better than a full one.

## Running it locally (optional)

You never need to, but if you want to preview before pushing:

```bash
pip install Pillow          # one-off
python3 tools/build_gallery.py
python3 -m http.server 8000 # then open http://localhost:8000/gallery/
```

The script is idempotent and skips any derivative already newer than its
original, so re-running is cheap.

## Removing a photo

Delete it from `originals/`, delete its `-400/-800/-1600.webp` files from
`assets/images/gallery/`, then commit and push. Removing only the original
leaves orphaned derivatives; they're unreferenced and harmless, but untidy.

## Behaviour when there are no photos

- `/gallery/` shows a short "Photos coming soon" message with contact buttons —
  customer-facing copy, not instructions.
- The home page teaser section **does not render at all**, so the home page never
  looks half-finished.

Both switch over automatically the moment a photo exists.

## Troubleshooting

**Nothing happened after pushing.** Check the **Actions** tab. The workflow only
runs for pushes to `main` that touch `assets/images/gallery/originals/**`,
`captions.json`, or the script itself.

**"Pillow is required".** The workflow installs it; locally run `pip install Pillow`.

**A photo is rotated wrongly.** The script honours EXIF orientation, so this is
rare. Re-save the photo and push again.

**captions.json errors.** The build fails loudly with the JSON error and line.
A trailing comma after the last entry is the usual cause.

**A photo appears but is not in the group I expected.** The key in
`captions.json` must match the filename *exactly*, including extension and case.

## How this relates to the "no build step" rule

The original brief ruled out build pipelines, and the site still honours that
where it matters: the deployed output is plain static HTML with no runtime
dependencies, the repo root remains directly deployable, and nothing breaks if
this script never runs again. The Action is an **authoring** convenience whose
output is committed — not a build the site depends on.

If you ever want to drop the automation entirely, delete
`.github/workflows/gallery.yml` and add photos by hand following the markup
pattern in `docs/MAINTENANCE.md`. The site keeps working.
